import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    addCheckpoint,
    updateCheckpoint,
    toggleCheckpoint,
    deleteCheckpoint,
    getCheckpointsByPath,
    reorderCheckpoints,
} from "../controllers/checkpoint.controller.js"

const router = express.Router()

router.use(protect)

router.post("/:pathId/add", addCheckpoint)
router.put("/update/:checkpointId", updateCheckpoint)
router.patch("/toggle/:checkpointId", toggleCheckpoint)
router.delete("/delete/:checkpointId", deleteCheckpoint)
router.get("/:pathId", getCheckpointsByPath)
router.put("/:pathId/reorder", reorderCheckpoints)

export default router