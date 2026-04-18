"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractRepository = void 0;
class AbstractRepository {
    _model;
    constructor(_model) {
        this._model = _model;
    }
    async create(item) {
        const doc = new this._model(item);
        return doc.save();
    }
    async getOne(filter, projection, options) {
        return this._model.findOne(filter, projection, options);
    }
    async getAll(filter, projection, options) {
        return this._model.find(filter, projection, options);
    }
    async updateOne(filter, updateData, options = {}) {
        options.returnDocument = "after";
        return this._model.findOneAndUpdate(filter, updateData, options);
    }
    // public async updateMany(
    //     filter:QueryFilter<T>,
    //     updateData: UpdateQuery<T>,
    //     options:QueryOptions={}){
    //         options.returnDocument="after"
    //     return this._model.updateMany(filter,updateData,options)
    // }
    async delete(filter) {
        return this._model.deleteOne(filter);
    }
}
exports.AbstractRepository = AbstractRepository;
