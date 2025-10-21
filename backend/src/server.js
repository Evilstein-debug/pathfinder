import express from "express";
import 'dotenv/config';
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"

const port = process.env.PORT || 8000

const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
}))
app.use(express.json())
app.get('/', (req, res) => {
    res.status(200).json({message: "API is running."})
})

app.use("/api/auth", authRoutes)

connectDB()
.then(() => {
    app.on("error", (error) => {
        console.log("Error in express application: ", error)
    })
    app.listen(port, () => {
        console.log("app listening on port: ", port)
        console.log(`origin: ${process.env.CORS_ORIGIN}`)
    })
    
})
.catch((error) => {
    console.log("\nMongoDB connection error!", error)
})