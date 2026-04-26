import { NextFunction, Request, Response, Router } from "express";
import commentService from "./comment.service";
import { Types } from "mongoose";
import { addReaction } from "../../common";
import { commentRepo } from "../../DB/models/comment/comment.repository";


const router = Router({mergeParams:true})


// addreaction on comment 
 router.post("/add-reaction-comment",async (
    req:Request,
    res:Response,
    next:NextFunction)=>{
  await addReaction(req.body,new Types.ObjectId("69e3e918d5ed872351ddc326"),commentRepo)
  return res.sendStatus(204);//done >> no content
})

// get all comments 
// url= / comment /postId/parentId >> replies on parent comment
// url= / comment /postId >> top level comment
router.get("/:postId{/:parentId}",async (
    req:Request,
    res:Response,
    next:NextFunction)=>{
 const allComments = await commentService.allComment(req.params)
  return res.status(200).json({success:true,data:{allComments}})
})
//create comment
router.post("{/:parentId}",async (
    req:Request,
    res:Response,
    next:NextFunction)=>{
  await commentService.create(req.body,req.params,new Types.ObjectId("69e3e918d5ed872351ddc326"))
  return res.sendStatus(204)
})

 router.delete("/:id",async (
    req:Request,
    res:Response,
    next:NextFunction)=>{
      await commentService.deleteComment(
        new Types.ObjectId(req.params.id as string),
      new Types.ObjectId("69e3e918d5ed872351ddc326"))
        return res.sendStatus(204)
    })
export default router