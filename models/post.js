const mongoose=require("mongoose")
const postSchema=new mongoose.Schema({
    username:{
        type:String,
        require:true
    },
    title:
    {
        type:String,
        require: true
    },
    desc:
    {
        type:String,
        require: true
    },
    image:
    {
        type:String,
        require: false   
    },
    categories:
    {
        type:Array,
        require:false
    },
    userid:
    {
        type:String,
        require: true
    }
},{
    timestamps:true
})
module.exports=mongoose.model("Post",postSchema)