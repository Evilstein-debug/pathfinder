import Path from "../models/path.model.js";
import Checkpoint from "../models/checkpoint.model.js";
import { generatePathWithAI } from "../services/ai.service.js";
import { 
  storePathMemory, 
  updatePathMemory,
  getPathMemory,
  getUserPathHistory 
} from "../services/supermemory.service.js";

// @desc    Generate AI-powered learning path
// @route   POST /api/ai/generate-path
// @access  Private
export const generateAIPath = async (req, res) => {
  try {
    const { goalType, timeframe, userGoalDescription } = req.body;

    // Validate input
    if (!goalType || !timeframe) {
      return res.status(400).json({
        message: "goalType and timeframe are required"
      });
    }

    if (!["shortTerm", "longTerm"].includes(goalType)) {
      return res.status(400).json({
        message: "goalType must be 'shortTerm' or 'longTerm'"
      });
    }

    if (typeof timeframe !== "number" || timeframe <= 0) {
      return res.status(400).json({
        message: "timeframe must be a positive number"
      });
    }

    // Generate path using Gemini AI (no context for first generation)
    const aiResult = await generatePathWithAI(
      goalType, 
      timeframe, 
      userGoalDescription,
      null
    );

    if (!aiResult.success) {
      return res.status(500).json({
        message: "Failed to generate path with AI",
        error: aiResult.error
      });
    }

    const { pathTitle, checkpoints, feasibilityScore, feasibilityReason } = aiResult.data;

    // Create path in database
    const path = await Path.create({
      user: req.user._id,
      title: pathTitle,
      goalType,
      timeframe,
      feasibilityScore
    });

    // Create checkpoints
    if (Array.isArray(checkpoints) && checkpoints.length > 0) {
      const checkpointDocs = checkpoints.map((cp, index) => ({
        pathID: path._id,
        title: cp.title,
        description: cp.description || "",
        duration: cp.duration || "",
        order: index + 1,
        completed: false
      }));

      const savedCheckpoints = await Checkpoint.insertMany(checkpointDocs);
      
      path.checkpoints = savedCheckpoints.map(cp => cp._id);
      await path.save();
    }

    // Store in Supermemory for future context
    await storePathMemory(req.user._id.toString(), path._id.toString(), {
      title: pathTitle,
      goalType,
      timeframe,
      userGoalDescription: userGoalDescription || "",
      feasibilityScore,
      checkpoints
    });

    // Populate and return
    const populatedPath = await Path.findById(path._id).populate("checkpoints");

    res.status(201).json({
      message: "AI-generated path created successfully",
      path: populatedPath,
      feasibilityScore,
      feasibilityReason
    });

  } catch (error) {
    console.error("Generate AI path error:", error);
    res.status(500).json({
      message: "Error generating AI path",
      error: error.message
    });
  }
};

// @desc    Regenerate path with context from Supermemory
// @route   POST /api/ai/regenerate-path/:pathId
// @access  Private
export const regenerateAIPath = async (req, res) => {
  try {
    const { pathId } = req.params;
    const { timeframe, userGoalDescription } = req.body;

    // Find existing path
    const existingPath = await Path.findOne({ 
      _id: pathId, 
      user: req.user._id 
    }).populate("checkpoints");

    if (!existingPath) {
      return res.status(404).json({ message: "Path not found" });
    }

    // Get previous context from Supermemory
    console.log(`🔍 Searching for memory with pathId: ${pathId}`);
    const memoryResult = await getPathMemory(
      req.user._id,
      pathId
    );

    const previousContext = memoryResult.success ? memoryResult.context : null;
    
    if (previousContext) {
      console.log("✅ Found previous context:");
      console.log(previousContext.substring(0, 200) + "...");
    } else {
      console.log("⚠️ No previous context found, generating from scratch");
    }

    // Delete old checkpoints
    await Checkpoint.deleteMany({ pathID: pathId });

    // Generate new path WITH CONTEXT
    const aiResult = await generatePathWithAI(
      existingPath.goalType,
      timeframe || existingPath.timeframe,
      userGoalDescription,
      previousContext // Pass Supermemory context
    );

    if (!aiResult.success) {
      return res.status(500).json({
        message: "Failed to regenerate path",
        error: aiResult.error
      });
    }

    const { pathTitle, checkpoints, feasibilityScore } = aiResult.data;

    // Update path
    existingPath.title = pathTitle;
    existingPath.timeframe = timeframe || existingPath.timeframe;
    existingPath.feasibilityScore = feasibilityScore;
    existingPath.checkpoints = [];
    await existingPath.save();

    // Create new checkpoints
    if (Array.isArray(checkpoints) && checkpoints.length > 0) {
      const checkpointDocs = checkpoints.map((cp, index) => ({
        pathID: existingPath._id,
        title: cp.title,
        description: cp.description || "",
        duration: cp.duration || "",
        order: index + 1
      }));

      const savedCheckpoints = await Checkpoint.insertMany(checkpointDocs);
      existingPath.checkpoints = savedCheckpoints.map(cp => cp._id);
      await existingPath.save();
    }

    // UPDATE existing memory instead of deleting and creating new one
    await updatePathMemory(req.user._id.toString(), pathId, {
      title: pathTitle,
      goalType: existingPath.goalType,
      timeframe: existingPath.timeframe,
      userGoalDescription: userGoalDescription || "",
      feasibilityScore,
      checkpoints
    });

    const updatedPath = await Path.findById(pathId).populate("checkpoints");

    res.status(200).json({
      message: "Path regenerated successfully with context",
      path: updatedPath,
      usedPreviousContext: !!previousContext
    });

  } catch (error) {
    console.error("Regenerate path error:", error);
    res.status(500).json({
      message: "Error regenerating path",
      error: error.message
    });
  }
};