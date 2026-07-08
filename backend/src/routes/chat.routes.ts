import express from "express";

import createChatroomController from "../controllers/createChatroom.controller.js";

const router = express.Router();

router.post("create-chatroom", createChatroomController);

export default router;
