import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import issueRoutes from "./routes/issueRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import {
  notFound,
  errorHandler,
} from "./middleware/errorMiddleware.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }));
app.use(express.json());
app.use(cookieParser());


// Test Route
app.get("/", (req, res) => {
  res.send("NyayaPath Backend Running...");
});

// Auth Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/complaints", complaintRoutes);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});