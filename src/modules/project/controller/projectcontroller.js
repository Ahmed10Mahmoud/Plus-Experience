import cloudinary from "../../../../config/cloudinary.js";
import postModel from "../../../../db/model/postmodel.js";

export const uploadFile = async (req, res) => {
    const title = req.params.title;
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `Posts/ProjectFiles/${title}` });//Add a profile for every user
    //Add project files to post schema
    try {
        const post = await postModel.updateOne({ title: title }, { $set: { attachments: { secure_url, public_id } } });
        console.log(post);
        res.json({ "file": req.file, "post": post });
    }
    catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }
};  