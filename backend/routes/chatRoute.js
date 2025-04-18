import express from "express";
import {getChats, getChat, addChat, readChat} from "../controllers/chatController.js";

const router = express.Router();

router.post("/getchats", getChats);
router.post("/:id", getChat);
router.post("/", addChat);
router.put("/read/:id", readChat);

export default router;