import mongoose, { model ,Schema} from 'mongoose';

const tokenSchema = new Schema({
    token:{
        type:String,
        required:true,
    },
    user:{
        type:Types.ObjectId,
        ref:'User'
    },
    isValid:{
        type:Boolean,
        required:true
    },
    expiredAt: {type:String}},
   {timestamps:true} 
)
 
export const Token = mongoose.model.Token || ('Token',tokenSchema)