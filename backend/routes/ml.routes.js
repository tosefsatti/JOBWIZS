// server/routes/ml.routes.js
import express from "express";
import { recommendJobs } from "../controllers/ml.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
const router = express.Router();

router.post("/recommend", isAuthenticated, recommendJobs);
export default router;