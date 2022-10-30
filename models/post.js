
import mongoose from "mongoose";
import dompurify from "dompurify";
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

const window = new JSDOM('').window;
const purify = DOMPurify(window);
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
postSchema.pre('validate',function(next){
    if(this.desc)
    {
        this.desc=purify.sanitize(this.desc)
    }
    next();
})
export default mongoose.model("Post",postSchema)