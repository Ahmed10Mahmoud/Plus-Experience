import userModel from '../../../../db/model/usermodel.js';
import bcrypt from "bcrypt";
import cloudinary from "../../../../config/cloudinary.js";
import postModel from '../../../../db/model/postmodel.js';

export const showProfile = async (req, res) => {
    const id = req.id;
    if (!id) {
        res.status(440).json({ "msg": "Your Session has Expired" });
    }
    const foundUser = await userModel.findOne({ _id: id });
    foundUser.password = undefined;
    foundUser._id = null;
    console.log(foundUser);
    res.status(200).json({ "user": foundUser });
};

export const updateProfile = async (req, res) => {
    const id = req.id;
    const updates = req.body;
    if (!id) {
        res.status(440).json({ "msg": "Your Session has Expired" });
    }
    else if (!updates) {
        res.status(400).json({ "msg": "Id and updates are required!" });
    }
    else {
        const foundUser = await userModel.findOne({ _id: id });
        try {
            if (updates.username) foundUser.userName = updates.username;
            if (updates.password) {
                const salt = await bcrypt.genSalt(10);
                updates.password = await bcrypt.hash(updates.password, salt);
                foundUser.password = updates.password;
            }
            if (updates.email) {
                foundEmail = await User.findOne({ email: updates.email });
                if (!foundEmail) foundUser.email = updates.email;
                else {
                    res.status(400).json({ "msg": "Email is already registered" });
                }
            }
            // if (updates.img) foundUser.img = updates.img;
            if (updates.country) foundUser.country = updates.country;
            if (updates.phone) foundUser.phone = updates.phone;
            if (updates.desc) foundUser.desc = updates.desc;
            if (updates.jobtitle) foundUser.jobtitle = updates.jobtitle;
            if (updates.skills) foundUser.skills = updates.skills; // push new skills
            const result = await foundUser.save();
            result.password = undefined;
            result._id = null;
            res.status(200).json(result);
        }

        catch (err) {
            console.log(err.message);
            res.sendStatus(500);
        }
    }
};

export const uploadImage = async (req, res) => {
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `Users/${req.id}` });//Add a profile for every user
    //Add profile image to user DB
    try {
        const user = await userModel.findByIdAndUpdate(
            req.id,
            {
                img: { secure_url, public_id }
            },
            { new: true }
        );
        console.log(user);
        res.json({ "file": req.file, "user": user });
    }
    catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }
};

export const addSkill = async (req, res) => {
    const userId = req.id;
    const skills = req.body.skills;
    //console.log(skills);
    if (!userId) { res.status(440).json({ "msg": "Your Session has Expired" }); }
    else {
        if (!skills) { res.status(400).json({ "msg": "Please enter the new skills" }); }
        else {
            const foundUser = await userModel.findOne({ _id: userId });
            foundUser.skills = await foundUser.skills.concat(skills);
            const result = await foundUser.save()
            // console.log(result)
            foundUser.password = undefined;
            foundUser._id = null;
            res.status(201).json({ "user": foundUser });
        }
    }
};

export const deleteSkill = async (req, res) => {
    const userId = req.id;
    const skillName = req.body.skillName;
    if (!userId) { res.status(440).json({ "msg": "Your Session has Expired" }); }
    else {
        if (!skillName) { res.status(400).json({ "msg": "Please choose the skill" }); }
        else {
            const foundUser = await userModel.findOne({ _id: userId });
            if (!foundUser.skills.includes(skillName)) { res.status(404).json({ "msg": "You have not this skill!" }); }
            else {
                const skillIndex = await foundUser.skills.indexOf(skillName);
                const slice = await foundUser.skills.splice(skillIndex, 1);
                const result = await foundUser.save();
                console.log(result);
                foundUser.password = undefined;
                foundUser._id = null;
                res.status(201).json({ "user": foundUser });
            }
        }
    }
};

export const modifySkill = async (req, res) => {
    const oldSkill = req.body.oldSkill;
    const newSkill = req.body.newSkill;
    const userId = req.id;
    if (!userId) { res.status(440).json({ "msg": "Your Session has Expired" }); }
    else {
        if (!oldSkill || !newSkill) { res.status(400).json({ "msg": "Please choose the old skill and type the new one" }); }
        else {
            const foundUser = await userModel.findOne({ _id: userId });
            const skillIndex = await foundUser.skills.indexOf(oldSkill);
            foundUser.skills[skillIndex] = newSkill;
            const result = await foundUser.save();
            console.log(result);
            foundUser.password = undefined;
            foundUser._id = null;
            res.status(201).json({ "user": foundUser });
        }
    }


};

export const apply = async (req, res) => {
    const freelancerId = req.id;
    const postId = req.params.id;
    try {
        if (!freelancerId) { res.status(401).json({ "msg": "You are not authorized!" }); }
        else if (!postId) { res.status(409).json({ "msg": "The author deleted the post!" }); }
        else {
            const currentPost = await postModel.findOne({ _id: postId });
            if (!currentPost) { res.status(404).json({ "msg": "The author deleted the post!" }); }
            else {
                if (currentPost.joinedFreelancers.waitingList.includes(freelancerId)) {
                    res.status(409).json({ "msg": "You are already in the waiting list!" });
                }
                else {
                    await currentPost.joinedFreelancers.waitingList.push(freelancerId);
                    currentPost.save();
                    res.status(200).json({ "msg": "You have been added to the waiting list!" });
                }
            }
        }
    }
    catch (err) {
        console.log(err.message);
    }
};