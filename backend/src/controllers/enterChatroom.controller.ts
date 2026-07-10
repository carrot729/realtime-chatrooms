import type { Request, Response } from "express";

import User from "../models/user.model.js";
import Chatroom from "../models/chatroom.model.js";

type EnterChatroomType = {
  clientId: string;
  username: string;
  roomId: string;
};

const enterChatroomController = async (
  req: Request<{}, {}, EnterChatroomType>,
  res: Response,
) => {
  const { clientId, username, roomId } = req.body;
  try {
    if (!username)
      return res
        .status(400)
        .json({ success: false, message: "Please enter a username" });

    if (!clientId)
      return res
        .status(404)
        .json({ success: false, message: "Client Id not found" });

    if (!roomId)
      return res
        .status(404)
        .json({ success: false, message: "Room Id not found" });

    const room = await Chatroom.findById(roomId);
    const user = await User.findOne({ clientId });

    if (!room)
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    user.username = username;
    await user.save();

    const isOnline = room.isOnline.some((id) => id.equals(user._id));

    if (!isOnline) {
      room.isOnline.push(user._id);
      await room.save();
    }

    res.status(200).json({ success: true, room });
  } catch (error) {
    console.log(error);

    res.status(500).json({ success: false, message: "Server error" });
  }
};

export default enterChatroomController;
