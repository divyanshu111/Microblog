const express=require('express');                          //obj
const port=3000;
const db= require('./db')
const path=require('path');
const app=express();//rend
const session=require('express-session');                       //creates session on browser side
const MongodbSession=require('connect-mongodb-session')(session)//creates session on mongodb side
const constants=require('./constants');
const authrouter=require('./controllers/auth');
const blogrouter=require('./controllers/Blogs');


app.use(express.json());
app.use(express.urlencoded({extended:true}))
const store=new MongodbSession({
    uri: constants.DB,
    collection:'User'
})

//onsole.log(constants.port)
app.use(session({
    secret:constants.SESSIONKEY,
    resave:false,
    saveUninitialized:false,
    store: store //store in the collection
}))//session middleware
app.post('/hat',(req,res)=>{
    res.send({
        status:200,
        message:"Welcome to home",
        answer:console.log(req.body)
    })
})
/*const staticpath=path.join(__dirname,'Public')
 console.log(staticpath);
app.use(express.static(staticpath))
 app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'Public','validation.html'));
})*/
app.use('/auth',authrouter);
app.use('/Blogs',blogrouter);
app.listen(constants.port,()=>{                                     //port=3000 create 
    console.log(`listening on ${constants.port}`)
})