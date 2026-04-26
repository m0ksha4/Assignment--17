"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../common");
const crypto_utils_1 = require("../../common/utils/crypto.utils");
const user_repository_1 = require("../../DB/models/user/user.repository");
const redis_service_1 = require("../../DB/redis.service");
//single tone
class AuthService {
    userRepository;
    constructor() {
        this.userRepository = new user_repository_1.UserRepository();
    }
    async signup(signupDTO) {
        //check userExists
        const userExist = await this.userRepository.getOne({ email: signupDTO.email });
        if (userExist) {
            throw new common_1.ConflictExcepation("user already exists");
        }
        //hashed password
        signupDTO.password = await (0, common_1.hash)(signupDTO.password);
        //encryption phoneNumber
        if (signupDTO.phoneNumber) {
            signupDTO.phoneNumber = (0, crypto_utils_1.encryption)(signupDTO.phoneNumber);
        }
        //send OTP
        const otp = (0, common_1.generateOTP)();
        //send Email
        await (0, common_1.sendEmail)({
            to: signupDTO.email,
            subject: "confirm email",
            html: `<p> your otp to verify account is ${otp}</p>`
        });
        //save otp in cash
        await (0, redis_service_1.setIntoCache)(`${signupDTO.email}:otp`, otp, 3 * 60);
        // create user into redis
        await (0, redis_service_1.setIntoCache)(signupDTO.email, JSON.stringify(signupDTO), 3 * 14 * 60 * 60);
    }
    async verifyAccount(verifyAccountDTO) {
        //get data from Cache
        const userData = await (0, redis_service_1.getFromCache)(verifyAccountDTO.email);
        if (!userData) {
            throw new common_1.NotFoundExcepation("user not found");
        }
        //get otp
        const otp = await (0, redis_service_1.getFromCache)(`${verifyAccountDTO.email}:otp`);
        if (!otp) {
            throw new common_1.BadRequestExcepation("expire otp");
        }
        //verify otp
        if (otp != verifyAccountDTO.otp) {
            throw new common_1.BadRequestExcepation("invalid otp");
        }
        //convert to real user
        await this.userRepository.create(JSON.parse(userData));
        //deleted otp & user from cache
        await (0, redis_service_1.deleteFromCache)(`${verifyAccountDTO.email}:otp`);
        await (0, redis_service_1.deleteFromCache)(verifyAccountDTO.email);
    }
    // forgetPassword
    async sendOTP(sendOtpDTo) {
        //check email existance into DB
        const userExistIntoDB = await this.userRepository.getOne({ email: sendOtpDTo.email });
        //check email existace into cache
        const userExistIntoChace = await (0, redis_service_1.getFromCache)(sendOtpDTo.email);
        //if user not found
        if (!userExistIntoChace && !userExistIntoDB) {
            throw new common_1.NotFoundExcepation("user not found , please signup");
        }
        //check already has a valid otp
        const otpExist = await (0, redis_service_1.getFromCache)(`${sendOtpDTo.email}:otp`);
        if (otpExist) {
            throw new common_1.BadRequestExcepation("already have valid otp");
        }
        //genreate new otp 
        const otp = (0, common_1.generateOTP)();
        await (0, common_1.sendEmail)({
            to: sendOtpDTo.email,
            subject: " r-send otp",
            html: `<p>your otp is ${otp}</p>`
        });
        //save in cache
        await (0, redis_service_1.setIntoCache)(`${sendOtpDTo.email}:otp`, otp, 3 * 60);
    }
    async resetPassword(resetPasswordDOT) {
        //check email exist
        const userExist = await this.userRepository.getOne({ email: resetPasswordDOT.email });
        if (!userExist) {
            throw new common_1.NotFoundExcepation("user not found");
        }
        //check otp valid
        const otp = await (0, redis_service_1.getFromCache)(`${resetPasswordDOT.email}:otp`);
        if (otp != resetPasswordDOT.otp) {
            throw new common_1.BadRequestExcepation("invalid otp");
        }
        //hashed password
        resetPasswordDOT.newPassword = await (0, common_1.hash)(resetPasswordDOT.newPassword);
        //update password
        await this.userRepository.updateOne({ email: resetPasswordDOT.email }, { password: resetPasswordDOT.newPassword });
        await (0, redis_service_1.deleteFromCache)(`${resetPasswordDOT.email}:otp`);
    }
    async login(loginDOT) {
        // check userExist
        const userExist = await this.userRepository.getOne({ email: loginDOT.email });
        if (!userExist) {
            throw new common_1.NotFoundExcepation("user not found");
        }
        //comper password
        const match = await (0, common_1.compaer)(loginDOT.password, userExist.password);
        if (!match) {
            throw new common_1.UnAutorizedExcepation('Invalid credentials');
        }
        userExist.phoneNumber = (0, crypto_utils_1.decryption)(userExist.phoneNumber);
        return userExist;
    }
}
exports.default = new AuthService();
