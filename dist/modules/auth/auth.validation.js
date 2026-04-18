"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgetPasseordSchema = exports.loginSchema = exports.signupSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const common_1 = require("../../common");
exports.signupSchema = zod_1.default.object({
    userName: common_1.generalFildes.userName,
    email: common_1.generalFildes.email,
    password: common_1.generalFildes.password,
    phoneNumber: common_1.generalFildes.phoneNumber,
    gender: common_1.generalFildes.gender
});
exports.loginSchema = {};
exports.forgetPasseordSchema = {};
