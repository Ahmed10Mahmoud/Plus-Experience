import express from "express";
const router = express.Router();
import {register,login,logout} from '../controllers/authcontroller.js';

//Register
router.post('/register', register);
// Login
router.post('/login', login);
// Logout
router.post('/logout', logout);

export default router