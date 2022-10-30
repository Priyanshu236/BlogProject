import { createRequire } from "module";
const require = createRequire(import.meta.url);
const mongoose=require("mongoose")
const categorySchema=new mongoose.Schema({
    name:
    {
        type:String,
        require: true
    }
})
export default mongoose.model("Category",categorySchema)