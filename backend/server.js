import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from './config/db.js'
import authRouter from "./routes/authRoutes.js";
import studentRouter from "./routes/studentRoutes.js";
import bookRouter from "./routes/bookRoutes.js";

const PORT = process.env.PORT || 5000;
const app = express();

// MIDDLEWARES
app.use(
  cors({
    origin: ["http://localhost:5173", process.env.CLIENT_URL],
  }),
);
app.use(express.json());

//DB
connectDB();

// ROUTES
app.use("/api/auth", authRouter)
app.use("/api/students", studentRouter)
app.use("/api/books", bookRouter)


app.get("/", (req, res) => {
  res.send("API WORKING");
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`server started on http://localhost:${PORT}`);
  });
}

export default app;