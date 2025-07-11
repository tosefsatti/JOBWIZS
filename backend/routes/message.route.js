import express from "express"
import { getMessage, sendMessage } from "../controllers/message.controller.js"
import isAuthenticated from "../middlewares/isAuthenticated.js"

const router = express.Router()

router.post("/send/:id", isAuthenticated, sendMessage)
router.get("/:id", isAuthenticated, getMessage)

export default router