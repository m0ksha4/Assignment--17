"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryption = exports.encryption = void 0;
const node_crypto_1 = __importDefault(require("node:crypto"));
const config_1 = require("../../config");
const encryption = (data) => {
    const iv = node_crypto_1.default.randomBytes(16);
    const cipherData = node_crypto_1.default.createCipheriv("aes-256-cbc", Buffer.from(config_1.SECRETKEY), iv);
    let encryptedData = cipherData.update(data, "utf-8", "hex");
    encryptedData += cipherData.final("hex");
    return `${iv.toString("hex")}:${encryptedData}`;
};
exports.encryption = encryption;
const decryption = (encryptedData) => {
    const [iv, encryptedValue] = encryptedData.split(":");
    const ivBufferLike = Buffer.from(iv, "hex");
    const decipher = node_crypto_1.default.createDecipheriv("aes-256-cbc", Buffer.from(config_1.SECRETKEY), ivBufferLike);
    let decrypted = decipher.update(encryptedValue, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
};
exports.decryption = decryption;
