export class NotFoundExcepation extends Error{
    constructor(message:string){
        super(message,{cause:404})}
    
}
export class UnAutorizedExcepation extends Error{
    constructor(message:string){
        super(message,{cause:401})}
        
    }
export class ConflictExcepation extends Error{
        constructor(message:string){
            super(message,{cause:409})}
 }

//  interface IDetails{
//     path:string,
//     message:string
//  }
export class BadRequestExcepation extends Error{
        constructor(
            message:string,
            public details?:Record < string , string >[]){ //Represent object
         super(message,{cause:400})}
            
        }