import express from "express";
import * as usersController from "./users.controller.js";

const router = express.Router();

// User Login
router.post("/login", usersController.userLogin);

// User Register
router.post("/register", usersController.userRegister);

// User Logout
router.post("/logout", usersController.userLogout);

export default router;
