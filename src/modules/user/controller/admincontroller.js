import userModel from "../../../../db/model/usermodel.js";


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

export const allUsers = async(req,res)=>{
    try {
        const users = await userModel.find();
        res.status(200).json(users);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch users' });
      }
}

export const getUserByUserName = async (req, res) => {
  try {
    const { userName } = req.params;
    const user = await userModel.findOne({ userName });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};

