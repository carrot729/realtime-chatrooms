import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clientId: { type: String, required: true, unique: true, index: true },
    username: { type: String, unique: true },
    rooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chatroom",
      },
    ],
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
