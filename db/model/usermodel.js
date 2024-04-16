import mongoose, { model } from 'mongoose';
const { Schema } = mongoose;

//const mongoose = require('mongoose');
//const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  isConfirmed: {
    type: Boolean,
    default: false
  },
  activationCode: String,
  forgetCode: String,
  img: {
    secure_url: String,
    public_id: String
  },
  country: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  desc: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    enum: ["admin", "client", "freelancer"]
  },
  jobtitle: {
    type: String,
    required: false,
  },
  skills: {
    type: [String],
  },
  PaymentInformation:{
    type:String,
    required:false
  },
  CompanyName:{
    type:String,
    required:false,
  }
}
  , {
    timestamps: true
  });


//module.exports = mongoose.model('User', userSchema);

const userModel = model("User", userSchema);
export default userModel
