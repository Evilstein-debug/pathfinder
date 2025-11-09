import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    createPath,
    getAllPaths,
    getSinglePath,
    updatePath,
    deletePath
} from "../controllers/path.controller.js"

const router = express.Router()

router.post("/create", protect, createPath)
router.get("/all", protect, getAllPaths)
router.get("/details/:id", protect, getSinglePath)
router.put("/update/:id", protect, updatePath)
router.delete("/delete/:id", protect, deletePath)

export default router