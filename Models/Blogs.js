const mongoose=require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const blogschema=require('../Schemas/Blogs')
const blog_constants=require('../blog_constant');
const Blogs=class{
title;
bodytext;
userid;
creationdatetime;
blogid;
constructor({blogid,title,bodytext,userid,creationdatetime}){
    this.title=title;
    this.bodytext=bodytext;
    this.userid=userid;
    this.creationdatetime=creationdatetime;
    this.blogid=blogid;
    
}
createblog(){
    
    return new Promise(async(resolve,reject)=>{
        this.title.trim();
        this.bodytext.trim();
        const blog= new blogschema({
            title:this.title,
            bodytext:this.bodytext,
            userid:this.userid,
            creationdatetime:this.creationdatetime
        })
        
        try{
            const dbblog= await blog.save();
            resolve(dbblog)
        }
        catch(err){
            reject(err)
        }
    })
}
static getblogs(offset){
    return new Promise(async(resolve,reject)=>{
      try{
        //const dbblogs=await blogschema.find().sort({creationdatetime:-1})//off->next
        
        const dbblogs=await blogschema.aggregate([
            {$sort:{"creationdatetime":-1}},
            { $facet :{
               data:[{"$skip": parseInt(offset)},{ "$limit":blog_constants.BLOGSLIMIT}]
            }}
        ])
        resolve(dbblogs)
      }catch(err){
        reject(err)
      }
    })
}
static myblogs(userid,offset){
    return new Promise(async(resolve,reject)=>{
      try{
        //const dbblogs=await blogschema.find().sort({creationdatetime:-1})//off->next
        // 
         console.log(userid);
        const dbblogs=await blogschema.aggregate([
        { $match: { userid:ObjectId("61b897a17c7599caea8439f7")}},
         {$sort:{"creationdatetime":-1}},
             { $facet :{
               data:[{"$skip": parseInt(offset)},{ "$limit":blog_constants.BLOGSLIMIT}]
            }}
        ])
        resolve(dbblogs);
      }catch(err){
        reject(err)
      }
    })
}
getdataidofblog_fromblog(){
    return new Promise(async(resolve,reject)=>{
        const bloguserid= await blogschema.aggregate([
           { $match: { _id: ObjectId(this.blogid) } },
            { $project:{userid: 1 , creationdatetime:1 } }
            
        ])
        resolve(bloguserid[0]);
    })
}
updateblog(){
    return new Promise(async(resolve,reject)=>{
        let newblogdata={};
        if(this.title){
            newblogdata.title=this.title;
        }
        if(this.bodytext){
            newblogdata.bodytext=this.bodytext;
        }
        
           try{
            const olddata= await blogschema.findOneAndUpdate({_id:ObjectId(this.blogid)},newblogdata);
            return resolve(olddata);
           } 
           catch(err){
               return reject("Database Error");
           }
       

      // console.log(olddata);
      
    })
}
deleteblog(){
    return new Promise(async(resolve,reject)=>{
        const blogdata=await blogschema.findOneAndDelete({_id:ObjectId(this.blogid)});
        resolve(blogdata);
    })
}
}
module.exports=Blogs;