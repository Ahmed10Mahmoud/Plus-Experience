import userModel from "../model/usermodel.js";


export const deleteUser = async (req, res) => {
    const id = req.body.id;
    if (!id) res.status(400).json({ "msg": "Id is required" });
    const user = await userModel.findOne({ _id: id }).exec();
    if (!user) {
        return res.status(400).json({ 'message': `User ID (${id}) not found` });
    }
    const result = await userModel.deleteOne({ _id: id });
    res.status(200).json(result);

};

