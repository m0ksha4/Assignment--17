import * as bcrypt from 'bcrypt'
/**
 * @param password plaintext passworf
 * @returns hashed value
 */
export  const hash=async(password :string)=>{
    return bcrypt.hash(password,10)
}

/**
 * 
 * @param password which come from FE(end user)
 * @param hashedPassword which come form DB
 * @returns Promise of boolean
 */
export const comper=async(password:string,hashedPassword:string)=>{
   return bcrypt.compare(password,hashedPassword)
}