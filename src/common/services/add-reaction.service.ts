import { Types } from "mongoose"
import { AddReactionDTO } from "../dto"
import { CommentRepository } from "../../DB/models/comment/comment.repository"
import { PostRepository } from "../../DB/models/post/post.repository"
import { UserReactionRepository } from "../../DB/models/user-reaction/user-reaction.repository"
import { BadRequestExcepation, NotFoundExcepation } from "../utils"
import { ON_MODEL } from "../enums"


function toModel(collectionName:string){
    switch (collectionName) {
        case "posts":return ON_MODEL.Post;
            
          case "comments":return ON_MODEL.Comment;
    
        default:throw new BadRequestExcepation("invalid collection")
            
    }
}
 export const addReaction=async (
    addReactionDTO:AddReactionDTO,
    userId:Types.ObjectId,
    repo:CommentRepository| PostRepository)=>{
        //check post existence
       const docExist= await repo.getOne({_id:addReactionDTO.id})
       console.log("ID:", addReactionDTO.id)
       if(!docExist){
        throw new NotFoundExcepation( `${repo.model.modelName}not found`)}
        const collectionName=docExist.collection.name
        const userReactionRepository = new UserReactionRepository()
        //check userReaction
       const userReaction=await userReactionRepository.getOne({
            onModel:toModel(collectionName),
            refId:addReactionDTO.id,
            userId
        })
//if no reaction >> create new reaction
if(!userReaction){
    await userReactionRepository.create({
        onModel:toModel(collectionName),
            refId:addReactionDTO.id,
            userId,
            reaction:addReactionDTO.reaction
    }) 
    await repo.updateOne(
        {_id:addReactionDTO.id},
        {$inc:{reactionsCount :1}})
        return; }
    
        //if same reaction >> remove reaction 
    if(userReaction.reaction == addReactionDTO.reaction){
        await userReactionRepository.delete({_id:userReaction._id})
        await repo.updateOne(
        {_id:addReactionDTO.id},
        {$inc:{reactionsCount :-1}})
        return;}
     // if diffrent reaction 
     await userReactionRepository.updateOne(
        {_id:userReaction._id},
        {reaction:addReactionDTO.reaction})   
            return ;}