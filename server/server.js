import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import dns from "dns";
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
import path from "path";

import complaintMessageRoutes from "./routes/complaintMessageRoutes.js";
dotenv.config();

// Some hosts (e.g. Render) don't route outbound IPv6 traffic,
// which breaks connections to services (like Gmail SMTP) that
// resolve to an IPv6 address first. Prefer IPv4 by default.
dns.setDefaultResultOrder("ipv4first");

connectDB();

const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, curl, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
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
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);
app.use(
  "/api/complaint-conversations",
  complaintMessageRoutes
);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});