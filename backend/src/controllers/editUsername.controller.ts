import type { Request, Response } from "express";
import User from "../models/user.model.js";

type EditUsernameType = {
  clientId: string;
  newUsername: string;
};

const EditUsernameController = async (
  req: Request<{}, {}, EditUsernameType>,
  res: Response,
) => {
  const { clientId, newUsername } = req.body;
  try {
    if (!clientId)
      return res
        .status(404)
        .json({ success: false, message: "Client Id not found" });

    if (!newUsername)
      return res
        .status(400)
        .json({ success: false, message: "Please enter your new username" });
      
    const existingUser = await User.findOne({ clientId });

    if (!existingUser)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    existingUser.username = newUsername;
    await existingUser.save();
      
    res.status(200).json({ success: true, existingUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export default EditUsernameController;