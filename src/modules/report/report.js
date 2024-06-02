import express from 'express';
import { createReport, getReports } from './controller/reportController.js';
const router = express.Router();


router.post('/create',createReport)
router.get('/allReports',getReports)



export default router