import express from "express";

import createChatroomController from "../controllers/createChatroom.controller.js";
import loadRoomsController from "../controllers/loadRooms.controller.js";
import joinRoomController from "../controllers/joinRoom.controller.js";
import enterChatroomController from "../controllers/enterChatroom.controller.js";
import loadCurrentRoomController from "../controllers/loadCurrentRoom.Controller.js";

const router = express.Router();

router.post("/create-chatroom", createChatroomController);
router.get("/load-rooms", loadRoomsController);
router.post("/join-room", joinRoomController);
router.post("/enter-room", enterChatroomController);
router.post("/load-current-room", loadCurrentRoomController);

export default router;
