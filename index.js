import express from "express";
import cookieParser from "cookie-parser";
const PORT = process.env.PORT || 3500
const app = express();
import connectDB from './db/dbconnection.js';
import mongoose from 'mongoose';
import Auth from './src/modules/auth/auth.js';
import adminRouter from './src/modules/user/admin.js';
import clientRouter from './src/modules/user/client.js';
import userRouter from './src/modules/user/user.js';
import projectRouter from './src/modules/project/project.js';
//import chatRouter from './src/modules/chat/chat.js'
import messageRouter from './src/modules/message/message.js'
import dotenv from 'dotenv';
import { verifyToken } from "./src/middlewares/verifyToken.js";
import { showMethod } from "./src/middlewares/showmethod.js";
import cors from "cors"; // Import CORS packagedotenv.config();
import { corsOptions } from "./config/corsOptions.js";
import paymentRouter from "./src/modules/payment/payment.js"
// Connect to DB
connectDB();
// Built in middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
dotenv.config();
app.use(showMethod);  //Show method
app.use("/auth", Auth);
app.use(verifyToken); //Verifing JWT
app.use("/admin", adminRouter);
app.use("/client", clientRouter);
app.use('/user', userRouter);
app.use('/project', projectRouter);
//app.use('/chat', chatRouter );
app.use('/message', messageRouter);
app.use('/payment',paymentRouter)

mongoose.connection.once('open', () => {
    console.log('Connected');
    app.listen(PORT, () => { console.log(`Server is running on PORT: ${PORT}`) });
});