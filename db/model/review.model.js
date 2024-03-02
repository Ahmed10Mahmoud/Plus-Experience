import mongoose, { model } from 'mongoose';
const { Schema } = mongoose;

const reviewSchema = new Schema({
    clientId:{
        type:String,
        required:true
    },
    freelancerId:{
        type:String,
        required:true
    },
    star:{
        type:Number,
        required:true,
        enum:[1,2,3,4,5]
    },
    desc:{
        type:String,
        required:true
    },

}
    ,{
        timestamps:true
});

const reviewModel = model("Review",userSchema);
export default reviewModel
