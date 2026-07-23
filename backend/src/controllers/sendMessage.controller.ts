import type { Request, Response } from "express";
import Chatroom from "../models/chatroom.model.js";
import User from "../models/user.model.js";
import Message from "../models/messsage.model.js";

import { getIO } from "../socket/socket.io.js";

type MessageType = {
  roomId: string;
  clientId: string;
  message: string;
};

const sendMessageController = async (
  req: Request<{}, {}, MessageType>,
  res: Response,
) => {
  const { roomId, clientId, message } = req.body;
  try {
    if (!roomId)
      return res
        .status(404)
        .json({ success: false, message: "Room Id not found" });

    if (!clientId)
      return res
        .status(404)
        .json({ success: false, message: "Client Id not found" });

    const room = await Chatroom.findById(roomId);

    if (!room)
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });

    const user = await User.findOne({ clientId });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (!message.trim())
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty",
      });

    const cleanMessage = message.trim();

    if (!cleanMessage)
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty",
      });

    if (!room.members.some((id) => id.equals(user._id))) {
      return res.status(403).json({
        success: false,
        message: "User is not in this room",
      });
    }

    const newMessage = await Message.create({
      roomId,
      userId: user._id,
      content: cleanMessage,
    });

    const io = getIO();

    io.to(roomId).emit("new-message", {
      _id: newMessage._id.toString(),
      message: newMessage.content,
      username: user.username,
      userId: user._id.toString(),
      ownerId: room.owner.toString(),
    });

    return res.status(201).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export default sendMessageController;
