import express from "express";
import { getMessages, sendMessage } from "./controller/messagecontroller.js";

const router = express.Router();

router.get("/:id", getMessages);
router.post("/send/:id", sendMessage);

export default router;