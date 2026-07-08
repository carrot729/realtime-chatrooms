import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDb from "./db/connectDb.js";

import chatroomRoutes from "./routes/chat.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const frontend = process.env.FRONTEND;

app.use(
  cors({
    origin: frontend,
    credentials: true,
  }),
);
app.use(express.json());

app.use("/chatroom", chatroomRoutes);
app.use("/user", userRoutes);

app.listen(PORT, () => {
  connectDb();
  console.log(`Server is running on ${PORT}`);
});
