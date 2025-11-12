import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { generateAIPath, regenerateAIPath } from "../controllers/aiPath.controller.js";

const router = express.Router();

router.use(protect);

router.post("/generate-path", generateAIPath);
router.post("/regenerate-path/:pathId", regenerateAIPath);

export default router;