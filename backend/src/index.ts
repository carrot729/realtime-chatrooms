import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDb from "./db/connectDb.js";

import chatroomRoutes from "./routes/chat.routes.js";
import userRoutes from "./routes/user.routes.js";

import { createServer } from "node:http";
import { initSocket } from "./socket/socket.io.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);

const PORT = process.env.PORT;
const frontend = process.env.FRONTEND;

if (!frontend) {
  throw new Error("FRONTEND environment variable is missing");
}

initSocket(httpServer, frontend);

app.use(
  cors({
    origin: frontend,
    credentials: true,
  }),
);
app.use(express.json());

app.use("/chatroom", chatroomRoutes);
app.use("/user", userRoutes);

httpServer.listen(PORT, () => {
  connectDb();
  console.log(`Server is running on ${PORT}`);
});
