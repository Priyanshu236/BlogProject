const router=require("express").Router()
const User=require("../models/user")
const bcrypt=require('bcrypt')

router.post("/register",async (req,res)=>{
    console.log("register routes entry")
    if(req.session.email)
    {
        res.status(200).send("valid")
        return;
    }
    
    console.log(req.body)
    const check=await User.findOne({email:req.body.email});
    if(check)
    {
        res.status(404).send("User already exists");
        return;
    }
    try{
        
        const salt=await bcrypt.genSalt(10);
        const hashPass=await bcrypt.hash(req.body.password,salt)

        const newUser=new User({
            username:req.body.username,
            email: req.body.email,
            password:hashPass
        })
        
        const user=await newUser.save();
        console.log(user)
        req.session.email=user.email;
        req.session.username=user.username;
        
        res.status(200).redirect("/")
    }catch(err)
    {
        res.status(400).send(err)
        return;
    }
    
})

router.post("/login",async (req,res)=>{
    if(req.session.email)
    {
        res.redirect("/");
        return;
    }
    const check=await User.findOne({email:req.body.email});
    if(!check)
    {
        res.status(500).send("User doesn't exists");
        return;
    }
    try{
        
        const validate=await bcrypt.compare(req.body.password,check.password);

        if(validate)
        {
            req.session.email=check.email
            req.session.username=check.username
           
            res.status(200).render('index')
        }
        else
        {
            res.status(500).send("Invalid password")
        }
    }catch(err)
    {
        res.status(500).send(err)
    }
})

module.exports=router