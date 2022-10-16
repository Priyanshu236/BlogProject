const express=require('express')
const app=express()
require('dotenv').config()

const sessions = require('express-session');
const MongoDBStore=require("connect-mongodb-session")(sessions)
const mongoose=require("mongoose")
const authRoute=require("./routes/auth")
const postRoute=require("./routes/posts")
const Post=require("./models/post");



const oneDay = 1000 * 60 * 60 * 24;
app.set('view engine','ejs')
mongoose.connect( process.env.DB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology:true
}).then(
    ()=>{
        console.log("Database Connected Succesfully")
    }
).catch(
    (err)=>{console.log("error")}
)

const store = new MongoDBStore({
    uri: process.env.DB_URL,
    collection: 'mySessions'
},(err)=>{
    
});

app.use(sessions({
    secret: "mysecretekey",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false,
    store: store
}))

app.use(express.static(__dirname+"/static"))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/auth",authRoute)
app.use("/post",postRoute)





app.get("/",async (req,res)=>{
    
    const blogs=await Post.find({});
    blogs.forEach((blog)=>{
        blog.desc = blog.desc.replace(/<(.|\n)*?>/g, '');
        blog.desc=blog.desc.substring(0,Math.min(blog.desc.length,100))
    })
    res.render("index",{blogs:blogs})
})

app.get("/login",(req,res)=>{
    if(req.session.email)
    {
        res.redirect('/');
    }
    res.render("login");
})
app.get("/register",(req,res)=>{
    if(req.session.email)
    {
        res.redirect('/');
    }
    res.render("register");
})
app.get("/logout",(req,res)=>{
    if(!req.session.email)
    {
        res.send("Login First");
        return;
    }
    res.render("Logout");
})

app.post("/logout",(req,res)=>{
    req.session.destroy()
    res.redirect("/")
})
app.listen(5000,(req,res)=>{
    console.log("sever listening on 5000")
})