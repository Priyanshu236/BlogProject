import mongoose from "mongoose"

const userSchema=new mongoose.Schema({
    username:
    {
        type:String,
        require: true,
    },
    email:
    {
        type:String,
        require: true,
        unique: true
    },
    password:
    {
        type:String,
        require:true
    },
    profilePic:
    {
        type:String,
        require:false
    }
},{
    timestamps:true
})
export default mongoose.model("User",userSchema)