


import express from 'express';
import { createConversation, getConversation } from '../controllers/conversation.js';
const router = express.Router();

router.post('/create',createConversation)

router.get('/get/:conversationId',getConversation)

export default router;



