import express from "express";

import createChatroomController from "../controllers/createChatroom.controller.js";
import loadRoomsController from "../controllers/loadRooms.controller.js";
import joinRoomController from "../controllers/joinRoom.controller.js";
import enterChatroomController from "../controllers/enterChatroom.controller.js";
import loadCurrentRoomController from "../controllers/loadCurrentRoom.Controller.js";
import sendMessageController from "../controllers/sendMessage.controller.js";
import loadMessagesController from "../controllers/loadMessages.controller.js";
import editVisibilityController from "../controllers/editVisibility.controller.js";
import loadPublicRoomsController from "../controllers/loadPublicRooms.controller.js";
import { messageLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = express.Router();

router.post("/create-chatroom", createChatroomController);
router.get("/load-rooms", loadRoomsController);
router.post("/join-room", joinRoomController);
router.post("/enter-room", enterChatroomController);
router.post("/load-current-room", loadCurrentRoomController);
router.post("/send-message", messageLimiter, sendMessageController);
router.post("/load-messages", loadMessagesController);
router.post("/edit-visibility", editVisibilityController);
router.get("/load-public-room", loadPublicRoomsController);

export default router;
