import type { Request, Response } from "express";

import User from "../models/user.model.js";

type UserType = {
  clientId: string;
};

const createUserController = async (
  req: Request<{}, {}, UserType>,
  res: Response,
) => {
  const { clientId } = req.body;
  try {
    if (!clientId)
      return res
        .status(404)
        .json({ success: false, message: "Client Id not found" });

    const existingUser = await User.findOne({ clientId });

    if (existingUser)
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });

    const user = await User.create({
      clientId,
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export default createUserController;
