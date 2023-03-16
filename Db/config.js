import mongoose from "mongoose";

mongoose.connect('mongodb://localhost:27017/api').then((res)=>{
    console.log("connected to database");
}).catch((err)=>{
    console.log("disconnected to database");
})