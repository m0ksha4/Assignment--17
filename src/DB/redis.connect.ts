import { createClient } from "redis"
import { REDIS_URL } from "../config";

export const redisClient = createClient({
  url: REDIS_URL
});

export async function redisConnect (){
     redisClient.connect()
     .then(()=>{
        console.log("redis connected successfully");
        
     }).catch((error)=>{
        console.log("fail to connect DB");
        
     })
}
