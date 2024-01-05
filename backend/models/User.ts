import { Role, TaskStatus } from '@prisma/client';
import {
    prop,
    type Ref,
    getModelForClass,
    pre,
    modelOptions,
    type ReturnModelType,
    type DocumentType,
} from '@typegoose/typegoose';
import { compareSync, hashSync } from 'bcryptjs';
import mongoose, { type FilterQuery } from 'mongoose';

import ActivityModel, { type Activity } from './Activity';
import { City } from './City';
import ExpenseModel, { type Expense } from './Expense';
import { type IPopulateParameter, type IUserActivities } from './interfaces';
import TaskModel, { Task } from './Task';
import { type ExpenseStatus } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
@pre<User>('save', function (next: any) {
    if (this.isModified('firstName') || this.isModified('lastName')) {
        this.fullName = `${this.firstName} ${this.lastName}`;
    }
    if (this.isModified('password') && this.password !== '') {
        this.password = hashSync(this.password, 10);
    }
    next();
})
@modelOptions({
    schemaOptions: {
        timestamps: true,
    },
})
export class User {
    _id: mongoose.Types.ObjectId | string;

    @prop({
        type: String,
        required: true,
    })
    firstName: string;

    @prop({
        type: String,
        required: true,
    })
    lastName: string;

    @prop({
        type: String,
        required: true,
    })
    fullName: string;

    @prop({
        type: String,
        required: true,
        select: false,
    })
    password: string;

    @prop({
        type: String,
        required: true,
        unique: true,
    })
    email: string;

    @prop({
        ref: 'City',
        required: false,
    })
    city: Ref<City>;

    @prop({
        type: mongoose.SchemaTypes.Array,
        required: true,
    })
    roles: Role[];

    @prop({
        type: String,
        required: false,
        select: false,
    })
    privateKey: string;

    @prop({
        type: Boolean,
        default: false,
    })
    deleted: boolean;

    static getPopulateParameters(): IPopulateParameter[] {
        getModelForClass(City);

        return [
            {
                path: 'city',
                populate: [{ path: 'provinceId' }],
            },
        ];
    }

    static async findUndeleted(
        this: ReturnModelType<typeof User>,
        filter: FilterQuery<User> = {},
    ): Promise<User[]> {
        return await this.find({
            ...filter,
            deleted: false,
        }).populate(this.getPopulateParameters());
    }

    static async findOneUndeleted(
        this: ReturnModelType<typeof User>,
        filter: FilterQuery<User> = {},
    ): Promise<User | null> {
        return await this.findOne({
            ...filter,
            deleted: false,
        }).populate(this.getPopulateParameters());
    }

    async softDelete(this: DocumentType<User>): Promise<void> {
        this.deleted = true;
        await this.save();
    }

    async restore(this: DocumentType<User>): Promise<void> {
        this.deleted = false;
        await this.save();
    }

    comparePassword(this: User, plaintext: string): boolean {
        if (!this.password) {
            throw new Error('password not selected');
        }

        try {
            return compareSync(plaintext, this.password);
        } catch (error) {
            return false;
        }
    }

    async setPrivateKey(this: DocumentType<User>): Promise<void> {
        await this.save();
    }

    async removePrivateKey(this: DocumentType<User>): Promise<void> {
        this.privateKey = '';
        await this.save();
    }

    async getTasks(this: User): Promise<Task[]> {
        const allTasks = await TaskModel.find().populate(Task.getPopulateParameters());

        const tasks = allTasks.filter((task) =>
            task.assignedIDs.some((user) => (user as User).fullName === this.fullName),
        );

        return tasks;
    }

    async getTasksByStatus(this: User, status: TaskStatus): Promise<Task[]> {
        return await TaskModel.findUndeleted({
            assignedIDs: this,
            status,
        });
    }

    async getExpenses(this: User): Promise<Expense[]> {
        return await ExpenseModel.findUndeleted({
            doneBy: this,
        });
    }

    async getExpensesByStatus(this: User, status: ExpenseStatus): Promise<Expense[]> {
        return await ExpenseModel.findUndeleted({
            doneBy: this,
            status,
        });
    }

    async getActivities(this: User): Promise<IUserActivities> {
        const activities: Activity[] = await ActivityModel.findUndeleted();
        const userActivities = activities.filter(
            (activity) => activity.openedBy === this,
        );
        const participantActivities = activities.filter(
            (activity) => activity.participants?.includes(this._id),
        );
        return {
            userActivities,
            participantActivities,
        };
    }
}

const UserModel = getModelForClass(User, {
    schemaOptions: {
        collection: 'users',
    },
});
export default UserModel;
