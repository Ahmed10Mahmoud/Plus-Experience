import express from "express";
const router = express.Router();
import { register, login, logout, activateAccount, sendForgetCode, resetPassword } from './controller/authcontroller.js';
//import { isValid } from "../../middlewares/validation.middleware.js";
import { activateSchema, loginSchema, registerSchema } from "./controller/user.validation.js";
import { isValid } from "../../middlewares/validation.middleware.js";

// new register 
router.post("/register", register)

router.get('/confirmEmail/:activationCode', isValid(activateSchema), activateAccount)
// Login
router.post('/login', isValid(loginSchema), login);
//forget password
router.patch('/forgetCode', sendForgetCode)
// Logout
router.patch('/resetPassword', resetPassword)
router.post('/logout', logout);

export default router