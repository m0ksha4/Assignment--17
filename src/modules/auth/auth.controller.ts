import {  type NextFunction,type Request, type Response, Router } from "express";
import authService from "./auth.service";
import { isValid } from "../../middleware/validation.middleware";
import { signupSchema } from "./auth.validation";
const router=Router()
//signup to App
router.post("/signup",isValid (signupSchema),async(
    req:Request,
    res:Response,
    next:NextFunction)=>{
await authService.signup(req.body)
return res.status(201).json({message:"user created successfully",susuccess:true})
})
//verfiy-account
router.patch("/verfiy-account",async(
    req:Request,
    res:Response,
    next:NextFunction)=>{
await authService.verifyAccount(req.body)
return res.status(200).json({message:"account verifued successfully",susuccess:true})
})
// sendOTP
router.post("/send-otp",async(
    req:Request,
    res:Response,
    next:NextFunction)=>{
await authService.sendOTP(req.body)
return res.status(200).json({message:"Check your email to get otp",susuccess:true})
})
//resetPassword
router.patch("/reset-password",async(
    req:Request,
    res:Response,
    next:NextFunction)=>{
await authService.resetPassword(req.body)
return res.status(200).json({message:"your password update successfully",susuccess:true})
})
export default router   