//user
//name/username, email/password or google/github login
//new goal - goal name, time frame, time commitment per day

import mongoose, {Schema} from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: [true, "Password is required!"]
    },
    refreshToken: {
        type: String
    },
}, {timestamps: true})

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.matchPassword = async function (password) {
    return bcrypt.compare(password, this.password)
}

export const User = mongoose.model("User", userSchema)