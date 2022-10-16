const router=require("express").Router()
const multer=require("multer")
const categories = require("../models/categories")
const Post=require("../models/post")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './static/uploads/')      //you tell where to up load the files,
    },
    filename: function (req, file, cb) {
      cb(null,  Date.now()+file.originalname)
    }
  })
  
  const multerFilter = (req, file, cb) => {
     if (file.mimetype.split("/")[1] === "png" || file.mimetype.split("/")[1] === "jpg" || file.mimetype.split("/")[1] === "jpeg") {
          cb(null, true);
        } else {
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
    const category=await categories.find({})
    let allCat=[]
    category.forEach(element => {
        allCat.push(element.name)
    });
    if(req.body.category)
    {
        let str=req.body.category
        arr=str.split(',')
        arr.forEach(element => {
            if(allCat.find(element)==undefined)
            {
                const cat=new categories({
                    name: element
                })
                cat.save()
            }
        });
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
    }
    catch(err)
    {
        res.send("<h1>Only Jpg and png files</h1>")
    }
})

router.get("/:id",async (req,res)=>{
    console.log(req.params.id)
    let blog=await Post.find({'_id' : req.params.id})
    const extra=await Post.find({}).sort({createdAt:-1}).limit(3)
    extra.forEach(ch => {
        ch.desc = ch.desc.replace(/<(.|\n)*?>/g, '');
    });
    // res.send(blog)
    console.log(blog)
    blog=blog[0]
    res.render("single",{extra:extra,blog:blog})
})
router.get("/",async (req,res)=>{
    res.render("blog")
})

module.exports=router