import z from 'zod'
import { generalFildes } from '../../common'

export const signupSchema=z.object({
    userName:generalFildes.userName,
    email:generalFildes.email,
    password:generalFildes.password,
    phoneNumber:generalFildes.phoneNumber,
    gender:generalFildes.gender
})
export const loginSchema={}
export const forgetPasseordSchema={}