import mongoose, { model } from 'mongoose';
const { Schema } = mongoose;

const rateSchema = new Schema({
    clientId: {
        type: String,
        required: true
    },
    freelancerId: {
        type: String,
        required: true
    },
    postId: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        required: true,
        enum: [1, 2, 3, 4, 5]
    },
    comment: {
        type: String,
        required: true
    },

}
    , {
        timestamps: true
    });

const rateModel = model("Rate", rateSchema);
export default rateModel
