import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from './config/db.js'

const PORT = 5000;
const app = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json());

//DB
connectDB();

// ROUTES
app.get("/", (req, res) => {
  res.send("API WORKING");
});

app.listen(PORT, () => {
  console.log(`server started on http://localhost:${PORT}`);
});
