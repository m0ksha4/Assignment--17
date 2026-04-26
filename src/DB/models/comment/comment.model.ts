import { model, Schema } from "mongoose";
import { IComment } from "../../../common";
const schema = new Schema<IComment>({
userId:{type:Schema.Types.ObjectId,ref:"User",required:true},
postId:{type:Schema.Types.ObjectId,ref:"Post",required:true},
parentId:{type:Schema.Types.ObjectId,ref:"Comment"},
attachment:{type:String},
content:{type:String},
reactionsCount:{type:Number,default:0},
mentions:{type:[Schema.Types.ObjectId],ref:"User"}
},{timestamps:true})


schema.pre("deleteOne",async function(){
    //preper data to get _id
    let filter = this.getFilter()
    //get all replies
  const replies= await this.model.find({parentId: filter._id})
    //if there replies >> loop deleteOne 
    if(replies.length >0){
        for (let reply of replies) {
          await this.model.deleteOne({_id:reply._id})
            
        }
    }
})


export const Comment = model("Comment",schema)