import express from "express";
import { generateQuiz } from "../controllers/quiz.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();
router.get("/generate", isAuthenticated, generateQuiz);
export default router;
