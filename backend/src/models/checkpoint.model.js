import mongoose from "mongoose";

const checkPointSchema = new mongoose.Schema({
    pathID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Path",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    duration: {
        type: String    //time for completing individual checkpoints
    },
    order: {
        type: Number,
        default: 0
    },
    completed: {
        type: Boolean,
        default: false
    }
})

export default mongoose.model("Checkpoint", checkPointSchema)