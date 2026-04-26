import { NextFunction, Request, Response, Router } from "express";
import postService from "./post.service";
import { Types } from "mongoose";
import { isValid } from "../../middleware/validation.middleware";
import { createPostSchema } from "./post.dto";
import { default as commentRouter } from "../comment/comment.controller";
const router =Router()
//:postId/comment
router.use("/:postId/comment",commentRouter)
router.post("/",isValid(createPostSchema),async (req:Request,res:Response,next:NextFunction)=>{
   const createdPost = await postService.create(
    req.body,
    new Types.ObjectId("69e3e918d5ed872351ddc326"))
  return res.status(201).json({
        message:"post created successfuly",
        success:true
        ,post:{createdPost}
    })
})

router.post("/reaction",async (req:Request,res:Response,next:NextFunction)=>{
   await postService.addReaction(
    req.body,
    new Types.ObjectId("69e3e918d5ed872351ddc326"))
  return res.sendStatus(204)
})
export default router