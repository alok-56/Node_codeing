import mongoose from "mongoose";

const apischema=new mongoose.Schema({
    id:String,
    title:String,
    price:String,
    description:String,
    category:String,
    image:String,
    sold:String,
    dateofsale:String
})

const apimodel=mongoose.model('data',apischema);
export default apimodel;