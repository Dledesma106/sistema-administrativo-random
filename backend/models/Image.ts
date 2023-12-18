import {
    getModelForClass,
    prop,
    modelOptions,
    type ReturnModelType,
    type DocumentType,
} from '@typegoose/typegoose';
import type mongoose from 'mongoose';
import { type FilterQuery } from 'mongoose';

@modelOptions({ schemaOptions: { timestamps: true } })
export class Image {
    _id: mongoose.Types.ObjectId | string;

    @prop({ type: String, required: true })
    name: string;

    @prop({ type: String, required: true })
    url: string;

    @prop({ type: Boolean, default: false })
    deleted: boolean;

    @prop({ type: String, required: true })
    key: string;

    static async findUndeleted(
        this: ReturnModelType<typeof Image>,
        filter: FilterQuery<Image> = {},
    ): Promise<Image[]> {
        return await this.find({ ...filter, deleted: false });
    }

    static async findOneUndeleted(
        this: ReturnModelType<typeof Image>,
        filter: FilterQuery<Image> = {},
    ): Promise<Image | null> {
        return await this.findOne({ ...filter, deleted: false });
    }

    async softDelete(this: DocumentType<Image>): Promise<void> {
        this.deleted = true;
        await this.save();
    }

    async restore(this: DocumentType<Image>): Promise<void> {
        this.deleted = false;
        await this.save();
    }
}

const ImageModel = getModelForClass(Image);
export default ImageModel;
