import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import userModel from "../model/usermodel.js";
// Global
const maxAge = 3 * 24 * 60 * 60;

export const createToken = (id, role) => {
    return jwt.sign({ "id": id, "role": role }, 'salah', {
        expiresIn: maxAge
    });
};

export const register = async (req, res) => {
    let { username, password, email, role } = req.body;
    if (!username || !password || !email || !role) {
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
            const result = await userModel.create({
                "userName": username,
                "email": email,
                "password": password,
                "role": role
            });
            console.log(result);
            // Reponse with the cookie
            res.status(201).json({ "msg": `Welcome ${username}, Now you can login.` });
        }
    } catch (err) {
        console.log("Error : " + err.message);
        res.status(404).json({ "msg": "Error!" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        const foundUser = await userModel.findOne({ email: email }).exec();
        // Compare hashed passwords
        const result = await bcrypt.compare(password, foundUser.password)
        if (result && foundUser) {
            // Create jwt
            const token = createToken(foundUser.id, foundUser.role);
            const saved = await foundUser.save();
            console.log(saved);

            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
            // Response
            res.status(200).json({ "msg": "Loged in successfully!" });
        }
        else {
            res.status(401).json({ "msg": "Enter the correct email and password" });
        }
    } else {
        res.status(401).json({ "msg": "Enter email and password" });
    };
};

export const logout = (req, res) => {
    res.cookie("jwt", '', { maxAge: 1 });
    res.status(200).json({ "msg": "Loged out successfully" })
};
