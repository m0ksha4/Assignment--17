"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalFildes = void 0;
const zod_1 = __importDefault(require("zod"));
const enums_1 = require("../enums");
exports.generalFildes = {
    userName: zod_1.default.string().min(6).max(30),
    password: zod_1.default.string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
    email: zod_1.default.email(),
    phoneNumber: zod_1.default.string().regex(/^(\+20|0020)?01[0125][0-9]{8}$/),
    gender: zod_1.default.enum(enums_1.SYS_GENDER).optional()
};
