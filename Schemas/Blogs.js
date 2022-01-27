const mongoose=require('mongoose');
const Schema=mongoose.Schema;
//const ObjetId = Schema.Types.ObjectId;
const blogSchema=new Schema({
    title: {
        type:String,
        required:true
    },
    bodytext:{
        type:String,
        required:true
    },
    userid :{
        type:Schema.Types.ObjectId,
        required:true
    },
    creationdatetime :{
        type: String,
        required:false
    }
   

})
module.exports=mongoose.model('Blogs',blogSchema)