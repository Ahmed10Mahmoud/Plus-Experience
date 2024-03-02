


import express from 'express';
import { createConversation, getConversation } from './controller/conversationcontroller.js';
const router = express.Router();

router.post('/create',createConversation)

router.get('/get/:conversationId',getConversation)

export default router;



