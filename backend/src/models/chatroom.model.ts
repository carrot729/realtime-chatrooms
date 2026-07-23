import mongoose from "mongoose";
import { nanoid } from "nanoid";

const chatroomSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    joinCode: {
      type: String,
      unique: true,
      required: true,
      uppercase: true,
      default: () => nanoid(6),
    },

    isOnline: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

const Chatroom = mongoose.model("Chatroom", chatroomSchema);

export default Chatroom;
