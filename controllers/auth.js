const express= require('express');
const mongoose = require('mongoose');
const authrouter=express.Router();
const validator=require('validator');
const User=require('../Models/User');
const path=require('path');
//const user=require('../Models/User');

function cleanupandvalidate({email,username,phonenumber,password})
{
     try
     {
       if(!validator.isEmail(email)){
            throw "invalid email"
       }
       if(username.length<3){
          throw "very Short username"
        }
        if(username.length>30){
          throw "Very long Username"
        }
       if(phonenumber && phonenumber<10){
           throw "Phone number not valid"
        }
      if(password && !validator.isAlphanumeric(password)){
            throw "Password should contain alphabets and numericals"
       }
        return {
        valid:true
       }
     }
     catch(err)
     { 
     return {
           valid:false,
           error:err
       }
    }
}

authrouter.post('/register',async(req,res)=>
{
 
 const {name,email,username,password,phonenumber,profile}=req.body
 console.log(email)
 console.log(username)
const validdata=cleanupandvalidate({email,username,phonenumber,password});
console.log(validdata)
if(!validdata.valid){
 res.send({
     status:400,
     message:"not valid data",
     error: validdata.error
 })
}
const useralreadyexists=await User.verifyusernameandemailexists({username,email})
 if(useralreadyexists.db_error){
    return res.send({
        status:401,
         message:"Data_Base Error"
    })
}
//dbt
if(useralreadyexists.valid){
    return res.send({
        status:400,
        message:"User already exists",
        error:useralreadyexists.error
    })
}
const user=new User({username,email,password,phonenumber,name,profile});
try{
  const dbuser=await user.registerUser();
  return res.send({
    status:200,
    message:"Registration successful",
    data:dbuser
   
 })
}
catch(err){
  return res.send({
    status:401,
    message:"Internal error",
    error: err
   
})

}

})
authrouter.post('/login',async(req,res)=>{
  const{loginid,password}=req.body;//can be both username and email
  if(!loginid ||! password){
    return res.send({
      status:401,
      message:"Invalid Credentials"
    })
  }
  //console.log("hathi",loginid)
  let user={};
  try{
    const dbuser=await User.loginUser({loginid,password})
    req.session.isAuth=true,
    req.session.user={
      userid:dbuser._id,
      email:dbuser.email,
      username:dbuser.username,
      name:dbuser.name
    };
    return res.send({
      status:200,
      message:"Login Successful",
      data:dbuser
    })

  }
  catch(err){
    return res.send({
      status:400,
      message:"Error occured",
      error:err
    })

 }
    
})
//auth/g/f
module.exports=authrouter;