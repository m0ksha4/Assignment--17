"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_service_1 = __importDefault(require("./auth.service"));
const validation_middleware_1 = require("../../middleware/validation.middleware");
const auth_validation_1 = require("./auth.validation");
const router = (0, express_1.Router)();
//signup to App
router.post("/signup", (0, validation_middleware_1.isValid)(auth_validation_1.signupSchema), async (req, res, next) => {
    await auth_service_1.default.signup(req.body);
    return res.status(201).json({ message: "user created successfully", susuccess: true });
});
//verfiy-account
router.patch("/verfiy-account", async (req, res, next) => {
    await auth_service_1.default.verifyAccount(req.body);
    return res.status(200).json({ message: "account verifued successfully", susuccess: true });
});
// sendOTP
router.post("/send-otp", async (req, res, next) => {
    await auth_service_1.default.sendOTP(req.body);
    return res.status(200).json({ message: "Check your email to get otp", susuccess: true });
});
//resetPassword
router.patch("/reset-password", async (req, res, next) => {
    await auth_service_1.default.resetPassword(req.body);
    return res.status(200).json({ message: "your password update successfully", susuccess: true });
});
exports.default = router;
