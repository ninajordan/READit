import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import { connectToDatabase } from "./config/db.js";
import { configurePassport } from "./config/passport.js";

import postRoutes from "./features/posts/posts.routes.js";
import userRoutes from "./features/users/users.routes.js";
import commentRoutes from "./features/comments/comments.routes.js";
import channelRoutes from "./features/channels/channels.routes.js";
import likeRoutes from "./features/likes/likes.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("client"));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "readit-session",
    resave: false,
    saveUninitialized: false,
  })
);

configurePassport();
app.use(passport.initialize());
app.use(passport.session());

// API routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/likes", likeRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "ReadIT API is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res.send("Server running");
});

// 404 handler - keep this LAST
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
async function startServer() {
  try {
    await connectToDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();