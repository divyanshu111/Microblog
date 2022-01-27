const mongoose= require('mongoose');
const path=require('path');
const Schema=mongoose.Schema;
const userSchema= new Schema({
    username: {
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
       type: String,
       required:true
    },
    phoneNumber:{
        type: String,
        required:false
    }
    ,profile:{
        type: String,
        required: false
    }
})
module.exports= mongoose.model('User',userSchema);