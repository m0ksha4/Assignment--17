"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateComment = void 0;
const common_1 = require("../../common");
class CreateComment {
    postRepository;
    commentRepository;
    constructor(postRepository, commentRepository) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
    }
    async create(createCommentDTO, params, userId) {
        //check post Existance
        const postExist = await this.postRepository.getOne({ _id: params.postId });
        if (!postExist) {
            throw new common_1.NotFoundExcepation("post not found");
        }
        //if parentId >> reply check parentId
        if (params.parentId) {
            const parentCommentExist = await this.commentRepository.getOne({ _id: params.parentId });
            if (!parentCommentExist) {
                throw new common_1.NotFoundExcepation("Comment not found ");
            }
        }
        // create comment 
        const comment = await this.commentRepository.create({
            ...createCommentDTO,
            ...params,
            userId
        });
        return comment;
    }
}
exports.CreateComment = CreateComment;
