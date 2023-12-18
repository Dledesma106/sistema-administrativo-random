import {
    prop,
    type Ref,
    getModelForClass,
    modelOptions,
    type ReturnModelType,
    type DocumentType,
} from '@typegoose/typegoose';
import type mongoose from 'mongoose';
import { type FilterQuery } from 'mongoose';

import { Activity } from './Activity';
import { Image } from './Image';
import { type IPopulateParameter } from './interfaces';
import { Task } from './Task';
import { type ExpenseStatus, type ExpenseType, type PaySource } from './types';
import { User } from './User';

@modelOptions({ schemaOptions: { timestamps: true } })
export class Expense {
    _id: mongoose.Types.ObjectId | string;

    @prop({ ref: 'User', required: true })
    doneBy: Ref<User>;

    @prop({ type: String, required: true })
    expenseType: ExpenseType;

    @prop({ type: String, required: true })
    paySource: PaySource;

    @prop({ type: String, required: true })
    status: ExpenseStatus;

    @prop({ ref: 'Image', required: true })
    image: Ref<Image>;

    @prop({ type: Number, required: true })
    amount: number;

    @prop({ ref: 'Task', required: false })
    task?: Ref<Task>;

    @prop({ ref: 'User', required: false })
    auditor?: Ref<User>;

    @prop({ ref: 'Activity', required: false })
    activity?: Ref<Activity>;

    @prop({ type: Boolean, default: false })
    deleted: boolean;

    static getPopulateParameters(): IPopulateParameter[] {
        getModelForClass(User);
        getModelForClass(Image);
        getModelForClass(Task);
        getModelForClass(Activity);

        return [
            {
                path: 'doneBy',
            },
            {
                path: 'image',
            },
            {
                path: 'task',
                populate: Task.getPopulateParameters(),
            },
            {
                path: 'auditor',
            },
            {
                path: 'activity',
            },
        ];
    }

    static async findUndeleted(
        this: ReturnModelType<typeof Expense>,
        filter: FilterQuery<Expense> = {},
    ) {
        return await this.find({ ...filter, deleted: false }).populate(
            this.getPopulateParameters(),
        );
    }

    static async findOneUndeleted(
        this: ReturnModelType<typeof Expense>,
        filter: FilterQuery<Expense> = {},
    ): Promise<Expense | null> {
        return await this.findOne({ ...filter, deleted: false }).populate(
            this.getPopulateParameters(),
        );
    }

    async softDelete(this: DocumentType<Expense>): Promise<void> {
        this.deleted = true;
        await this.save();
    }

    async restore(this: DocumentType<Expense>): Promise<void> {
        this.deleted = false;
        await this.save();
    }
}

const ExpenseModel = getModelForClass(Expense);
export default ExpenseModel;
