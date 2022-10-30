import { Router } from "express"
const router=Router()
import multer from "multer"

import category from "../models/categories.js"
import Post from "../models/post.js"
import {stripHtml} from "string-strip-html"
import post from "../models/post.js"
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './static/uploads/')      //you tell where to up load the files,
    },
    filename: function (req, file, cb) {
      cb(null,  Date.now()+file.originalname)
    }
  })
  
  const multerFilter = (req, file, cb) => {
    const valid=["png","jpg","jpeg","PNG","JPG","JPEG"]
    let str=valid.includes(file.mimetype.split("/"));
    console.log(str)
    console.log( valid.includes(file.mimetype.split("/")[1]))
    if( valid.includes(file.mimetype.split("/")[1]) )
    {
        //  if ( file.mimetype.split("/")[1] === "png" || file.mimetype.split("/")[1] === "jpg" ||  file.mimetype.split("/")[1] === "jpeg") {
            cb(null, true);
            return;
    }
        else {
            cb(new Error("Only png and Jpg"), false);
        }
    };
    const upload = multer({storage: storage, fileFilter: multerFilter});
    
router.post("/",upload.single('image'),async (req,res)=>{
    if(!req.session.email)
    {   
        res.send("Login First")
        return;
    }
 
    let arr=[]
    const categories=await category.find({})
    let allCat=[]
    categories.forEach(element => {
        allCat.push(element.name)
    });
    if(req.body.category)
    {
        let str=req.body.category
        arr=str.split(',')
        for(const element of categories) {
            if(!allCat.find(element))
            {
                const cat=new categories({
                    name: element
                })
                await cat.save()
            }
        }
    }
    try{
            const post=new Post({
            username: req.session.username || "unknown",
            title: req.body.title || "Hi",
            desc: req.body.desc,
            image: req.file.filename || "blog.jpg",
            categories: arr,
            userid: req.session.email
        })
        await post.save();
        res.redirect('/')
        return;
    }
    catch(err)
    {
        console.log(err)
        res.send("<h1>Only Jpg and png files</h1>")
    }
})

router.get("/:id",async (req,res)=>{
    console.log(req.params.id)
    let blog=await Post.find({'_id' : req.params.id})
    if(!blog)
    {
        res.send("blog doesn't exist");
        return;
    }
    const extra=await Post.find({}).sort({createdAt:-1}).limit(3)
    extra.forEach(ch => {
        ch.desc = stripHtml(ch.desc)
    });
    // res.send(blog)
    console.log(blog)
    blog=blog[0]
    let login=0;
    if(req.session.email)
    login=1
    res.render("single",{extra:extra,blog:blog,login:login})
})
router.get("/",async (req,res)=>{
    if(!req.session.email)
    {
        res.send("login first")
        return;
    }
    res.render("blog",{login:1})
})

router.get("/edit/:id",async (req,res)=>{
    if(!req.session.email)
    {
        res.send("login first")
        return;
    }
    console.log(req.params.id)
    const blog=await Post.find({'_id' : req.params.id})
    console.log(blog[0].userid)
    if(blog[0].userid !== req.session.email)
    {
        res.send("Invalid request")
        return;
    }
    res.render("edit",{blog:blog[0],login:1})
})
router.post("/edit/:id",async(req,res)=>{
    console.log("reqbody")
    console.log(req.body)
    const chk= await Post.findOneAndUpdate({_id:req.params.id},(req.body));
    console.log("updated")
    console.log(chk)
    res.redirect("/profile")
})
router.post("/search",async (req,res)=>{
    console.log("/"+req.body.text+"/")
    let blogs=await Post.find( {title:{$regex:".*"+req.body.text+".*",$options:'i'} } )
    console.log(blogs)
    let login=0
    if(req.session.email)
    login=1
    res.render("search",{blogs:blogs,login:login})
})

export default router