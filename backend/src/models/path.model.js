import mongoose from "mongoose";

const pathSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    goalType: {
        type: String,
        enum: ["shortTerm", "longTerm"],
        required: true
    },
    timeframe: {        //in months, weeks or years
        type: Number,
        required: true
    },
    feasibilityScore: {
        type: Number,
        required: true
    },
    checkpoints: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Checkpoint"
    }
}, {timestamps: true})

export default mongoose.model("Path", pathSchema)