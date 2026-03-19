import express from "express";
import * as channelsController from "./channels.controller.js";

const router = express.Router();

// GET /api/channels
// optional queries:
//   maybe search=term
//   maybe category=tech
router.get("/", channelsController.getAllChannels);

// GET /api/channels/homepage
router.get("/homepage", channelsController.getHomepageChannels);

// GET /api/channels/:id/posts
router.get("/:id/posts", channelsController.getChannelWithPosts);

// GET /api/channels/:id
router.get("/:id", channelsController.getChannelById);

// POST /api/channels
router.post("/", channelsController.createChannel);

// PATCH /api/channels/:id
router.patch("/:id", channelsController.updateChannel);

// DELETE /api/channels/:id
router.delete("/:id", channelsController.deleteChannel);

export default router;
