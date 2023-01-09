//Interfaces for every model
import mongoose from "mongoose";
import * as types from './types'

//User fields
export interface IUser {
  _id: mongoose.Schema.Types.ObjectId | string;
  email: string;
  firstName: string;
  lastName: string;
  city?:ICity;
  fullName?: string;
  roles?:types.Role[]
  password?:string;
}
//User methods
export interface IUserMethods{

  comparePassword(plaintext:string):boolean
  getServices():Promise<IService[]>
  getServicesByStatus(status:types.ServiceStatus):Promise<IService[]>
  getExpenses():Promise<IExpense[]>
  getExpensesByStatus(status:types.ExpenseStatus):Promise<IExpense[]>
  getActivities():Promise<IUserActivities>
}
//User model, here I have to declare the static methods
export interface UserModel extends mongoose.Model<IUser, {},IUserMethods>{
  populateParamer():IPopulateParameter[]
}

export interface IImage{
  _id:mongoose.Schema.Types.ObjectId | string,
  name:string,
  url:string
}

export interface IImageMethods{
}

export interface ImageModel extends mongoose.Model<IImage,IImageMethods>{
}

export interface IClient {
  _id:mongoose.Schema.Types.ObjectId | string,
  name:string
}

export interface IClientMethods{
  getBranches():Promise<IBranch[]>
}

export interface ClientModel extends mongoose.Model<IClient, {}, IClientMethods>{
}

export interface IBusiness{
  _id:mongoose.Schema.Types.ObjectId | string,
  name:string
}

export interface IBusinessMethods{
  getServices():Promise<IService[]>
}

export interface BusinessModel extends mongoose.Model<IBusiness, {}, IBusinessMethods>{
}

export interface IProvince{
  _id:mongoose.Schema.Types.ObjectId | string,
  name:string
}

export interface ProvinceModel extends mongoose.Model<IProvince, {}, IProvinceMethods>{
}

export interface IProvinceMethods{
  getCities():Promise<ICity[]>
}

export interface ICity{
  _id:mongoose.Schema.Types.ObjectId | string,
  name:string,
  province:IProvince
}

export interface ICityMethods{
  getProvince():Promise<IProvince | null>
  getBranches():Promise<IBranch[]>
}

export interface CityModel extends mongoose.Model<ICity, {}, ICityMethods>{
  populateParameter():IPopulateParameter[]
}

export interface IBranch{
  _id:mongoose.Schema.Types.ObjectId | string,
  number:number,
  city:ICity,
  client:IClient
}

export interface IBranchMethods{
  getClient():Promise<IClient | null>
  getCity():Promise<ICity | null>
  getServices():Promise<IService[]>
}

export interface BranchModel extends mongoose.Model<IBranch, {}, IBranchMethods>{
  populateParameter():IPopulateParameter[],
}

export interface IPreventive {
  _id:mongoose.Schema.Types.ObjectId | string,
  assigned:IUser[],
  business:IBusiness,
  branch:IBranch,
  frequency?:types.Month,
  months?:types.Month[],
  lastDoneAt?:Date,
  batteryChangedAt?:Date
  observations?:string
}

export interface IPreventiveMethods{
  getAssigned():Promise<((mongoose.Document<unknown, any, IUser> & IUser & Required<{ _id: string | mongoose.Schema.Types.ObjectId; }> & IUserMethods) | null)[]>
  getBusiness():Promise<IBusiness | null>
  getBranch():Promise<IBranch | null>
}

export interface PreventiveModel extends mongoose.Model<IPreventive, {}, IPreventiveMethods>{
  populateParameter():IPopulateParameter[]
}

export interface IService {
  _id:mongoose.Schema.Types.ObjectId | string,
  branch:IBranch,
  business:IBusiness,
  assigned?:IUser,
  openedAt:Date,
  serviceType:types.ServiceType,
  status:types.ServiceStatus,
  participants?:IUser[],
  auditor?:IUser,
  activity?:IActivity,
  operatorName?:string,
  image?:IImage,
  workOrderNumber?:number,
  closedAt?:Date,
}

export interface IServiceMethods{
  getBranch():Promise<IBranch | null>
  getBusiness():Promise<IBusiness | null>
  getAssigned():Promise<IUser | null>
  getParticipants():Promise<((mongoose.Document<unknown, any, IUser> & IUser & Required<{ _id: string | mongoose.Schema.Types.ObjectId; }> & IUserMethods) | null)[]>
  getActivity():Promise<IActivity | null>
  getAuditor():Promise<IUser | null>
  getImage():Promise<IImage | null>
  getExpenses():Promise<IExpense[]>
}

export interface ServiceModel extends mongoose.Model<IService, {}, IServiceMethods>{
  populateParameter():IPopulateParameter[]
}

export interface IExpense {
  _id:mongoose.Schema.Types.ObjectId | string,
  doneBy:IUser,
  expenseType:types.ExpenseType,
  paySource:types.PaySource,
  status:types.ExpenseStatus,
  image:IImage,
  amount:Number,
  service?:IService,
  auditor?:IUser,
  activity?:IActivity
}

export interface IExpenseMethods{
  getDoneBy():Promise<IUser | null>
  getImage():Promise<IImage | null>
  getService():Promise<IService | null>
  getAuditor():Promise<IUser | null>
  getActivity():Promise<IActivity | null>
}

export interface ExpenseModel extends mongoose.Model<IExpense, {}, IExpenseMethods>{
  populateParameter():IPopulateParameter[]
}

export interface IActivity{
  _id:mongoose.Schema.Types.ObjectId | string,
  name:string,
  description:string,
  startDate:Date,
  openedBy:IUser,
  participants?:IUser[],
  finishDate?:Date,
}

export interface IActivityMethods{
  getOpenedBy():Promise<IUser | null>
  getParticipants():Promise<((mongoose.Document<unknown, any, IUser> & IUser & Required<{ _id: string | mongoose.Schema.Types.ObjectId; }> & IUserMethods) | null)[]>
  getServices():Promise<IService[]>
  getExpenses():Promise<IExpense[]>
}
export interface ActivityModel extends mongoose.Model<IActivity, {}, IActivityMethods>{
  populateParameter():IPopulateParameter[]
}

export interface IUserActivities{
  userActivities?:IActivity[];
  participantActivities?:IActivity[]
}

export interface IPopulateParameter {
  path:string,
  populate?:IPopulateParameter[],
  model?:string
}