/* eslint-disable @typescript-eslint/ban-types */
import { Role, TaskStatus, TaskType } from '@prisma/client';
import type mongoose from 'mongoose';
import { Document } from 'mongoose';

import { type Activity } from './Activity';
import type * as types from './types';

import { CityWithProvince } from '@/types';

// User fields
export interface IUser {
    _id: mongoose.Types.ObjectId | string;
    email: string;
    firstName: string;
    lastName: string;
    city?: CityWithProvince;
    fullName?: string;
    roles?: Role[];
    password?: string;
}

// User methods
export interface IUserMethods {
    comparePassword: (plaintext: string) => boolean;
    getTasks: () => Promise<ITask[]>;
    getTasksByStatus: (status: TaskStatus) => Promise<ITask[]>;
    getExpenses: () => Promise<IExpense[]>;
    getExpensesByStatus: (status: types.ExpenseStatus) => Promise<IExpense[]>;
    getActivities: () => Promise<IUserActivities>;
}

// User model, here I have to declare the static methods
export interface UserModel extends mongoose.Model<IUser, {}, IUserMethods> {
    populateParameter: () => IPopulateParameter[];
}

export interface IImage {
    _id: mongoose.Types.ObjectId | string;
    name: string;
    url: string;
}

export interface IClient {
    _id: mongoose.Types.ObjectId | string;
    name: string;
    deleted: boolean;
}

export interface IClientMethods {
    getBranches: () => Promise<IBranch[]>;
}

export interface ClientModel extends mongoose.Model<IClient, {}, IClientMethods> {}

export interface IBusiness {
    _id: mongoose.Types.ObjectId | string;
    name: string;

    deleted: boolean;
}

export interface IBusinessMethods {
    getTasks: () => Promise<ITask[]>;
}

export interface BusinessModel extends mongoose.Model<IBusiness, {}, IBusinessMethods> {}

export interface IProvince {
    _id: mongoose.Types.ObjectId | string;
    name: string;
    deleted: boolean;
}

export interface ProvinceModel extends mongoose.Model<IProvince, {}, IProvinceMethods> {}

export interface IProvinceMethods {
    getCities: () => Promise<ICity[]>;
}

export interface ICity {
    _id: mongoose.Types.ObjectId | string;
    name: string;
    provinceId: IProvince | string;
    deleted: boolean;
}

export interface ICityLean<TPopulatedPaths extends string = ''> {
    _id: mongoose.Types.ObjectId | string;
    name: string;
    province: IProvince | string;
    deleted: boolean;
    populate: <T extends string>(path: T) => ICityLean<TPopulatedPaths | T>;
    populateParameter: () => IPopulateParameter[];
    execPopulate: () => Promise<ICity & Record<TPopulatedPaths, unknown>>;
}

export interface ICityMethods {
    getProvince: () => Promise<IProvince | null>;
    getBranches: () => Promise<IBranch[]>;
}

export interface CityModel extends mongoose.Model<ICity, {}, ICityMethods> {
    populateParameter: () => IPopulateParameter[];
}

export interface IBranch {
    _id: mongoose.Types.ObjectId | string;
    number: string;
    city: ICity;
    client: IClient;
    businessesIDs: IBusiness[];
    deleted: boolean;
}

export interface IBranchMethods {
    getClient: () => Promise<IClient | null>;
    getCity: () => Promise<ICity | null>;
    getTasks: () => Promise<ITask[]>;
}

export interface BranchModel extends mongoose.Model<IBranch, {}, IBranchMethods> {
    populateParameter: () => IPopulateParameter[];
}

export interface IPreventive {
    _id: mongoose.Types.ObjectId | string;
    assignedIDs: IUser[];
    business: IBusiness;
    branch: IBranch;
    status: types.PreventiveStatus;
    frequency?: types.Frequency;
    months?: types.Month[];
    lastDoneAt?: Date;
    batteryChangedAt?: Date;
    observations?: string;
    deleted: boolean;
}

export interface IPreventiveMethods {
    getAssigned: () => Promise<
        Array<
            | (mongoose.Document<unknown, any, IUser> &
                  IUser &
                  Required<{ _id: string | mongoose.Types.ObjectId }> &
                  IUserMethods)
            | null
        >
    >;
    getBusiness: () => Promise<IBusiness | null>;
    getBranch: () => Promise<IBranch | null>;
}

export interface PreventiveModel
    extends mongoose.Model<IPreventive, Record<string, any>, IPreventiveMethods> {
    populateParameter: () => IPopulateParameter[];
}

export interface ITask extends Document {
    _id: mongoose.Types.ObjectId | string;
    branch: IBranch;
    business: IBusiness;
    assignedIDs: IUser[];
    openedAt: Date;
    taskType: TaskType;
    status: TaskStatus;
    description: string;
    participants?: IUser[];
    auditor?: IUser;
    activity?: IActivity;
    operatorName?: string;
    imagesIDs?: IImage[];
    actNumber?: number;
    closedAt?: Date;
    deleted: boolean;
}

export interface ITaskMethods {
    getBranch: () => Promise<IBranch | null>;
    getBusiness: () => Promise<IBusiness | null>;
    getAssigned: () => Promise<IUser | null>;
    getParticipants: () => Promise<
        Array<
            | (mongoose.Document<unknown, any, IUser> &
                  IUser &
                  Required<{ _id: string | mongoose.Types.ObjectId }> &
                  IUserMethods)
            | null
        >
    >;
    getActivity: () => Promise<IActivity | null>;
    getAuditor: () => Promise<IUser | null>;
    getImage: () => Promise<IImage | null>;
    getExpenses: () => Promise<IExpense[]>;
}

export interface TaskModel extends mongoose.Model<ITask, {}, ITaskMethods> {
    populateParameter: () => IPopulateParameter[];
}

export interface IExpense {
    _id: mongoose.Types.ObjectId | string;
    doneBy: IUser;
    expenseType: types.ExpenseType;
    paySource: types.PaySource;
    status: types.ExpenseStatus;
    image: IImage;
    amount: number;
    task?: ITask;
    auditor?: IUser;
    activity?: IActivity;
    deleted: boolean;
}

export interface IExpenseMethods {
    getDoneBy: () => Promise<IUser | null>;
    getImage: () => Promise<IImage | null>;
    getTask: () => Promise<ITask | null>;
    getAuditor: () => Promise<IUser | null>;
    getActivity: () => Promise<IActivity | null>;
}

export interface ExpenseModel extends mongoose.Model<IExpense, {}, IExpenseMethods> {
    populateParameter: () => IPopulateParameter[];
}

export interface IActivity {
    _id: mongoose.Types.ObjectId | string;
    name: string;
    description: string;
    startDate: Date;
    openedBy: IUser;
    participants?: IUser[];
    finishDate?: Date;
    deleted: boolean;
}

export interface IActivityMethods {
    getOpenedBy: () => Promise<IUser | null>;
    getParticipants: () => Promise<
        Array<
            | (mongoose.Document<unknown, any, IUser> &
                  IUser &
                  Required<{ _id: string | mongoose.Types.ObjectId }> &
                  IUserMethods)
            | null
        >
    >;
    getTasks: () => Promise<ITask[]>;
    getExpenses: () => Promise<IExpense[]>;
}
export interface ActivityModel extends mongoose.Model<IActivity, {}, IActivityMethods> {
    populateParameter: () => IPopulateParameter[];
}

export interface IUserActivities {
    userActivities?: Activity[];
    participantActivities?: Activity[];
}

export interface IPopulateParameter {
    path: string;
    populate?: IPopulateParameter[];
    match?: {};
    model?: string;
}
