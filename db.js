const mongoose=require('mongoose');
const constants=require('./constants');

//const app=express();
mongoose.connect(constants.DB,{
    useNewUrlparser:true,
   
 useUnifiedTopology:true,
  
}).then(()=>{
    console.log('connection mongoose successful')
}).catch((err)=>console.log(err))