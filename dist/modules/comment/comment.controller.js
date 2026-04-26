"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comment_service_1 = __importDefault(require("./comment.service"));
const mongoose_1 = require("mongoose");
const common_1 = require("../../common");
const comment_repository_1 = require("../../DB/models/comment/comment.repository");
const router = (0, express_1.Router)({ mergeParams: true });
// addreaction on comment 
router.post("/add-reaction-comment", async (req, res, next) => {
    await (0, common_1.addReaction)(req.body, new mongoose_1.Types.ObjectId("69e3e918d5ed872351ddc326"), comment_repository_1.commentRepo);
    return res.sendStatus(204); //done >> no content
});
// get all comments 
// url= / comment /postId/parentId >> replies on parent comment
// url= / comment /postId >> top level comment
router.get("/:postId{/:parentId}", async (req, res, next) => {
    const allComments = await comment_service_1.default.allComment(req.params);
    return res.status(200).json({ success: true, data: { allComments } });
});
//create comment
router.post("{/:parentId}", async (req, res, next) => {
    await comment_service_1.default.create(req.body, req.params, new mongoose_1.Types.ObjectId("69e3e918d5ed872351ddc326"));
    return res.sendStatus(204);
});
router.delete("/:id", async (req, res, next) => {
    await comment_service_1.default.deleteComment(new mongoose_1.Types.ObjectId(req.params.id), new mongoose_1.Types.ObjectId("69e3e918d5ed872351ddc326"));
    return res.sendStatus(204);
});
exports.default = router;
