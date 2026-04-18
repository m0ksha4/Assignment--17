import { Model, ProjectionType, QueryFilter, QueryOptions, UpdateQuery } from "mongoose";

export abstract class AbstractRepository<T>{

    constructor(private _model:Model<T>){}

    public async create(item:Partial<T>){
        const doc =new this._model(item)
        return doc.save()
    }
    public async getOne(filter:QueryFilter<T>,
        projection?:ProjectionType<T>,
        options?:QueryOptions){
       return this._model.findOne(filter,projection,options)
    }
    public async getAll(filter:QueryFilter<T>,
        projection?:ProjectionType<T>,
        options?:QueryOptions){
       return this._model.find(filter,projection,options)
    }
    public async updateOne(
        filter:QueryFilter<T>,
        updateData: UpdateQuery<T>,
        options:QueryOptions={}){
            options.returnDocument="after"
        return this._model.findOneAndUpdate(filter,updateData,options)
    }
    // public async updateMany(
    //     filter:QueryFilter<T>,
    //     updateData: UpdateQuery<T>,
    //     options:QueryOptions={}){
    //         options.returnDocument="after"
    //     return this._model.updateMany(filter,updateData,options)
    // }
    public async delete(filter:QueryFilter<T>){
      return this._model.deleteOne(filter)
    }
}