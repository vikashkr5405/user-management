import express from "express";
import protect from "../middleware/authMiddleware.js";
import userController from "../controllers/userController.js"

const router = express.Router();

router.get("/", protect, userController.getUsers);

export default router;