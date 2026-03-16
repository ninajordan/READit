import express from "express";
import * as usersController from "./users.controller.js";

const router = express.Router();

// User Login
router.post("/login", usersController.userLogin);

export default router;