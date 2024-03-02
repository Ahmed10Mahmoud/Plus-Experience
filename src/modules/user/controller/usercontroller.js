import User from '../model/usermodel';
import bcrypt from "bcrypt";

export const showProfile = async (req, res) => {
    const id = req.id;
    if (!id) {
        res.status(440).json({ "msg": "Your Session has Expired" });
    }
    const foundUser = await User.findOne({ _id: id });
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
        const foundUser = await User.findOne({ _id: id });
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
    const extention = req.file.originalname.split('.').pop();
    console.log(extention);
    if (extention !== "jpg" && extention !== "png") {
        await fs.unlink(req.file.path, (err) => {
            if (err) {
                console.log(err.message);
            }
        });
        res.status(415).json({ "msg": "Please upload an image with jpg or png extention." });
    }
    else res.json(req.file);
};

export const addSkill = async (req, res) => {
    const userId = req.id;
    const skills = req.body.skills;
    //console.log(skills);
    if (!userId) { res.status(440).json({ "msg": "Your Session has Expired" }); }
    else {
        if (!skills) { res.status(400).json({ "msg": "Please enter the new skills" }); }
        else {
            const foundUser = await User.findOne({ _id: userId });
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
            const foundUser = await User.findOne({ _id: userId });
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
            const foundUser = await User.findOne({ _id: userId });
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

