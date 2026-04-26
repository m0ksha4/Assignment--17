import { Types } from "mongoose";

export interface IPost{
    userId:Types.ObjectId,
    content?:string,
    attachments?:string[];//[url]
    reactionsCount:number,
    commentsCount:number,
    sharesCount:number
}