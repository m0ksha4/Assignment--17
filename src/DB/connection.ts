import mongoose from "mongoose";
import { DB_URL } from "../config";


export function connectDB(){
    mongoose.connect(DB_URL).then(()=>{console.log("DB Connected successfully");
    }).catch((error)=>{
        console.log("fail to Connect DB",error.message);
        
    })
}