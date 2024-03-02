import mongoose, { model } from 'mongoose';
const { Schema } = mongoose;

const postSchema = new Schema({
    title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      category: {
        type: String,
        required: true
      },
      imgs:{
        type:[String],
        required:false
      },
      cover:{
        type:String,
        required:true
      },
      shortTitle:{
        type:String,
        required:true
      },
      shortDisc:{
        type:String,
        required:true
      },
      deliveryTime:{
        type:Number,
        required:true
      },
      revisionNumber:{
        type:Number,
        required:true
      },
      requiremnets:{
        type:[String],
        required:false
      },
      maxNumOfFreelancer:{
        type:Number,
        max:5,       
      },
      attachments:
        {
            fileName: String,
            fileUrl: String
        },
      owner: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User schema
        required: true,
        validate: {
            validator: function(value) {
                return mongoose.model('User').findOne({ _id: value, role: 'client' }).exec();
            },
            message: props => `${props.value} is not a valid client user ID!`
        }
    }
}
    ,{
        timestamps:true
});

const postModel = model("Post",postSchema);
export default postModel
