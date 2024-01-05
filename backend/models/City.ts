import {
    modelOptions,
    getModelForClass,
    index,
    prop,
    type Ref,
    type DocumentType,
    type ReturnModelType,
} from '@typegoose/typegoose';
import type mongoose from 'mongoose';
import { type FilterQuery } from 'mongoose';

import BranchModel, { type Branch } from './Branch';
import { type IPopulateParameter } from './interfaces';
import { Province } from './Province';

@index(
    {
        name: 1,
        province: 1,
    },
    {
        unique: true,
    },
)
@modelOptions({
    schemaOptions: {
        timestamps: true,
        collection: 'cities',
    },
})
export class City {
    _id: mongoose.Types.ObjectId | string;

    @prop({
        type: Boolean,
        default: false,
    })
    deleted: boolean;

    @prop({
        type: String,
        required: true,
    })
    name: string;

    @prop({
        ref: 'Province',
        required: true,
    })
    provinceId: Ref<Province>;

    static getPopulateParameters(): IPopulateParameter[] {
        getModelForClass(Province);
        return [
            {
                path: 'provinceId',
            },
        ];
    }

    static findUndeleted(
        this: ReturnModelType<typeof City>,
        filter: FilterQuery<City> = {},
    ) {
        return this.find({
            ...filter,
            deleted: false,
        }).populate(this.getPopulateParameters());
    }

    static async findOneUndeleted(
        this: ReturnModelType<typeof City>,
        filter: FilterQuery<City> = {},
    ): Promise<City | null> {
        return await this.findOne({
            ...filter,
            deleted: false,
        }).populate(this.getPopulateParameters());
    }

    async softDelete(this: DocumentType<City>): Promise<void> {
        this.deleted = true;
        await this.save();
    }

    async restore(this: DocumentType<City>): Promise<void> {
        this.deleted = false;
        await this.save();
    }

    async getBranches(this: City): Promise<Branch[]> {
        return await BranchModel.findUndeleted({
            city: this,
        });
    }
}

const CityModel = getModelForClass(City, {
    schemaOptions: {
        collection: 'cities',
    },
});
export default CityModel;
