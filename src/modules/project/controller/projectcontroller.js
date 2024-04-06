import cloudinary from "../../../../config/cloudinary.js";
import postModel from "../../../../db/model/postmodel.js";

export const uploadFile = async (req, res) => {
    const postId = req.params.postId;
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `Posts/${postId}/ProjectFiles` });
    //Add project files to post schema
    try {
        const post = await postModel.updateOne({ _id: postId }, { $set: { attachments: { secure_url, public_id } } });
        console.log(post);
        res.json({ "file": req.file, "post": post });
    }
    catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }
};  