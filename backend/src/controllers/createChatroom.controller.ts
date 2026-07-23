import Chatroom from "../models/chatroom.model.js";
import User from "../models/user.model.js";
import Message from "../models/messsage.model.js";

import type { Request, Response } from "express";

type RoomType = {
  username: string;
  clientId: string;
  roomName: string;
  roomDescription: string;
};

const createChatroomController = async (
  req: Request<{}, {}, RoomType>,
  res: Response,
) => {
  const { clientId, roomName, roomDescription } = req.body;

  try {
    if (!clientId)
      return res
        .status(404)
        .json({ success: false, message: "Client Id not found" });

    if (!roomName)
      return res
        .status(400)
        .json({ success: false, message: "Please enter a room name" });

    const user = await User.findOne({ clientId });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const chatroom = await Chatroom.create({
      name: roomName,
      description: roomDescription,
      owner: user._id,
      members: [user._id],
    });

    user.rooms.push(chatroom._id);
    await user.save();

    return res.status(201).json({ success: true, chatroom });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export default createChatroomController;
