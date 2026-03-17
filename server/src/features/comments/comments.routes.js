import express from "express";
import * as commentsController from "./comments.controller.js";

router = express.Router()

router.post("post-comment", commentsController.writeComment);

export default router;