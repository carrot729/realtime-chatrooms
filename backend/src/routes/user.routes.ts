import express from "express";

import createUserController from "../controllers/createUser.controller.js";

const router = express.Router();

router.post("/create-user", createUserController);

export default router;
