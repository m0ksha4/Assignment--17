import { BadRequestExcepation, ConflictExcepation, generateOTP, hash, NotFoundExcepation, sendEmail } from "../../common";
import { encryption } from "../../common/utils/crypto.utils";
import { UserRepository } from "../../DB/models/user/user.repository";
import { redisClient } from "../../DB/redis.connect";
import { deleteFromCache, getFromCache, setIntoCache } from "../../DB/redis.service";
import { LoginDOT, ResetPasswordDOT, SendOtpDTO, SignupDTO, VerifyAccountDTO } from "./auth.dto";
//single tone
class AuthService{
    private userRepository : UserRepository
    constructor(){
        this.userRepository = new UserRepository()
    }
   async signup (signupDTO:SignupDTO){
    //check userExists
       const userExist= await this.userRepository.getOne({email:signupDTO.email})
       if(userExist){throw new ConflictExcepation("user already exists")}
     //hashed password
      signupDTO.password =await hash(signupDTO.password)
    //encryption phoneNumber
      if(signupDTO.phoneNumber){
        signupDTO.phoneNumber=encryption(signupDTO.phoneNumber)
      }
    //send OTP
      const otp = generateOTP()
    //send Email
      await sendEmail({
        to:signupDTO.email,
        subject:"confirm email",
        html:`<p> your otp to verify account is ${otp}</p>`})
    //save otp in cash
     await setIntoCache(`${signupDTO.email}:otp`,otp,3*60)
    // create user into redis
     await setIntoCache(signupDTO.email,JSON.stringify(signupDTO),3*14*60*60)
      
    }
   async verifyAccount(verifyAccountDTO:VerifyAccountDTO){
        //get data from Cache
        const userData = await getFromCache(verifyAccountDTO.email)
        if(!userData){throw new NotFoundExcepation("user not found") }
        //get otp
        const otp = await getFromCache(`${verifyAccountDTO.email}:otp`)
        if(!otp){throw new BadRequestExcepation("expire otp")}
        //verify otp
        if(otp != verifyAccountDTO.otp){
            throw new BadRequestExcepation("invalid otp")
        }
        //convert to real user
       await this.userRepository.create(JSON.parse(userData))
       //deleted otp & user from cache
       await deleteFromCache(`${verifyAccountDTO.email}:otp`)
       await deleteFromCache(verifyAccountDTO.email)

    }
    // forgetPassword
   async sendOTP(sendOtpDTo:SendOtpDTO){
        //check email existance into DB
        const userExistIntoDB = await this.userRepository.getOne({email:sendOtpDTo.email})
        //check email existace into cache
        const userExistIntoChace=await getFromCache(sendOtpDTo.email)
        //if user not found
        if(!userExistIntoChace && !userExistIntoDB){
            throw new NotFoundExcepation("user not found , please signup")
        }
        //check already has a valid otp
        const otpExist= await getFromCache(`${sendOtpDTo.email}:otp`)
        if(otpExist){
            throw new BadRequestExcepation("already have valid otp")
        }
        //genreate new otp 
        const otp = generateOTP();
        await sendEmail({
        to:sendOtpDTo.email,
        subject:" r-send otp",
        html:`<p>your otp is ${otp}</p>`})
        //save in cache
        await setIntoCache(`${sendOtpDTo.email}:otp`,otp,3*60)
    }
   async  resetPassword(resetPasswordDOT:ResetPasswordDOT){
        //check email exist
        const userExist=await this.userRepository.getOne({email:resetPasswordDOT.email})
        if(!userExist){throw new NotFoundExcepation("user not found")}
        //check otp valid
        const otp= await getFromCache(`${resetPasswordDOT.email}:otp`)
        if(otp != resetPasswordDOT.otp){throw new BadRequestExcepation("invalid otp")}
        //hashed password
        resetPasswordDOT.newPassword= await hash(resetPasswordDOT.newPassword)
        //update password
        await this.userRepository.updateOne(
            {email:resetPasswordDOT.email},
            {password:resetPasswordDOT.newPassword})
        await deleteFromCache(`${resetPasswordDOT.email}:otp`);    
    }
    login(loginDOT:LoginDOT){}
}
export default new AuthService()