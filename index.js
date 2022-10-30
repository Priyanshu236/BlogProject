
import express  from "express";
const app=express()

import {stripHtml} from "string-strip-html"
import dotenv from "dotenv";
dotenv.config()
import sessions from "express-session";
import mongodbSession from "connect-mongodb-session"
const MongoDBStore=mongodbSession(sessions)
import mongoose from "mongoose";

import authRoute from "./routes/auth.js"
import postRoute from "./routes/posts.js"
import Post from "./models/post.js"

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
        blog.desc=stripHtml(blog.desc).result
        blog.desc=blog.desc.substring(0,Math.min(blog.desc.length,100))
    })
    let login=0
    if(req.session.email)
    login=1
    res.render("index",{blogs:blogs,login: login})
})
app.get("/",async (req,res)=>{
    
    const blogs=await Post.find({});
    blogs.forEach((blog)=>{
        blog.desc=stripHtml(blog.desc).result
        blog.desc=blog.desc.substring(0,Math.min(blog.desc.length,100))
    })
    let login=0
    if(req.session.email)
    login=1
    res.render("index",{blogs:blogs,login: login})
})
app.get("/profile",async (req,res)=>{
    if(!req.session.email)
    {
        res.send('login First')
        return;
    }
    const blogs=await Post.find({userid: req.session.email});
    blogs.forEach((blog)=>{
        blog.desc=stripHtml(blog.desc).result
        blog.desc=blog.desc.substring(0,Math.min(blog.desc.length,100))
    })
    let login=0
    if(req.session.email)
    login=1
    res.render("profile",{blogs:blogs,login: login})
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
app.listen(process.env.PORT || 5000,(req,res)=>{
    console.log("sever listening on port")
})