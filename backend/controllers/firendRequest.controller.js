// controllers/friendRequest.controller.js
import { FriendRequest } from "../models/friendRequest.model.js";
import { conversation } from "../models/conversation.model.js";
// controllers/friendRequest.controller.js
import { User } from "../models/user.model.js";
import nodemailer from "nodemailer";

// 1. Create reusable transporter using environment variables
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT === "465", // secure for port 465
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

export const sendRequest = async (req, res) => {
    try {
        const requesterId = req.id;
        const receiverId = req.params.id;

        if (requesterId === receiverId) {
            return res.status(400).json({ message: "Cannot friend yourself" });
        }

        // Prevent duplicate requests
        const exists = await FriendRequest.findOne({ requester: requesterId, receiver: receiverId });
        if (exists) {
            return res.status(400).json({ message: "Request already sent" });
        }

        // Create new friend request
        const fr = await FriendRequest.create({ requester: requesterId, receiver: receiverId });

        // Fetch both users
        const [requester, receiver] = await Promise.all([
            User.findById(requesterId).select("fullname email"),
            User.findById(receiverId).select("fullname email")
        ]);

        // Send email to receiver
        await transporter.sendMail({
            from: `"${requester.fullname}" <${process.env.EMAIL_FROM}>`,
            to: receiver.email,
            subject: `${requester.fullname} sent you a friend request!`,
            html: `
        <p>Hi ${receiver.fullname},</p>
        <p><strong>${requester.fullname}</strong> has sent you a friend request on <strong>JobWizs</strong>.</p>
        <p><a href="${process.env.FRONTEND_URL}/notifications" style="color: #007bff;">View your notifications</a></p>
        <br/>
        <p>Regards,<br/>The JobWizs Team</p>
      `
        });

        console.log(`✅ Email sent to ${receiver.email}`);

        return res.status(201).json({
            message: "Friend request sent",
            fr
        });

    } catch (error) {
        console.error("sendRequest error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// controllers/friendRequest.controller.js
export const listIncoming = async (req, res) => {
    const receiver = req.id;
    const incoming = await FriendRequest
        .find({ receiver, status: "pending" })
        // populate the field your User schema actually has:
        .populate("requester", "fullname avatar");
    res.json(incoming);
};


export const listOutgoing = async (req, res) => {
    const requester = req.id;
    const outgoing = await FriendRequest
        .find({ requester, status: "pending" })
        .populate("receiver", "name avatar");
    res.json(outgoing);
};

export const respondRequest = async (req, res) => {
    const userId = req.id;
    const { action } = req.body; // accepted or declined
    const fr = await FriendRequest.findById(req.params.requestId);
    if (!fr || fr.receiver.toString() !== userId)
        return res.status(404).json({ message: "Request not found" });

    fr.status = action;
    await fr.save();

    if (action === "accepted") {
        // Create a conversation immediately
        const conv = await conversation.create({
            participants: [fr.requester, fr.receiver]
        });
        // TODO: notify both users via socket: “friend accepted → open chat”
        return res.json({ message: "Friend request accepted", conversation: conv });
    }

    return res.json({ message: `Friend request ${action}` });
};

export const listFriends = async (req, res) => {
    const me = req.id;
    // accepted requests where I'm requester or receiver
    const accepted = await FriendRequest.find({
        $and: [
            { status: "accepted" },
            { $or: [{ requester: me }, { receiver: me }] }
        ]
    });

    // normalize to list of other-user-IDs
    const friends = accepted.map(fr =>
        fr.requester.toString() === me ? fr.receiver : fr.requester
    );

    // you can optionally populate user data here
    res.json({ friends });
};
