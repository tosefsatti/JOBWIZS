
// import { getReceiverSocketId, io } from "../socket/socket.js";

// controllers/message.controller.js
import { FriendRequest } from "../models/friendRequest.model.js";
import { conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }

        // ── 1. Ensure they’re friends ────────────────────────────────────────
        const friendship = await FriendRequest.findOne({
            status: "accepted",
            $or: [
                { requester: senderId, receiver: receiverId },
                { requester: receiverId, receiver: senderId }
            ]
        });
        if (!friendship) {
            return res
                .status(403)
                .json({ message: "You can only message users you’re friends with" });
        }

        // ── 2. Find or create the conversation ─────────────────────────────
        let conv = await conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });
        if (!conv) {
            conv = await conversation.create({
                participants: [senderId, receiverId]
            });
        }

        // ── 3. Create the message and link to the conversation ───────────
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message,
        });
        conv.messages.push(newMessage._id);

        await Promise.all([conv.save(), newMessage.save()]);

        // ── 4. Emit via Socket.IO ─────────────────────────────────────────
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        // ── 5. Respond ─────────────────────────────────────────────────────
        return res.status(201).json({ newMessage });

    } catch (error) {
        console.error("sendMessage error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// export const getMessage = async (req, res) => {
//     try {
//         const receiverId = req.params.id;
//         const senderId = req.id;

//         const gotConversation = await conversation.findOne({
//             participants: { $all: [senderId, receiverId] }
//         }).populate("messages");



//         // ✅ Always return an array
//         res.status(200).json({ messages: gotConversation?.messages || [] });

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };
export const getMessage = async (req, res) => {
    try {
        const receiverId = req.params.id;
        const senderId = req.id;

        const gotConversation = await conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate("messages");

        if (!gotConversation) {
            return res.status(200).json({ messages: [] });
        }

        res.status(200).json({ messages: gotConversation.messages });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
