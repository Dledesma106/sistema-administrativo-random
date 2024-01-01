import {
    prop,
    type Ref,
    getModelForClass,
    modelOptions,
    type ReturnModelType,
    type DocumentType,
} from '@typegoose/typegoose';
import mongoose, { type FilterQuery } from 'mongoose';

import { Activity } from './Activity';
import { Branch } from './Branch';
import { Business } from './Business';
import ExpenseModel, { type Expense } from './Expense';
import { Image } from './Image';
import { type IPopulateParameter } from './interfaces';
import { type TaskType, type TaskStatus } from './types';
import { User } from './User';

@modelOptions({
    schemaOptions: {
        timestamps: true,
    },
})
export class Task {
    _id: mongoose.Types.ObjectId | string;

    @prop({
        ref: 'Branch',
        required: true,
    })
    branch: Ref<Branch>;

    @prop({
        ref: 'Business',
        required: true,
    })
    business: Ref<Business>;

    @prop({
        type: mongoose.SchemaTypes.Array,
        ref: 'User',
        required: true,
    })
    assignedIDs: Array<Ref<User>>;

    @prop({
        type: Date,
        required: true,
    })
    openedAt: Date;

    @prop({
        type: String,
        required: true,
    })
    taskType: TaskType;

    @prop({
        type: String,
        default: 'Pendiente',
    })
    status: TaskStatus;

    @prop({
        type: String,
        required: true,
    })
    description: string;

    @prop({
        type: mongoose.SchemaTypes.Array,
        ref: 'User',
        required: false,
    })
    participantsIDs?: Array<Ref<User>>;

    @prop({
        ref: 'User',
        required: false,
    })
    auditor?: Ref<User>;

    @prop({
        ref: 'Activity',
        required: false,
    })
    activity?: Ref<Activity>;

    @prop({
        type: String,
        required: false,
    })
    operatorName?: string;

    @prop({
        type: mongoose.SchemaTypes.Array,
        ref: 'Image',
        required: false,
    })
    imagesIDs?: Array<Ref<Image>>;

    @prop({
        type: Number,
        required: false,
    })
    workOrderNumber?: number;

    @prop({
        type: Date,
        required: false,
    })
    closedAt?: Date;

    @prop({
        type: Boolean,
        default: false,
    })
    deleted: boolean;

    static getPopulateParameters(): IPopulateParameter[] {
        getModelForClass(Branch);
        getModelForClass(Business);
        getModelForClass(User);
        getModelForClass(Activity);
        getModelForClass(Image);

        return [
            {
                path: 'branch',
                populate: Branch.getPopulateParameters(),
            },
            {
                path: 'business',
            },
            {
                path: 'assignedIDs',
            },
            {
                path: 'participantsIDs',
            },
            {
                path: 'auditor',
            },
            {
                path: 'activity',
            },
            {
                path: 'imagesIDs',
            },
        ];
    }

    static async findUndeleted(
        this: ReturnModelType<typeof Task>,
        filter: FilterQuery<Task> = {},
    ): Promise<Task[]> {
        return await this.find({
            ...filter,
            deleted: false,
        }).populate(this.getPopulateParameters());
    }

    static async findOneUndeleted(
        this: ReturnModelType<typeof Task>,
        filter: FilterQuery<Task> = {},
    ): Promise<Task | null> {
        return await this.findOne({
            ...filter,
            deleted: false,
        }).populate(this.getPopulateParameters());
    }

    async softDelete(this: DocumentType<Task>): Promise<void> {
        this.deleted = true;
        await this.save();
    }

    async restore(this: DocumentType<Task>): Promise<void> {
        this.deleted = false;
        await this.save();
    }

    async getExpenses(this: Task): Promise<Expense[]> {
        return await ExpenseModel.findUndeleted({
            task: this,
        });
    }
}

const TaskModel = getModelForClass(Task);
export default TaskModel;
