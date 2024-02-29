import mongoose from 'mongoose'

const connectDB= async ()=>{
    return await mongoose.connect('mongodb+srv://Ahmed:0101010@cluster0.vrblc0a.mongodb.net/plus_exprience').then(res=>{
        console.log(`DB connected .......`)
    }).catch(error =>{
        console.log(`connection failed....`)
    });
}
export default connectDB;