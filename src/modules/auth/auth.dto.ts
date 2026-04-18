import z from "zod"
import { SYS_GENDER } from "../../common"
import { signupSchema } from "./auth.validation"



export type SignupDTO=z.infer<typeof signupSchema>

export interface LoginDOT{
email:string,
password:string,
}
export interface ForgetPasswordDOT{
email:string,
phoneNumber?:string,
otp:string,
newPassword:string
}
export interface ResetPasswordDOT{
email:string,
otp:string,
newPassword:string,
}
export interface VerifyAccountDTO{
otp:string,
email:string
}
export interface SendOtpDTO{
    email:string
}