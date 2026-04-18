import express, { NextFunction, Request, Response } from "express"
import { authRouter } from "./modules"
import { BadRequestExcepation } from "./common"
import { connectDB } from "./DB/connection"
import { redisConnect } from "./DB/redis.connect"

export function bootstrap() {
  const app = express()
  const port = 3000
  //connect to DB
  connectDB()
  redisConnect()
  app.use(express.json())
//routing app
app.use("/auth",authRouter)






//global error handler
app.use((error:Error,req:Request,res:Response,next:NextFunction)=>{
res.status(error.cause as number || 500).json({
message:error.message,
success:false,
details:error instanceof BadRequestExcepation ? error.details:undefined,
stack:error.stack
})






//App listening
})
  app.listen(port, () => {
    console.log(`App Running On Port ${port}`)
  })
}