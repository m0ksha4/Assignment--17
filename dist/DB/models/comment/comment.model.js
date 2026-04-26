"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Post", required: true },
    parentId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Comment" },
    attachment: { type: String },
    content: { type: String },
    reactionsCount: { type: Number, default: 0 },
    mentions: { type: [mongoose_1.Schema.Types.ObjectId], ref: "User" }
}, { timestamps: true });
schema.pre("deleteOne", async function () {
    //preper data to get _id
    let filter = this.getFilter();
    //get all replies
    const replies = await this.model.find({ parentId: filter._id });
    //if there replies >> loop deleteOne 
    if (replies.length > 0) {
        for (let reply of replies) {
            await this.model.deleteOne({ _id: reply._id });
        }
    }
});
exports.Comment = (0, mongoose_1.model)("Comment", schema);
