import Path from "../models/path.model.js"
import Checkpoint from "../models/checkpoint.model.js"
import { clearMemoryCache } from "../services/supermemory.service.js"

export const createPath = async (req, res) => {
    try {
        const {title, goalType, timeframe, checkpoints} = req.body

        if(!title || !goalType || !timeframe) {
            return res.status(400).json({
                message: "Required fields are missing."
            })
        }

        const path = await Path.create({
            user: req.user._id,
            title,
            goalType,
            timeframe,
            // feasibilityScore
        })

        if(Array.isArray(checkpoints) && checkpoints.length > 0) {
            const checkpointDocs = checkpoints.map((c, index) => ({
                pathID: path._id,
                title: c.title,
                description: c.description || "",
                duration: c.duration,
                order: index+1
            }))

            const savedCheckpoints = await Checkpoint.insertMany(checkpointDocs)

            path.checkpoints = savedCheckpoints.map((cp) => cp._id)
            await path.save()
        }
        res.status(201).json({
            message: "Path created succesfully.",
            path
        })
    }

    catch (error) {
        console.error(error)
        res.status(500).json({message: "Error creating the path.", error: error.message})
    }
}

export const getAllPaths = async (req, res) => {
    try {
        const paths = await Path.find({user: req.user._id})
        .populate("checkpoints")
        .sort({createdAt: -1})

        res.status(200).json(paths)
    }
    catch (error) {
        res.status(500).json({
            message: "Error fetching paths.",
            error: error.message
        })
    }
}

export const getSinglePath = async (req, res) => {
    try {
        const {id} = req.params
        const path = await Path.findOne({_id: id, user: req.user._id})
        .populate("checkpoints")

        if(!path) return res.status(404).json({message: "Path not found!"})

        return res.status(200).json(path)
    }
    catch (error) {
        res.status(500).json({
            message: "Error fetching path.",
            error: error.message
        })
    }
}

export const updatePath = async (req, res) => {
    try {
        const {id} = req.params
        const updates = req.body

        const path = await Path.findOneAndUpdate(
            {_id: id, user: req.user._id},
            updates,
            {new: true}
        ).populate("checkpoints")

        if(!path) return res.status(404).json({message: "Path not found!"})
        
        res.status(200).json({message: "Path updated.", path})
    }
    catch (error) {
        res.status(500).json({
            message: "Error updating the path.",
            error: error.message
        })
    }
}

export const deletePath = async (req, res) => {
    try {
        const {id} = req.params

        const path = await Path.findOne({
            _id: id,
            user: req.user._id
        })
        if(!path) return res.status(404).json({message: "Path not found!"})

        await Checkpoint.deleteMany({pathID: id})
        await Path.deleteOne({_id: id})
        
        // Clear memory cache
        clearMemoryCache(id)

        res.status(200).json({message: "Path and checkpoints deleted successfully."})
    } catch (error) {
        res.status(500).json({
            message: "Error deleting the path.",
            error: error.message
        })
    }
}