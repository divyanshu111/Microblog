const express=require('express');
const blogrouter=express.Router();
const Blogs=require('../Models/Blogs');
const User=require('../Models/User');
const mongoose=require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
blogrouter.post('/create-blog',async(req,res)=>{
    const userid=req.body._id;
    let title=req.body.title;
    let bodytext=req.body.bodytext;
    const creationdatetime=new Date();
    //cr anob
    if(!userid ){
        res.send({
            status:401,
            message:"Invalid userid"
        })
    }
     try{
       await  User.verifyuserid({userid})
     }
     catch(err){
       return res.send({
           status:401,
           message:"Error Occured user id not verified",
           error:err
       })
     }
    console.log(title);
    console.log(bodytext);
    console.log(typeof(title));
    console.log(typeof(bodytext));
    console.log(creationdatetime);
    console.log(userid);
    if(!title || !bodytext || typeof(title)!="string"){
        res.send({
            status:401,
            message:"Invalid dData"
        })
    }
    if(title.length>50){
        return res.send({
            status:401,
            message:"Title too long"
        })
    }
    if(bodytext.length>1000){
        return res.send({
            status:401,
            message:"Blog too long"
        })
    }
    const blogs=new Blogs({title,bodytext,userid,creationdatetime})
    console.log(blogs)
    try{
    const dbblog=await blogs.createblog();
     res.send({
         status:200,
         message:"Blog Created Successfully",
         data:dbblog
     })
    }
    catch(err){
        res.send({
            staus:400,
            message:"Error Occured",
            error:err
        })

    }

})
blogrouter.get('/get-blogs',async(req,res)=>{
    //off
    const offset=req.query.offset ||0;
    console.log(offset)
    try{
      const dbblogs=await Blogs.getblogs(offset);
      res.send({
          status:200,
          message:"Successful",
          data:dbblogs
      })
    }
    catch(err){
        res.send({
            status:401,
            message:"Error occured in getting blogs",
            error:err
        })
    }

})


blogrouter.get('/my-blogs/:userid/:offset',async(req,res)=>{
    const userid=req.params.userid;
    const offset=req.params.offset||0;
    console.log(userid);
    try{
       const dbblogs=await Blogs.myblogs({userid,offset});
       res.send({
           status:200,
           message:"Successful",
           data:dbblogs
       })
    }
    catch(err){
        return res.send({
            status:"400",
            message:"Cannot get your blogs(Database error)",
            error:err
        })
       
    }

})
blogrouter.post('/edit-blogs',async(req,res)=>{
    const {title,bodytext}= req.body.data;
    const blogid=req.body.blogid;
    const userid=req.body.userid;//req.session.user.useruiid
    if(!title &&!bodytext){
        return res.send({
            status:400,
            message:"Insufficient Data(Bad request)",
            error:"Missing title and bodytext"
        })
    }
    console.log(title);
    try{
      const blog=new Blogs({blogid,title,bodytext});
      const dbblogdata=await blog.getdataidofblog_fromblog();
      console.log(dbblogdata," ",userid," ",blogid);
      //console.log(dbblogdata.userid);
      //if user has created the blog he is allowed to edit the blog.
      if(dbblogdata.userid!=userid){
         return  res.send({
              status:401,
              message:"Not allowed to edit",
              error:"Blog belongs to some other user(Unauthorised access)"
          })
      }
      //time limit
      const oldblog= await blog.updateblog();
      console.log(oldblog)
      return res.send({
          status:200,
          message:"Edited Successfully",
          data:oldblog
      })
    }
    catch(err){
        return res.send({
            status:"400",
            message:"failed to edit the blog(Bad request)",
            error:err
        })
       
    }

})
blogrouter.post('/delete-blogs',async(req,res)=>{
    const blogid=req.body.blogid;
    const userid=req.body.userid;//req.session.user.useruiid
    
    try{
      const blog=new Blogs({blogid});
      const dbblogdata=await blog.getdataidofblog_fromblog();
      
      if(dbblogdata.userid!=userid){
         return  res.send({
              status:401,
              message:"Delete unsuccessful ",
              error:"Blog belongs to some other user(Unauthorised access)"
          })
      }
      //time limit
      const blogdata= await blog.deleteblog();
      return res.send({
          status:200,
          message:"Edited Successfully",
          data:blogdata
      })
    }
    catch(err){
        return res.send({
            status:"400",
            message:"failed to Delete the blog(Bad request)",
            error:err
        })
       
    }

})
module.exports=blogrouter;