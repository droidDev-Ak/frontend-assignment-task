import mongoose from "mongoose";

const studentSchema =new mongoose.Schema({

    name:{
        type:String,
        requried:true,
    },
    class :{
        type:String,
        required:true,
    },
    subject:{
        type:String,
        default:"Not Assigned",
    },
    assignedTeacher:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    joinedDate:{
        type:Date,
        default:Date.now,
        
    }



},{timestamps:false})