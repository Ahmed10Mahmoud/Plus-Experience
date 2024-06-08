import express from "express";
import { getChat, getMessages, lastMessage, sendMessage, userChats } from "./controller/messagecontroller.js";

const router = express.Router();

router.get("/:id", getMessages);
router.post("/send/:id", sendMessage);
router.get('/:id/last-message', lastMessage)
router.get('/chat/:id', getChat);
router.get('/:userId/chats', userChats)
export default router;