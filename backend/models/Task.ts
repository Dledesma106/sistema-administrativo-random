import { prop, type Ref, getModelForClass, modelOptions, type ReturnModelType, type DocumentType } from '@typegoose/typegoose'
import { User } from './User'
import ExpenseModel, { type Expense } from './Expense'
import { Branch } from './Branch'
import { type TaskType, type TaskStatus } from './types'
import { Business } from './Business'
import { Activity } from './Activity'
import { Image } from './Image'
import mongoose, { type FilterQuery } from 'mongoose'
import { type IPopulateParameter } from './interfaces'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Task {
    _id: mongoose.Types.ObjectId | string

    @prop({ ref: 'Branch', required: true })
    branch: Ref<Branch>

    @prop({ ref: 'Business', required: true })
    business: Ref<Business>

    @prop({ type: mongoose.SchemaTypes.Array, ref: 'User', required: true })
    assigned: Array<Ref<User>>

    @prop({ type: Date, required: true })
    openedAt: Date

    @prop({ type: String, required: true })
    taskType: TaskType

    @prop({ type: String, default: 'Pendiente' })
    status: TaskStatus

    @prop({ type: String, required: true })
    description: string

    @prop({ type: mongoose.SchemaTypes.Array, ref: 'User', required: false })
    participants?: Array<Ref<User>>

    @prop({ ref: 'User', required: false })
    auditor?: Ref<User>

    @prop({ ref: 'Activity', required: false })
    activity?: Ref<Activity>

    @prop({ type: String, required: false })
    operatorName?: string

    @prop({ ref: 'Image', required: false })
    image?: Ref<Image>

    @prop({ type: Number, required: false })
    workOrderNumber?: number

    @prop({ type: Date, required: false })
    closedAt?: Date

    @prop({ type: Boolean, default: false })
    deleted: boolean

    static getPopulateParameters(): IPopulateParameter[] {
        getModelForClass(Branch)
        getModelForClass(Business)
        getModelForClass(User)
        getModelForClass(Image)
        getModelForClass(Activity)

        return [
            {
                path: 'branch',
                populate: Branch.getPopulateParameters()
            },
            {
                path: 'business'
            },
            {
                path: 'assigned'
            },
            {
                path: 'participants'
            },
            {
                path: 'auditor'
            },
            {
                path: 'activity'
            },
            {
                path: 'image'
            }
        ]
    }

    static async findUndeleted(this: ReturnModelType<typeof Task>, filter: FilterQuery<Task> = {}): Promise<Task[]> {
        return await this.find({ ...filter, deleted: false }).populate(this.getPopulateParameters())
    }

    static async findOneUndeleted(this: ReturnModelType<typeof Task>, filter: FilterQuery<Task> = {}): Promise<Task | null> {
        return await this.findOne({ ...filter, deleted: false }).populate(this.getPopulateParameters())
    }

    async softDelete(this: DocumentType<Task>): Promise<void> {
        this.deleted = true
        await this.save()
    }

    async restore(this: DocumentType<Task>): Promise<void> {
        this.deleted = false
        await this.save()
    }

    async getExpenses(this: Task): Promise<Expense[]> {
        return await ExpenseModel.findUndeleted({ task: this })
    }
  }

  const TaskModel = getModelForClass(Task)
  export default TaskModel
