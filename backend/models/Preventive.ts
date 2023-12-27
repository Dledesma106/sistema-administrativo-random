import {
    type Ref,
    prop,
    index,
    getModelForClass,
    modelOptions,
    type ReturnModelType,
    type DocumentType,
} from '@typegoose/typegoose';
import mongoose, { type FilterQuery } from 'mongoose';

import { Branch } from './Branch';
import { Business } from './Business';
import { type IPopulateParameter } from './interfaces';
import { type PreventiveStatus, type Frequency, type Month } from './types';
import { User } from './User';

@index(
    {
        business: 1,
        branch: 1,
    },
    {
        unique: true,
    },
)
@modelOptions({
    schemaOptions: {
        timestamps: true,
    },
})
export class Preventive {
    _id: mongoose.Types.ObjectId | string;

    @prop({
        type: mongoose.SchemaTypes.Array,
        ref: 'User',
        required: true,
    })
    assigned: Array<Ref<User>>;

    @prop({
        ref: 'Business',
        required: true,
    })
    business: Ref<Business>;

    @prop({
        ref: 'Branch',
        required: true,
    })
    branch: Ref<Branch>;

    @prop({
        type: String,
        required: true,
    })
    status: PreventiveStatus;

    @prop({
        type: Number,
        required: false,
    })
    frequency?: Frequency;

    @prop({
        type: mongoose.SchemaTypes.Array,
        required: false,
    })
    months?: Month[];

    @prop({
        type: Date,
        required: false,
    })
    lastDoneAt?: Date;

    @prop({
        type: Date,
        required: false,
    })
    batteryChangedAt?: Date;

    @prop({
        type: String,
        required: false,
    })
    observations?: string;

    @prop({
        type: Boolean,
        default: false,
    })
    deleted: boolean;

    static getPopulateParameters(): IPopulateParameter[] {
        getModelForClass(User);
        getModelForClass(Business);
        getModelForClass(Branch);
        return [
            {
                path: 'assigned',
                populate: User.getPopulateParameters(),
            },
            {
                path: 'business',
            },
            {
                path: 'branch',
                populate: Branch.getPopulateParameters(),
            },
        ];
    }

    static async findUndeleted(
        this: ReturnModelType<typeof Preventive>,
        filter: FilterQuery<Preventive> = {},
    ): Promise<Preventive[]> {
        return await this.find({
            ...filter,
            deleted: false,
        }).populate(this.getPopulateParameters());
    }

    static async findOneUndeleted(
        this: ReturnModelType<typeof Preventive>,
        filter: FilterQuery<Preventive> = {},
    ): Promise<Preventive | null> {
        return await this.findOne({
            ...filter,
            deleted: false,
        }).populate(this.getPopulateParameters());
    }

    async softDelete(this: DocumentType<Preventive>): Promise<void> {
        this.deleted = true;
        await this.save();
    }

    async restore(this: DocumentType<Preventive>): Promise<void> {
        this.deleted = false;
        await this.save();
    }
}

const PreventiveModel = getModelForClass(Preventive);

export default PreventiveModel;
