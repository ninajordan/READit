import express from "express";
import * as postController from "./posts.controller.js";

const router = express.Router();

// Different Post Listing Routes
router.get("/get-all-posts", postController.getAllPosts);
router.get("/view-post/:id", postController.viewPostById);
router.get("/get-posts-in-channel/:channelID", postController.viewChannelPosts);
router.get("/get-liked-posts/:userID", postController.userLikedPosts);
router.get("/get-created-posts/:userID", postController.userCreatedPosts);

// Create a Post
router.post("/create-a-post", postController.createPost);

//Delete a post
router.delete("/delete-post", postController.deletePosts);
router.delete("/delete-post/:postID", postController.deletePosts);

export default router;
