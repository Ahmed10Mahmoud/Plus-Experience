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
  cover: {
    secure_url: { type: String },
    public_id: { type: String }
  },
  requirements: {
    type: [String],
    required: true
  },
  joinedFreelancers: {
    maxNumber: { type: Number, max: 5 },
    freelancersIdList: [String],
    waitingList: [String],
  },
  deadline: {
    type: Date
  },
  attachments: {
    secure_url: String,
    public_id: String
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User schema
    required: true,
    validate: {
      validator: function (value) {
        return mongoose.model('User').findOne({ _id: value, role: 'client' }).exec();
      },
      message: props => `${props.value} is not a valid client user ID!`
    }
  }
}
  , {
    timestamps: true
  });

const postModel = model("Post", postSchema);
export default postModel
