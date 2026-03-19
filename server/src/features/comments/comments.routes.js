import express from "express";
import * as commentsController from "./comments.controller.js";

const router = express.Router();

router.post("/post-comment", commentsController.writeComment);

export default router;
