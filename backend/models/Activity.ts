import {
    prop,
    type Ref,
    getModelForClass,
    type ReturnModelType,
    modelOptions,
    type DocumentType,
} from '@typegoose/typegoose';
import mongoose, { type FilterQuery } from 'mongoose';

import ExpenseModel, { type Expense } from './Expense';
import { type IPopulateParameter } from './interfaces';
import TaskModel, { type Task } from './Task';
import { User } from './User';

@modelOptions({
    schemaOptions: {
        timestamps: true,
    },
})
export class Activity {
    _id: mongoose.Types.ObjectId | string;

    @prop({
        type: String,
        required: true,
    })
    name: string;

    @prop({
        type: String,
        required: true,
    })
    description: string;

    @prop({
        type: Date,
        required: true,
    })
    startDate: Date;

    @prop({
        ref: 'User',
        required: true,
    })
    openedBy: Ref<User>;

    @prop({
        type: mongoose.SchemaTypes.Array,
        ref: 'User',
        required: true,
    })
    participants: Array<Ref<User>>;

    @prop({
        type: Date,
        required: false,
    })
    finishDate: Date;

    @prop({
        type: Boolean,
        default: false,
    })
    deleted: boolean;

    static getPopulateParameters(): IPopulateParameter[] {
        getModelForClass(User);

        return [
            {
                path: 'openedBy',
            },
            {
                path: 'participantsIDs',
            },
        ];
    }

    static async findUndeleted(
        this: ReturnModelType<typeof Activity>,
        filter: FilterQuery<Activity> = {},
    ): Promise<Activity[]> {
        return await this.find({
            ...filter,
            deleted: false,
        }).populate(this.getPopulateParameters());
    }

    static async findOneUndeleted(
        this: ReturnModelType<typeof Activity>,
        filter: FilterQuery<Activity> = {},
    ): Promise<Activity | null> {
        return await this.findOne({
            ...filter,
            deleted: false,
        }).populate(this.getPopulateParameters());
    }

    async softDelete(this: DocumentType<Activity>): Promise<void> {
        this.deleted = true;
        await this.save();
    }

    async restore(this: DocumentType<Activity>): Promise<void> {
        this.deleted = false;
        await this.save();
    }

    async getTasks(this: Activity): Promise<Task[]> {
        return await TaskModel.findUndeleted({
            activity: this,
        });
    }

    async getExpenses(this: Activity): Promise<Expense[]> {
        return await ExpenseModel.findUndeleted({
            activity: this,
        });
    }
}

const ActivityModel = getModelForClass(Activity, {
    schemaOptions: {
        collection: 'activities',
    },
});
export default ActivityModel;
