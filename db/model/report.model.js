import mongoose, { model } from 'mongoose';

const ReportSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email address'] // basic email validation
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const reportModel = model("Report", ReportSchema);
export default reportModel
