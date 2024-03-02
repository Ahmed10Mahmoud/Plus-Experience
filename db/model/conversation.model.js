import mongoose, { model } from 'mongoose';
const { Schema } = mongoose;

const conversationSchema = new Schema({
    id:{
        type:String,
        required:true,
        unique:true
    },
    clientId:{
        type:String,
        unique:true
    },
    freelancerId:{
        type:String,
        uniqe:true
    },
    readByCliend:{
        type:Boolean,
        required:false,
    },
    readByfreelancer:{
        type:Boolean,
        required:false,
    },
    lastMessage:{
        type:String,
        required:false
    }

}
    ,{
        timestamps:true
});

const conversationModel = model("Conversation",conversationSchema);
export default conversationModel
