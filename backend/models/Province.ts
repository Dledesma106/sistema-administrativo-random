import {
    prop,
    modelOptions,
    getModelForClass,
    type ReturnModelType,
    type DocumentType,
} from '@typegoose/typegoose';
import type mongoose from 'mongoose';
import { type FilterQuery } from 'mongoose';

import BranchModel, { type Branch } from './Branch';
import CityModel, { type City } from './City';

@modelOptions({ schemaOptions: { timestamps: true } })
export class Province {
    _id: mongoose.Types.ObjectId | string;

    @prop({ type: String, required: true, unique: true })
    name: string;

    @prop({ type: Boolean, default: false })
    deleted: boolean;

    static async findUndeleted(
        this: ReturnModelType<typeof Province>,
        filter: FilterQuery<Province> = {},
    ): Promise<Province[]> {
        return await this.find({ ...filter, deleted: false });
    }

    static async findOneUndeleted(
        this: ReturnModelType<typeof Province>,
        filter: FilterQuery<Province> = {},
    ): Promise<Province | null> {
        return await this.findOne({ ...filter, deleted: false });
    }

    async softDelete(this: DocumentType<Province>): Promise<void> {
        this.deleted = true;
        await this.save();
    }

    async restore(this: DocumentType<Province>): Promise<void> {
        this.deleted = false;
        await this.save();
    }

    async getCities(this: Province): Promise<City[]> {
        return await CityModel.findUndeleted({ province: this });
    }

    async getBranches(this: Province): Promise<Branch[]> {
        return await BranchModel.findUndeleted({ city: { province: this } });
    }
}

export default getModelForClass(Province);
