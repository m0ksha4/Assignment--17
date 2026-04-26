"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const post_service_1 = __importDefault(require("./post.service"));
const mongoose_1 = require("mongoose");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const post_dto_1 = require("./post.dto");
const comment_controller_1 = __importDefault(require("../comment/comment.controller"));
const router = (0, express_1.Router)();
//:postId/comment
router.use("/:postId/comment", comment_controller_1.default);
router.post("/", (0, validation_middleware_1.isValid)(post_dto_1.createPostSchema), async (req, res, next) => {
    const createdPost = await post_service_1.default.create(req.body, new mongoose_1.Types.ObjectId("69e3e918d5ed872351ddc326"));
    return res.status(201).json({
        message: "post created successfuly",
        success: true,
        post: { createdPost }
    });
});
router.post("/reaction", async (req, res, next) => {
    await post_service_1.default.addReaction(req.body, new mongoose_1.Types.ObjectId("69e3e918d5ed872351ddc326"));
    return res.sendStatus(204);
});
exports.default = router;
