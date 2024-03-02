import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://Ahmed:0101010@cluster0.vrblc0a.mongodb.net/plus_exprience?retryWrites=true&w=majority&appName=Cluster0');
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error(err);
    }
}

export default connectDB;
