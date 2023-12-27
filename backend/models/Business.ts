import {
    prop,
    modelOptions,
    getModelForClass,
    type DocumentType,
    type ReturnModelType,
} from '@typegoose/typegoose';
import type mongoose from 'mongoose';
import { type FilterQuery } from 'mongoose';

// import BranchModel, { type Branch } from './Branch';

@modelOptions({
    schemaOptions: {
        timestamps: true,
    },
})
export class Business {
    _id: mongoose.Types.ObjectId;

    @prop({
        type: String,
        required: true,
        unique: true,
    })
    name: string;

    @prop({
        type: Boolean,
        default: false,
    })
    deleted: boolean;

    static async findUndeleted(
        this: ReturnModelType<typeof Business>,
        filter: FilterQuery<Business> = {},
    ): Promise<Business[]> {
        return await this.find({
            ...filter,
            deleted: false,
        });
    }

    static async findOneUndeleted(
        this: ReturnModelType<typeof Business>,
        filter: FilterQuery<Business> = {},
    ): Promise<Business | null> {
        return await this.findOne({
            ...filter,
            deleted: false,
        });
    }

    async softDelete(this: DocumentType<Business>): Promise<void> {
        this.deleted = true;
        await this.save();
    }

    async restore(this: DocumentType<Business>): Promise<void> {
        this.deleted = false;
        await this.save();
    }

    // async getBranches(this: Business): Promise<Branch[]> {
    //     return await BranchModel.findUndeleted({ businesses: this });
    // }
}

const BusinessModel = getModelForClass(Business);
export default BusinessModel;
