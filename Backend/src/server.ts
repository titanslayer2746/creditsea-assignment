import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import loanRoutes from "./routes/loan.routes";
import mongoose from "mongoose";
import connectDB from "./db";

dotenv.config();

const app = express();


// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Change to your frontend URL
    credentials: true, // Allow cookies
  })
);

app.use(cookieParser());

// Database Connection
connectDB()

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/loans", loanRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
