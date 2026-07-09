import type { Request, Response } from "express";

import User from "../models/user.model.js";

type RoomType = {
  clientId: string;
};

const loadRoomsController = async (
  req: Request<{}, {}, RoomType>,
  res: Response,
) => {
  const { clientId } = req.body;
  try {
    if (!clientId)
      return res
        .status(404)
        .json({ success: false, message: "Client Id not found" });

    const user = await User.findOne({ clientId });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, rooms: user.rooms });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export default loadRoomsController;
