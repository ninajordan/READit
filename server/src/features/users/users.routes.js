import express from "express";
import * as usersController from "./users.controller.js";

const router = express.Router();

// Browse users 
router.get("/", usersController.getAllUsers);

// View one user
router.get("/:id", usersController.getUserById);

// Create a user 
router.post("/", usersController.createUser);
router.patch("/:id", usersController.updateUser);
router.delete("/:id", usersController.deleteUser);

export default router;