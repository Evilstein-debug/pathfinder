import express from "express";
import 'dotenv/config';
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"
import pathRoutes from "./routes/pathRoutes.js"
import checkpointRoutes from "./routes/checkpointRoutes.js"
import aiRoutes from "./routes/aiRoutes.js"
import rateLimit from "express-rate-limit";
import helmet from "helmet"

const port = process.env.PORT || 8000
const allowedOrigins = process.env.CORS_ORIGIN.split(",");

const app = express()

app.use(helmet())

app.use(cors({
    origin: allowedOrigins,
}))

app.use(express.json())

const authLimiter = rateLimit({
  windowMs: 60000,
  max: 5,
  message: "Too many login attempts",
});

app.get('/', (req, res) => {
    res.status(200).json({message: "API is running."})
})

app.use("/api/auth",authLimiter, authRoutes)
app.use("/api/paths", pathRoutes)
app.use("/api/checkpoints", checkpointRoutes)
app.use("/api/ai", aiRoutes)

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