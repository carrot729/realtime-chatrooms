import mongoose from "mongoose";
import { nanoid } from "nanoid";

const chatroomSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    joinCode: {
      type: String,
      unique: true,
      required: true,
      uppercase: true,
      default: () => nanoid(6),
    },
  },
  { timestamps: true },
);

const Chatroom = mongoose.model("Chatroom", chatroomSchema);

export default Chatroom;
