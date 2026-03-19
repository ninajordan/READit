import express from "express";
import * as likesController from "./likes.controller.js";

const router = express.Router();

router.post("/register", likesController.registerLike);

export default router;
