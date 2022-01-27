const userschema=require('../Schemas/User')
const mongoose = require('mongoose');
const bcrypt=require('bcrypt');
const validator=require('validator')
const ObjectId=require('mongodb').ObjectId
const path=require('path');
let User= class{
    username;
    email;
    password;
    phonenumber;
    name;
    profilepic;//{see brackets}
    constructor({username,email,password,phonenumber,name,profilepic})
    {
        this.username=username;
        this.email=email;
        this.password=password;
        this.phonenumber=phonenumber;
        this.name=name;
        this.profilepic=profilepic;
    }
    static async verifyusernameandemailexists({username,email})
    { 
    try
    {
        let user={};
        user =await userschema.findOne({$or:[{username},{email}]});
        console.log(user);
        if(user && user.email===email)
        {
            return {
                valid: true,
                error: "email already exists"
            }
        }
        if(user && user.username===username)
        {
            return  {
                valid: true,
                error: "username already exists"

            }
        }
        return{
            valid: false
        } 
    }
    catch(err)
    {
        return {
            valid:true,
            db_error:true,
            error: err
        }
    }
        
    }
    static verifyuserid({userid}){
        console.log(userid)
        return new Promise(async(resolve,reject)=>{
            try{
               
                const dbuser= await userschema.findOne({_id:ObjectId(userid)});
                if(!dbuser){
                    reject("No user found")
                }
                resolve(dbuser)
               }catch(err){
                reject(err)
               }

        }) 
    }
    static loginUser({loginid,password}){
       
        return new Promise(async(resolve,reject)=>{
            let dbuser={};
            if(validator.isEmail(loginid)){
                dbuser=await userschema.findOne({email:loginid})
            }
            else{
                dbuser= await userschema.findOne({username:loginid})         //nu
            }
            if(!dbuser){
                return reject("No user found");
            }
            //console.log("ab pata chale")
            console.log(dbuser)
            const isMatch=await bcrypt.compare(password,dbuser.password);
            if(!isMatch){
                return reject("Invalid Password")
            }
            resolve(dbuser);
        })
   }
   
     registerUser(){
         return new Promise(async(resolve,reject)=>{
            const hashedpassword=await bcrypt.hash(this.password,15)
            const User=new userschema({
                username:this.username,
                email:this.email,
                password:hashedpassword,
                name:this.name,
                phonenumber:this.phonenumber,
                profilepic:this.profilepic
            })
            try{
                console.log(User)
                const dbuser= await User.save();
                return resolve(dbuser);
            }
            catch(err){
                 return reject(err);
            }  
         })
        
        
   
    }
}
module.exports= User;