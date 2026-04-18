import z from "zod"
import { SYS_GENDER } from "../enums"

export const generalFildes={
    userName:z.string().min(6).max(30),
        password:z.string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
        email:z.email(),
        phoneNumber:z.string().regex(/^(\+20|0020)?01[0125][0-9]{8}$/),
        gender:z.enum(SYS_GENDER).optional()
}