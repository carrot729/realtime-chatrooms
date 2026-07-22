import express from "express";

import createUserController from "../controllers/createUser.controller.js";
import EditUsernameController from "../controllers/editUsername.controller.js";

const router = express.Router();

router.post("/create-user", createUserController);
router.post("/edit-username", EditUsernameController);

export default router;
