import { Types } from "mongoose";
import { AddReactionDTO, CreatePostDTO } from "./post.dto";
import { PostRepository } from "../../DB/models/post/post.repository";
import { NotFoundExcepation, ON_MODEL } from "../../common";
import { UserReactionRepository } from "../../DB/models/user-reaction/user-reaction.repository";

export class PostService{
    constructor(
        private readonly postRepository:PostRepository,
        private readonly userReactionRepository:UserReactionRepository
     ){}
    async create(createPostDTO:CreatePostDTO,userId:Types.ObjectId){
    return  await this.postRepository.create({...createPostDTO,userId})
    }
    async addReaction (addReactionDTO:AddReactionDTO,userId:Types.ObjectId){
        //check post existence
       const postExist= await this.postRepository.getOne({_id:addReactionDTO.postId})
       if(!postExist){
        throw new NotFoundExcepation("post not found")}
        //check userReaction
       const userReaction=await this.userReactionRepository.getOne({
            onModel:ON_MODEL.Post,
            refId:addReactionDTO.postId,
            userId
        })
//if no reaction >> create new reaction
if(!userReaction){
    await this.userReactionRepository.create({
        onModel:ON_MODEL.Post,
            refId:addReactionDTO.postId,
            userId,
            reaction:addReactionDTO.reaction
    }) 
    await this.postRepository.updateOne(
        {_id:addReactionDTO.postId},
        {$inc:{reactionsCount :1}})
        return; }
    
        //if same reaction >> remove reaction 
    if(userReaction.reaction == addReactionDTO.reaction){
        await this.userReactionRepository.delete({_id:userReaction._id})
        await this.postRepository.updateOne(
        {_id:addReactionDTO.postId},
        {$inc:{reactionsCount :-1}})
        return;}
     // if diffrent reaction 
     await this.userReactionRepository.updateOne(
        {_id:userReaction._id},
        {reaction:addReactionDTO.reaction})   
            return ;}   
    
}
export default new PostService(
    new PostRepository(),
new UserReactionRepository())