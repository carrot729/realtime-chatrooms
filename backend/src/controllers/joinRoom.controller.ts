import type { Request, Response } from "express";
import User from "../models/user.model.js";
import Chatroom from "../models/chatroom.model.js";

const joinRoomController = async (req: Request, res: Response) => {
  const { joinCode, clientId } = req.body;
  try {
    if (!clientId)
      return res
        .status(404)
        .json({ success: false, message: "Client Id not found" });

    if (!joinCode)
      return res
        .status(400)
        .json({ success: false, message: "Please enter a join code" });

    const user = await User.findOne({ clientId });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const room = await Chatroom.findOne({ joinCode: joinCode.toUpperCase() });

    if (!room)
      return res
        .status(404)
        .json({ success: false, message: "Please enter a valid code" });

    const isMember = room.members.some((memberId) => memberId.equals(user._id));

    if (!isMember) {
      room.members.push(user._id);
      await room.save();

      user.rooms.push(room._id);
      await user.save();
    }

    return res.status(200).json({ success: true, chatroom: room });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export default joinRoomController;
