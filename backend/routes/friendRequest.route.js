// routes/friendRequest.routes.js
import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
    sendRequest,
    listIncoming,
    listOutgoing,
    respondRequest,
    listFriends
} from "../controllers/firendRequest.controller.js"

const router = express.Router();

// Send a new request
router.post("/send/:id", isAuthenticated, sendRequest);

// Get all incoming (to me) pending requests
router.get("/incoming", isAuthenticated, listIncoming);

// Get all outgoing (by me) pending requests
router.get("/outgoing", isAuthenticated, listOutgoing);

// Accept or decline: body { action: "accepted" | "declined" }
router.patch("/respond/:requestId", isAuthenticated, respondRequest);

// List all confirmed friends
router.get("/friends", isAuthenticated, listFriends);

export default router;
