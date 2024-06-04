import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import userModel from "../../../../db/model/usermodel.js";
import { sendEmail } from "../../../utils/sendMail.js";
import crypto from 'crypto';
import { forgetCodetHtml, tempHtml } from "../../../utils/htmlTemplete.js";
import Randomstring from "randomstring";
import { connect } from "http2";
// Global
const maxAge = 3 * 24 * 60 * 60;

export const createToken = (id, role) => {
    return jwt.sign({ "id": id, "role": role }, 'salah&ahmed', {
        expiresIn: maxAge
    });
};

export const register = async (req, res) => {
    console.log("here in register")
    var { userName, password, email, role } = req.body;
    if (!userName || !password || !email || !role) {
        res.status(400).json({ "message": "Username, password, email, and role are required" });
    }
    try {
        //Check for duplication
        // const duplicate = await User.findOne({ userName: username }).exec();
        const duplicate = await userModel.findOne({ email: email }).exec();
        if (duplicate) return res.status(409).json({ "msg": "Email is already regiesterd!" }); // Conflict;    
        else {
            // Store the user info
            console.log(`...${"Good."}`);
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);
            // generate activation code
            const activationCode = crypto.randomBytes(64).toString('hex');

            const result = await userModel.create({
                "userName": userName,
                "email": email,
                "password": password,
                "role": role,
                activationCode
            });
            const isSent = await sendEmail({ to: email, subject: "Activate Account", html: tempHtml(activationCode) })
            console.log(result);
            // Reponse with the cookie
            // res.status(201).json({ "msg": `Welcome ${userName}, Now you can login.` });
            return isSent ? res.json({ success: true, message: 'plesage review your email' }) : res.json("Email is invalid")
        }
    } catch (err) {
        console.log("Error : " + err.message);
        res.status(404).json({ "msg": "Error!" });
    }
};

export const activateAccount = async (req, res, next) => {
    const user = await userModel.findOneAndUpdate({ activationCode: req.params.activationCode }, {
        isConfirmed: true, $unset: { activationCode: 1 }
    })
    console.log(user);
    if (!user) {
        return res.status(404).json("user not found!!")
    }
    //response
    return res.json("your account is now activated")
}
export const login = async (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        const foundUser = await userModel.findOne({ email: email }).exec();// is confirmed
        console.log("found user : " + foundUser);
        if (!foundUser) { return res.status(401).json({ "msg": "Incorrect email!" }) }
        // Compare hashed passwords
        const result = await bcrypt.compare(password, foundUser.password)
        if (result) {
            // Create jwt
            const token = createToken(foundUser.id, foundUser.role);
            const saved = await foundUser.save();
            console.log(saved);

            res.cookie('jwt', token, { httpOnly: true, sameSite: 'None', maxAge: maxAge * 1000 });
            // Response
            res.status(200).json({ token });
        }
        else {
            res.status(401).json({ "msg": "Incorrect password!" });
        }
    } else {
        res.status(401).json({ "msg": "Enter email and password" });
    };
};
/*
export const sendforgetCode = async (req, res, next) => {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
        return res.json("invalid email !!")
    }
    //generate code
    const code = Randomstring.generate({
        length: 5,
        charset: "numeric",
    });

    //save code in db
    user.forgetCode = code;
    console.log(user.forgetCode)
    await user.save();

    //send mail
    return await sendEmail({ to: user.email, subject: 'reset password', html: forgetCodetHtml(code) }) ? res.json({ success: true, message: "check your gmail " }) : res.json({ faile: true, message: "fail to reset" })

}
*/
export const sendForgetCode = async (req, res) => {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({ message: "Invalid email!" });
    }

    // Generate a token
    const token = crypto.randomBytes(32).toString('hex');

    // Save the token to the user record along with an expiration time
    user.forgetCode = token;
    user.forgetCodeExpires = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    // Send email with the token
    const resetLink = `http://yourfrontendurl.com/reset-password/${token}`;
    const emailHtml = `<p>Please use the following link to reset your password: <a href="${resetLink}">Reset Password</a></p>`;

    const emailSent = await sendEmail({
        to: user.email,
        subject: 'Reset Password',
        html: emailHtml
    });

    if (emailSent) {
        return res.status(200).json({ success: true, message: "Check your email for the reset link." });
    } else {
        return res.status(500).json({ success: false, message: "Failed to send reset email." });
    }
};
/*
export const resetPassword = async (req, res, next) => {
    //check user
    let user = userModel.findOne({ forgetCode: req.body.forgetCode });
    if (!user) {
        res.status(405).json({ message: "invalid code" });
    }
    user = await user.findOneAndUpdate(({ email: req.body.email }, { $unset: { forgetCode: 1 } }));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    console.log(user.password);
    await user.save();
    res.cookie("jwt", '', { maxAge: 1 });
    return res.json({ message: "successfuly changed" })

}
*/

export const resetPassword = async (req, res) => {
    const { token, password } = req.body;

    // Find the user by the token and check if the token is still valid
    const user = await userModel.findOne({
        forgetCode: token,
        forgetCodeExpires: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).json({ message: "Invalid or expired token." });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Remove the token and its expiration time from the user record
    user.forgetCode = undefined;
    user.forgetCodeExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password successfully changed." });
};

export const logout = (req, res) => {
    res.cookie("jwt", '', { maxAge: 1 });
    res.status(200).json({ "msg": "Loged out successfully" })
};
