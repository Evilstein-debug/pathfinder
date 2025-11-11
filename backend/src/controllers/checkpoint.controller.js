import Checkpoint from "../models/checkpoint.model.js"
import Path from "../models/path.model.js"

export const addCheckpoint = async (req, res) => {
    try {
        const {pathId} = req.params     //.params is used to extract from id from the route
        const {title, description, duration} = req.body

        const path = await Path.findOne({_id: pathId, user: req.user._id})
        if(!path) {
            return res.status(404).json({message: "Path not found!"})
        }
        if(!title) {
            return res.status(404).json({message: "Path title is required!"})
        }

        const checkpointCount = await Checkpoint.countDocuments({pathID: pathId})

        const checkpoint = await Checkpoint.create({
            pathID: pathId,
            title,
            description: description || "",
            duration: duration || "",
            order: checkpointCount+1
        })

        path.checkpoints.push(checkpoint._id)
        await path.save()

        res.status(201).json({
            message: "Checkpoint added successfully",
            checkpoint
        })

    } catch (error) {
        console.error("Add checkpoint error:", error)
        res.status(500).json({
            message: "Error adding checkpoint.",
            error: error.message
        })
    }   
}

export const updateCheckpoint = async (req, res) => {
    try {
        const {checkpointId} = req.params
        const {title, description, duration, order} = req.body

        const checkpoint = await Checkpoint.findById(checkpointId)
        if(!checkpoint) {
            res.status(404).json({message: "Checkpoint not found!"})
        }

        const path = await Path.findOne({
            _id: checkpoint.pathID,
            user: req.user._id
        })
        if(!path) {
            return res.status(403).json({
                message: "Not authorized to update checkpoint!"
            })
        }

        if(title !== undefined) checkpoint.title = title
        if(description !== undefined) checkpoint.description = description
        if(duration !== undefined) checkpoint.duration = duration
        if(order !== undefined) checkpoint.order = order

        await checkpoint.save()

        res.status(200).json({
            message: "Checkpoint updated successfully.",
            checkpoint
        })

    } catch (error) {
        console.error("Update checkpoint error:", error)
        res.status(500).json({
            message: "Error updating the checkpoint",
            error: error.message
        })
    }
}

// @route   PATCH /api/checkpoints/toggle/:checkpointId
// @access  Private
export const toggleCheckpoint = async (req, res) => {
    try {
        const { checkpointId } = req.params;

        const checkpoint = await Checkpoint.findById(checkpointId);
        if (!checkpoint) {
            return res.status(404).json({ message: "Checkpoint not found" });
        }

        // Verify path belongs to user
        const path = await Path.findOne({ 
            _id: checkpoint.pathID, 
            user: req.user._id 
        });
        if (!path) {
            return res.status(403).json({ 
                message: "Not authorized to modify this checkpoint" 
            });
        }

        // Toggle completion
        checkpoint.completed = !checkpoint.completed;
        await checkpoint.save();

        res.status(200).json({
            message: `Checkpoint marked as ${checkpoint.completed ? 'completed' : 'incomplete'}`,
            checkpoint
        });
    } catch (error) {
        console.error("Toggle checkpoint error:", error);
        res.status(500).json({
            message: "Error toggling checkpoint",
            error: error.message
        });
    }
};

// @route   DELETE /api/checkpoints/delete/:checkpointId
// @access  Private
export const deleteCheckpoint = async (req, res) => {
    try {
        const { checkpointId } = req.params;

        const checkpoint = await Checkpoint.findById(checkpointId);
        if (!checkpoint) {
            return res.status(404).json({ message: "Checkpoint not found" });
        }

        // Verify path belongs to user
        const path = await Path.findOne({ 
            _id: checkpoint.pathID, 
            user: req.user._id 
        });
        if (!path) {
            return res.status(403).json({ 
                message: "Not authorized to delete this checkpoint" 
            });
        }

        // Remove checkpoint from path's checkpoints array
        path.checkpoints = path.checkpoints.filter(
            cp => cp.toString() !== checkpointId
        );
        await path.save();

        // Delete checkpoint
        await Checkpoint.deleteOne({ _id: checkpointId });

        res.status(200).json({
            message: "Checkpoint deleted successfully"
        });
    } catch (error) {
        console.error("Delete checkpoint error:", error);
        res.status(500).json({
            message: "Error deleting checkpoint",
            error: error.message
        });
    }
};

// @desc    Get all checkpoints for a path
// @route   GET /api/checkpoints/:pathId
// @access  Private
export const getCheckpointsByPath = async (req, res) => {
    try {
        const { pathId } = req.params;

        // Verify path belongs to user
        const path = await Path.findOne({ _id: pathId, user: req.user._id });
        if (!path) {
            return res.status(404).json({ message: "Path not found" });
        }

        const checkpoints = await Checkpoint.find({ pathID: pathId })
            .sort({ order: 1 });

        res.status(200).json({
            count: checkpoints.length,
            checkpoints
        });
    } catch (error) {
        console.error("Get checkpoints error:", error);
        res.status(500).json({
            message: "Error fetching checkpoints",
            error: error.message
        });
    }
};

// @route   PUT /api/checkpoints/:pathId/reorder
// @access  Private
export const reorderCheckpoints = async (req, res) => {
    try {
        const { pathId } = req.params;
        const { checkpointIds } = req.body; // Array of checkpoint IDs in new order

        // Verify path belongs to user
        const path = await Path.findOne({ _id: pathId, user: req.user._id });
        if (!path) {
            return res.status(404).json({ message: "Path not found" });
        }

        if (!Array.isArray(checkpointIds) || checkpointIds.length === 0) {
            return res.status(400).json({ 
                message: "checkpointIds array is required" 
            });
        }

        // Update order for each checkpoint
        const updatePromises = checkpointIds.map((id, index) => 
            Checkpoint.findByIdAndUpdate(
                id,
                { order: index + 1 },
                { new: true }
            )
        );

        await Promise.all(updatePromises);

        res.status(200).json({
            message: "Checkpoints reordered successfully"
        });
    } catch (error) {
        console.error("Reorder checkpoints error:", error);
        res.status(500).json({
            message: "Error reordering checkpoints",
            error: error.message
        });
    }
};