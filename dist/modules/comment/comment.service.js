"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateComment = void 0;
const comment_repository_1 = require("../../DB/models/comment/comment.repository");
const post_repository_1 = require("../../DB/models/post/post.repository");
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
        let parentCommentExist;
        if (params.postId) {
            const postExist = await this.postRepository.getOne({ _id: params.postId });
            if (!postExist) {
                throw new common_1.NotFoundExcepation("post not found");
            }
        }
        //if parentId >> reply check parentId
        if (params.parentId) {
            parentCommentExist = await this.commentRepository.getOne({ _id: params.parentId });
            if (!parentCommentExist) {
                throw new common_1.NotFoundExcepation("Comment not found ");
            }
        }
        // create comment 
        const comment = await this.commentRepository.create({
            ...createCommentDTO,
            ...params,
            userId,
            postId: params.postId || parentCommentExist?.postId
        });
        return comment;
    }
    async allComment(params) {
        const comments = await this.commentRepository.getAll({
            postId: params.postId,
            parentId: params.parentId
        });
        if (comments.length == 0) {
            throw new common_1.NotFoundExcepation(" no comments");
        }
        return comments;
    }
    async deleteComment(id, userId) {
        //check if commentExist
        const commentExist = await this.commentRepository.getOne({ _id: id }, {}, { populate: [{ path: "postId" }] });
        if (!commentExist) {
            throw new common_1.NotFoundExcepation("comment not found");
        }
        //commentAuthor > comment.userId
        let commentAuthor = commentExist.userId.toString();
        //postAuthor > post.userId
        let postAuthor = commentExist.postId[0]?.userId.toString();
        if (![postAuthor, commentAuthor].includes(userId.toString())) {
            throw new common_1.UnAutorizedExcepation("you are not allowed to delete this comment");
        }
        //delet comment
        await this.commentRepository.delete({ _id: id });
    }
}
exports.CreateComment = CreateComment;
exports.default = new CreateComment(new post_repository_1.PostRepository(), new comment_repository_1.CommentRepository());
