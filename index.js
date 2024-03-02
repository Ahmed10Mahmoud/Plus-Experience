import express from "express"
import cookieParser from "cookie-parser";
const PORT = process.env.PORT || 3500
const app = express();
import jwt from 'jsonwebtoken';
import  connectDB  from './db/dbconnection.js';
import mongoose from'mongoose';
import Auth from './src/modules/auth/auth.js'
import adminRouter from './src/modules/user/admin.js'
import clientRouter from './src/modules/user/client.js'
import conversationRouter from "./src/modules/conversation/conversation.js";
import messageRouter from "./src/modules/message/message.js"
import dotenv from 'dotenv';
dotenv.config();
// Connect to DB
connectDB();
// Built in middlewares
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

// My middlewares
app.use((req, res, next) => {
    console.log(`${req.method} : ${req.url}`);
    next();
});

app.use("/auth", Auth);


// Verifing JWT

app.use(function (req, res, next) {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, 'salah', async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.status(401).json({ "msg": "Invalid token!" });
            }
            else {
                console.log(decodedToken);
                req.id = decodedToken.id;
                req.role = decodedToken.role;
                next();
            }
        });
    }
    else {
        res.status(401).json({ "msg": "Unauthorized!" });
    }
});


app.use("/admin", adminRouter)

app.use("/client",clientRouter)

app.use('/conversation',conversationRouter)
app.use('/message',messageRouter)

mongoose.connection.once('open', () => {
    console.log('Connected');
    app.listen(PORT, () => { console.log(`Server is running on PORT: ${PORT}`) });
});