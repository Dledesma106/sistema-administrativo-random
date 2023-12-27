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

@modelOptions({
    schemaOptions: {
        timestamps: true,
    },
})
export class Client {
    _id: mongoose.Types.ObjectId | string;

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
        this: ReturnModelType<typeof Client>,
        filter: FilterQuery<Client> = {},
    ): Promise<Client[]> {
        return await this.find({
            ...filter,
            deleted: false,
        });
    }

    static async findOneUndeleted(
        this: ReturnModelType<typeof Client>,
        filter: FilterQuery<Client> = {},
    ): Promise<Client | null> {
        return await this.findOne({
            ...filter,
            deleted: false,
        });
    }

    async softDelete(this: DocumentType<Client>): Promise<void> {
        this.deleted = true;
        await this.save();
    }

    async restore(this: DocumentType<Client>): Promise<void> {
        this.deleted = false;
        await this.save();
    }

    async getBranches(this: Client): Promise<Branch[]> {
        return await BranchModel.findUndeleted({
            client: this,
        });
    }
}

const ClientModel = getModelForClass(Client);
export default ClientModel;
