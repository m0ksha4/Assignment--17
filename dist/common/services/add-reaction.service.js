"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addReaction = void 0;
const user_reaction_repository_1 = require("../../DB/models/user-reaction/user-reaction.repository");
const utils_1 = require("../utils");
const enums_1 = require("../enums");
function toModel(collectionName) {
    switch (collectionName) {
        case "posts": return enums_1.ON_MODEL.Post;
        case "comments": return enums_1.ON_MODEL.Comment;
        default: throw new utils_1.BadRequestExcepation("invalid collection");
    }
}
const addReaction = async (addReactionDTO, userId, repo) => {
    //check post existence
    const docExist = await repo.getOne({ _id: addReactionDTO.id });
    console.log("ID:", addReactionDTO.id);
    if (!docExist) {
        throw new utils_1.NotFoundExcepation(`${repo.model.modelName}not found`);
    }
    const collectionName = docExist.collection.name;
    const userReactionRepository = new user_reaction_repository_1.UserReactionRepository();
    //check userReaction
    const userReaction = await userReactionRepository.getOne({
        onModel: toModel(collectionName),
        refId: addReactionDTO.id,
        userId
    });
    //if no reaction >> create new reaction
    if (!userReaction) {
        await userReactionRepository.create({
            onModel: toModel(collectionName),
            refId: addReactionDTO.id,
            userId,
            reaction: addReactionDTO.reaction
        });
        await repo.updateOne({ _id: addReactionDTO.id }, { $inc: { reactionsCount: 1 } });
        return;
    }
    //if same reaction >> remove reaction 
    if (userReaction.reaction == addReactionDTO.reaction) {
        await userReactionRepository.delete({ _id: userReaction._id });
        await repo.updateOne({ _id: addReactionDTO.id }, { $inc: { reactionsCount: -1 } });
        return;
    }
    // if diffrent reaction 
    await userReactionRepository.updateOne({ _id: userReaction._id }, { reaction: addReactionDTO.reaction });
    return;
};
exports.addReaction = addReaction;
