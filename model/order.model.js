import mongoose, { model } from 'mongoose';
const { Schema } = mongoose;

const orderSchema = new Schema({
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to the User
      required: true
    },
    freelancer: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to the User
      required: true
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post' // Reference to the Post
      }

}
    ,{
        timestamps:true
});

const userModel = model("Order",userSchema);
export default userModel
