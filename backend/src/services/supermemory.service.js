import Supermemory from "supermemory";
import "dotenv/config";

const supermemory = new Supermemory(process.env.SUPERMEMORY_API_KEY);

// Store path generation context
export const storePathMemory = async (userId, pathId, pathData) => {
  try {
    const memoryContent = `
User ID: ${userId}
Path ID: ${pathId}
Path Title: ${pathData.title}
Goal Type: ${pathData.goalType}
Timeframe: ${pathData.timeframe} ${pathData.goalType === "shortTerm" ? "months" : "years"}
Feasibility Score: ${pathData.feasibilityScore}
User Description: ${pathData.userGoalDescription || "Not provided"}

Checkpoints:
${pathData.checkpoints.map((cp, i) => 
  `${i + 1}. ${cp.title} (${cp.duration})
   Description: ${cp.description}`
).join('\n\n')}
`;

    await supermemory.memories.add({
        content: memoryContent,
        containerTag: "path",
        metadata: {"userId": userId, "pathId": pathId}
    })

    return { success: true };
  } catch (error) {
    console.error("Supermemory store error:", error);
    return { success: false, error: error.message };
  }
};

// Retrieve context for path regeneration
export const getPathMemory = async (userId, pathId) => {
  try {
    const query = `path history for user ${userId} and path ${pathId}`;
    
    const results = await supermemory.search.memories(query, {
      filter: {
        userId,
        pathId,
        type: "learning_path"
      }
    });

    if (results.length === 0) {
      return { success: false, message: "No memory found" };
    }

    return { 
      success: true, 
      context: results[0].content 
    };
  } catch (error) {
    console.error("Supermemory retrieve error:", error);
    return { success: false, error: error.message };
  }
};

// Get user's path generation history
export const getUserPathHistory = async (userId) => {
  try {
    const query = `all learning paths for user ${userId}`;
    
    const results = await supermemory.memories.search(query, {
      filter: {
        userId,
        type: "learning_path"
      },
      limit: 5
    });

    return {
      success: true,
      memories: results.map(r => r.content)
    };
  } catch (error) {
    console.error("Supermemory history error:", error);
    return { success: false, error: error.message };
  }
};