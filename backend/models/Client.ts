import { prop, modelOptions, getModelForClass, ReturnModelType, DocumentType } from "@typegoose/typegoose";
import dbConnect from "lib/dbConnect";
import mongoose from "mongoose";
import BranchModel, {Branch} from './Branch'

@modelOptions({schemaOptions:{timestamps:true}})
export class Client {
    _id:mongoose.Types.ObjectId | string

    @prop({type:String, required:true, unique:true})
    name:string

    @prop({type:Boolean, default:false})
    deleted:boolean

    static async findUndeleted(this:ReturnModelType<typeof Client>, filter:Object = {}){
        return await this.find({...filter, deleted:false})
    }

    static async findOneUndeleted(this:ReturnModelType<typeof Client>, filter:Object = {}){
        return this.findOne({...filter, deleted:false})
    }
    
    async softDelete(this:DocumentType<Client>){
        this.deleted = true
        await this.save()
    }

    async restore(this:DocumentType<Client>){
        this.deleted = false
        await this.save()
    }

    async getBranches(this:Client) {
        return await BranchModel.findUndeleted({client:this})   
    }
}

export default getModelForClass(Client)