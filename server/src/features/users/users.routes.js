import express from "express";
import * as usersController from "./users.controller.js";

const router = express.Router();

// Browse users 
router.post("/login", usersController.userLogin);

export default router;