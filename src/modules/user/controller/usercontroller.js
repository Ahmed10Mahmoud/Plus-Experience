import userModel from '../../../../db/model/usermodel.js';
import bcrypt from "bcrypt";
import cloudinary from "../../../../config/cloudinary.js";
import postModel from '../../../../db/model/postmodel.js';
import rateModel from '../../../../db/model/rate.model.js';

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
export const showProfile2 = async (req, res) => {
    const userId = req.params.id;
    if (!userId) {
        res.status(440).json({ "msg": "Your Session has Expired" });
    }
    const foundUser = await userModel.findOne({ _id: userId });
    foundUser.password = undefined;
    foundUser._id = null;
    console.log(foundUser);
    res.status(200).json({ "user": foundUser });
};
/*
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
};*/

export const updateProfile = async (req, res) => {
    const id = req.id;
    const updates = req.body;

    try {
        if (!id) {
            return res.status(440).json({ "msg": "Your Session has Expired" });
        }

        if (!updates) {
            return res.status(400).json({ "msg": "Id and updates are required!" });
        }

        const foundUser = await userModel.findById(id);
        if (!foundUser) {
            return res.status(404).json({ "msg": "User not found" });
        }

        // Merge updates
        Object.assign(foundUser, updates);

        const updatedUser = await foundUser.save();
        updatedUser.password = undefined;
        updatedUser._id = null;

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ "msg": "Internal server error" });
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

// export const addSkill = async (req, res) => {
//     const userId = req.id;
//     const skills = req.body.skills;
//     //console.log(skills);
//     if (!userId) { res.status(440).json({ "msg": "Your Session has Expired" }); }
//     else {
//         if (!skills) { res.status(400).json({ "msg": "Please enter the new skills" }); }
//         else {
//             const foundUser = await userModel.findOne({ _id: userId });
//             foundUser.skills = await foundUser.skills.concat(skills);
//             const result = await foundUser.save()
//             // console.log(result)
//             foundUser.password = undefined;
//             foundUser._id = null;
//             res.status(201).json({ "user": foundUser });
//         }
//     }
// };

export const addSkill = async (req, res) => {
    const userId = req.id;
    let skills = req.body.skills;

    // Check if the user session has expired
    if (!userId) {
        return res.status(440).json({ "msg": "Your Session has Expired" });
    }

    // Check if skills are provided
    if (!skills) {
        return res.status(400).json({ "msg": "Please enter the new skills" });
    }

    // Ensure skills is an array
    if (!Array.isArray(skills)) {
        return res.status(400).json({ "msg": "Skills should be an array of strings" });
    }

    try {
        // Find the user by ID
        const foundUser = await userModel.findOne({ _id: userId });

        if (!foundUser) {
            return res.status(404).json({ "msg": "User not found" });
        }

        // Sanitize and filter the input skills
        skills = skills.map(skill => skill.trim()).filter(skill => skill.length > 0);

        // Remove duplicate skills
        const newSkills = [...new Set(skills)];

        // Add new skills to the user's existing skills
        foundUser.skills = Array.from(new Set([...foundUser.skills, ...newSkills]));

        // Save the updated user
        const result = await foundUser.save();

        // Remove sensitive information before sending response
        foundUser.password = undefined;
        foundUser._id = null;

        // Send the updated user profile in the response
        res.status(201).json({ "user": foundUser });
    } catch (error) {
        console.error("Error adding skills:", error);
        res.status(500).json({ "msg": "Internal server error" });
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

// export const realtedPost = async (req, res) => {
//     try {
//         // Get the ID of the logged-in freelancer from the request
//         const freelancerId = req.id; // Assuming the freelancer's ID is stored in req.userId

//         // Find the profile of the logged-in freelancer
//         const freelancer = await userModel.findById(freelancerId);

//         if (!freelancer) {
//             return res.status(404).json({ message: 'Freelancer not found' });
//         }

//         // Extract the freelancer's skills
//         const freelancerSkills = freelancer.skills;

//         // Find posts that match any of the freelancer's requirements
//         const relatedPosts = await postModel.find({ requirements: { $in: freelancerSkills } });

//         res.status(200).json(relatedPosts);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// }

export const relatedPost = async (req, res) => {
    try {
        const userId = req.id;

        // Find the user by ID
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get the user's skills
        const userSkills = user.skills;

        if (!userSkills || userSkills.length === 0) {
            return res.status(400).json({ message: 'User has no skills listed' });
        }

        // Find posts that match the user's skills
        const relatedPosts = await postModel.find({
            requirements: { $in: userSkills }
        }).populate('owner');

        res.status(200).json(relatedPosts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const userById = async (req, res) => {
    const userId = req.params.id;
    if (!userId) {
        res.status(440).json({ "msg": "Your Session has Expired" });
    }

    try {
        const foundUser = await userModel.findOne({ _id: userId });
        const ratings = await rateModel.find({ freelancerId: userId });
        if (foundUser) {
            foundUser.password = undefined;
            console.log(foundUser);
            res.status(200).json({ "user": foundUser, ratings });
        } else {
            res.status(404).json({ "msg": "User not found" });
        }
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ "error": "Internal server error" });
    }
};