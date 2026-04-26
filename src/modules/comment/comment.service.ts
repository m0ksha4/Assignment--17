import { Types } from "mongoose";
import { CommentRepository } from "../../DB/models/comment/comment.repository";
import { CreateCommentDTO } from "./comment.dto";
import { PostRepository } from "../../DB/models/post/post.repository";
import { IPost, NotFoundExcepation, UnAutorizedExcepation } from "../../common";

export class CreateComment {
    constructor( 
        private readonly postRepository:PostRepository,
        private readonly commentRepository:CommentRepository
    ){}
   async create(createCommentDTO:CreateCommentDTO,params:any,userId:Types.ObjectId){
//check post Existance
    let parentCommentExist;
      if(params.postId){
        const postExist = await this.postRepository.getOne({_id:params.postId})
      if(!postExist){throw new NotFoundExcepation("post not found")}}
    //if parentId >> reply check parentId
    if(params.parentId){
         parentCommentExist = await this.commentRepository.getOne({_id:params.parentId})
    
         if(!parentCommentExist){throw new NotFoundExcepation("Comment not found ")}
         }
   // create comment 
   const comment =await this.commentRepository.create({
    ...createCommentDTO,
    ...params,
    userId,
    postId: params.postId || parentCommentExist?.postId
   })  
   return comment ;    
    }
    async allComment(params:any){
      const comments=  await this.commentRepository.getAll({
            postId:params.postId,
            parentId:params.parentId
        })
        if(comments.length==0){throw new NotFoundExcepation(" no comments")}
        return comments
    
    }
    async deleteComment(id:Types.ObjectId,userId:Types.ObjectId){
        //check if commentExist
       const commentExist = await this.commentRepository.getOne({_id:id},{},{populate:[{path:"postId"}]})
       if(!commentExist){throw new NotFoundExcepation("comment not found")}
       //commentAuthor > comment.userId
       let commentAuthor = commentExist.userId .toString()
       //postAuthor > post.userId
       let postAuthor= (commentExist.postId as IPost[])[0]?.userId.toString()
       if(![postAuthor,commentAuthor].includes(userId.toString())){
        throw new UnAutorizedExcepation("you are not allowed to delete this comment")
       }
       
       //delet comment
        await this.commentRepository.delete({_id:id})
    }
}

export default new CreateComment(
    new PostRepository(),
   new CommentRepository()
)