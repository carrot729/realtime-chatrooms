import type { Request, Response } from "express";
import Chatroom from "../models/chatroom.model.js";

type PublicRoomQuery = {
  clientId: string;
}

const listPublicRoomsController = async (
  req: Request<{}, {}, PublicRoomQuery>, 
  res: Response, 
) => {
  const { clientId } = req.query;

  try {
    if (!clientId || typeof clientId !== "string")
      return res
        .status(404)
        .json({ success: false, message: "Client Id not found" });

    const publicChatrooms = await Chatroom.find({ isPublic: true });

    return res.status(200).json({ success: true, data: publicChatrooms });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export default listPublicRoomsController;