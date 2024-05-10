import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    Date: any;
    DateTime: any;
    JSON: any;
};

export type Branch = {
    __typename?: 'Branch';
    businesses: Array<Business>;
    city: City;
    client: Client;
    id: Scalars['ID'];
    number: Scalars['Int'];
};

export type BranchCrudResult = {
    __typename?: 'BranchCrudResult';
    branch: Maybe<Branch>;
    message: Maybe<Scalars['String']>;
    success: Scalars['Boolean'];
};

export type BranchInput = {
    businessesIds: Array<Scalars['String']>;
    cityId: Scalars['String'];
    clientId: Scalars['String'];
    number: Scalars['Int'];
};

export type Business = {
    __typename?: 'Business';
    id: Scalars['ID'];
    name: Scalars['String'];
};

export type City = {
    __typename?: 'City';
    id: Scalars['ID'];
    name: Scalars['String'];
    province: Province;
};

export type CityCrudResult = {
    __typename?: 'CityCrudResult';
    city: Maybe<City>;
    message: Maybe<Scalars['String']>;
    success: Scalars['Boolean'];
};

export type CityInput = {
    name: Scalars['String'];
    provinceId: Scalars['String'];
};

export type Client = {
    __typename?: 'Client';
    id: Scalars['ID'];
    name: Scalars['String'];
};

export type Expense = {
    __typename?: 'Expense';
    amount: Scalars['Int'];
    auditor: Maybe<User>;
    createdAt: Scalars['DateTime'];
    doneBy: User;
    expenseType: ExpenseType;
    id: Scalars['ID'];
    image: Image;
    paySource: ExpensePaySource;
    status: ExpenseStatus;
};

export const ExpensePaySource = {
    Reintegro: 'Reintegro',
    Tarjeta: 'Tarjeta',
} as const;

export type ExpensePaySource = (typeof ExpensePaySource)[keyof typeof ExpensePaySource];
export const ExpenseStatus = {
    Aprobado: 'Aprobado',
    Enviado: 'Enviado',
    Rechazado: 'Rechazado',
} as const;

export type ExpenseStatus = (typeof ExpenseStatus)[keyof typeof ExpenseStatus];
export const ExpenseType = {
    Combustible: 'Combustible',
    Comida: 'Comida',
    Herramienta: 'Herramienta',
    Hospedaje: 'Hospedaje',
    Insumos: 'Insumos',
} as const;

export type ExpenseType = (typeof ExpenseType)[keyof typeof ExpenseType];
export type Image = {
    __typename?: 'Image';
    id: Scalars['ID'];
    key: Scalars['String'];
    name: Scalars['String'];
    url: Scalars['String'];
    urlExpire: Maybe<Scalars['DateTime']>;
};

export type LoginUserResult = {
    __typename?: 'LoginUserResult';
    accessToken: Maybe<Scalars['String']>;
    expiresAt: Maybe<Scalars['DateTime']>;
    message: Maybe<Scalars['String']>;
    success: Scalars['Boolean'];
    user: Maybe<User>;
};

export type Mutation = {
    __typename?: 'Mutation';
    createBranch: BranchCrudResult;
    createCity: CityCrudResult;
    createPreventive: PreventiveCrudResult;
    createTask: TaskCrudResult;
    createUser: UserCrudPhotosRef;
    deleteBranch: BranchCrudResult;
    deleteCity: CityCrudResult;
    deletePreventive: PreventiveCrudResult;
    deleteTask: TaskCrudResult;
    login: LoginUserResult;
    sendNewUserRandomPassword: UserCrudPhotosRef;
    updateBranch: BranchCrudResult;
    updateCity: CityCrudResult;
    updateMyAssignedTask: TaskCrudResult;
    updatePreventive: PreventiveCrudResult;
    updateTask: TaskCrudResult;
    updateTaskExpenseStatus: TaskCrudResult;
    updateUser: UserCrudPhotosRef;
};

export type MutationCreateBranchArgs = {
    input: BranchInput;
};

export type MutationCreateCityArgs = {
    input: CityInput;
};

export type MutationCreatePreventiveArgs = {
    data: PreventiveInput;
};

export type MutationCreateTaskArgs = {
    input: TaskInput;
};

export type MutationCreateUserArgs = {
    input: UserInput;
};

export type MutationDeleteBranchArgs = {
    id: Scalars['String'];
};

export type MutationDeleteCityArgs = {
    id: Scalars['String'];
};

export type MutationDeletePreventiveArgs = {
    id: Scalars['String'];
};

export type MutationDeleteTaskArgs = {
    id: Scalars['String'];
};

export type MutationLoginArgs = {
    email: Scalars['String'];
    password: Scalars['String'];
};

export type MutationSendNewUserRandomPasswordArgs = {
    id: Scalars['String'];
};

export type MutationUpdateBranchArgs = {
    id: Scalars['String'];
    input: BranchInput;
};

export type MutationUpdateCityArgs = {
    id: Scalars['String'];
    input: CityInput;
};

export type MutationUpdateMyAssignedTaskArgs = {
    id: Scalars['String'];
    imageIdToDelete: InputMaybe<Scalars['String']>;
    status: InputMaybe<TaskStatus>;
    workOrderNumber: InputMaybe<Scalars['Int']>;
};

export type MutationUpdatePreventiveArgs = {
    data: PreventiveInput;
    id: Scalars['String'];
};

export type MutationUpdateTaskArgs = {
    id: Scalars['String'];
    input: TaskInput;
};

export type MutationUpdateTaskExpenseStatusArgs = {
    expenseId: Scalars['String'];
    status: ExpenseStatus;
};

export type MutationUpdateUserArgs = {
    id: Scalars['String'];
    input: UserInput;
};

export type Preventive = {
    __typename?: 'Preventive';
    assigned: Array<User>;
    assignedIDs: Array<Scalars['String']>;
    batteryChangedAt: Maybe<Scalars['DateTime']>;
    branch: Branch;
    business: Business;
    createdAt: Scalars['DateTime'];
    deleted: Scalars['Boolean'];
    frequency: Scalars['Int'];
    id: Scalars['ID'];
    lastDoneAt: Maybe<Scalars['DateTime']>;
    months: Array<Scalars['String']>;
    observations: Maybe<Scalars['String']>;
    status: PreventiveStatus;
    updatedAt: Scalars['DateTime'];
};

export type PreventiveCrudResult = {
    __typename?: 'PreventiveCrudResult';
    message: Maybe<Scalars['String']>;
    preventive: Maybe<Preventive>;
    success: Scalars['Boolean'];
};

export type PreventiveInput = {
    assignedIDs: Array<Scalars['String']>;
    branchId: Scalars['String'];
    businessId: Scalars['String'];
    frequency: Scalars['Int'];
    months: Array<Scalars['String']>;
    observations: InputMaybe<Scalars['String']>;
    status: PreventiveStatus;
};

export const PreventiveStatus = {
    AlDia: 'AlDia',
    Pendiente: 'Pendiente',
} as const;

export type PreventiveStatus = (typeof PreventiveStatus)[keyof typeof PreventiveStatus];
export type Province = {
    __typename?: 'Province';
    id: Scalars['ID'];
    name: Scalars['String'];
};

export type Query = {
    __typename?: 'Query';
    branches: Array<Branch>;
    branchesOfClient: Array<Branch>;
    businesses: Array<Business>;
    cities: Array<City>;
    images: Array<Image>;
    myAssignedTaskById: Maybe<Task>;
    myAssignedTaskExpenseById: Maybe<Expense>;
    myAssignedTasks: Array<Task>;
    preventives: Array<Preventive>;
    provinces: Array<Province>;
    taskById: Maybe<Task>;
    tasks: Array<Task>;
    users: Array<User>;
};

export type QueryBranchesOfClientArgs = {
    businessId: InputMaybe<Scalars['String']>;
    cityId: InputMaybe<Scalars['String']>;
    clientId: Scalars['String'];
    provinceId: InputMaybe<Scalars['String']>;
};

export type QueryBusinessesArgs = {
    branch: InputMaybe<Scalars['String']>;
};

export type QueryMyAssignedTaskByIdArgs = {
    id: Scalars['String'];
};

export type QueryMyAssignedTaskExpenseByIdArgs = {
    id: Scalars['String'];
};

export type QueryTaskByIdArgs = {
    id: Scalars['String'];
};

export type QueryTasksArgs = {
    assigneed: InputMaybe<Array<Scalars['String']>>;
    business: InputMaybe<Scalars['String']>;
    city: InputMaybe<Scalars['String']>;
    client: InputMaybe<Scalars['String']>;
    status: InputMaybe<TaskStatus>;
    taskType: InputMaybe<TaskType>;
};

export const Role = {
    AdministrativoContable: 'AdministrativoContable',
    AdministrativoTecnico: 'AdministrativoTecnico',
    Auditor: 'Auditor',
    Tecnico: 'Tecnico',
} as const;

export type Role = (typeof Role)[keyof typeof Role];
export type Task = {
    __typename?: 'Task';
    assigned: Array<User>;
    auditor: Maybe<User>;
    branch: Branch;
    business: Business;
    closedAt: Maybe<Scalars['DateTime']>;
    createdAt: Scalars['DateTime'];
    description: Scalars['String'];
    expenses: Array<Expense>;
    id: Scalars['ID'];
    images: Array<Image>;
    imagesIDs: Array<Scalars['String']>;
    metadata: Scalars['JSON'];
    status: TaskStatus;
    taskType: TaskType;
    workOrderNumber: Maybe<Scalars['Int']>;
};

export type TaskCrudResult = {
    __typename?: 'TaskCrudResult';
    message: Maybe<Scalars['String']>;
    success: Scalars['Boolean'];
    task: Maybe<Task>;
};

export type TaskInput = {
    assigned: Array<Scalars['String']>;
    auditor: InputMaybe<Scalars['String']>;
    branch: Scalars['String'];
    business: Scalars['String'];
    description: Scalars['String'];
    metadata: Scalars['JSON'];
    status: TaskStatus;
    taskType: TaskType;
    workOrderNumber: InputMaybe<Scalars['Int']>;
};

export const TaskStatus = {
    Aprobada: 'Aprobada',
    Finalizada: 'Finalizada',
    Pendiente: 'Pendiente',
    SinAsignar: 'SinAsignar',
} as const;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];
export const TaskType = {
    Actualizacion: 'Actualizacion',
    Correctivo: 'Correctivo',
    Desmonte: 'Desmonte',
    Instalacion: 'Instalacion',
    Preventivo: 'Preventivo',
} as const;

export type TaskType = (typeof TaskType)[keyof typeof TaskType];
export type User = {
    __typename?: 'User';
    city: Maybe<City>;
    email: Scalars['String'];
    firstName: Scalars['String'];
    fullName: Scalars['String'];
    id: Scalars['ID'];
    lastName: Scalars['String'];
    roles: Array<Role>;
};

export type UserCrudPhotosRef = {
    __typename?: 'UserCrudPhotosRef';
    message: Maybe<Scalars['String']>;
    success: Scalars['Boolean'];
    user: Maybe<User>;
};

export type UserInput = {
    city: Scalars['String'];
    email: Scalars['String'];
    firstName: Scalars['String'];
    lastName: Scalars['String'];
    roles: Array<Role>;
};

export type LoginMutationVariables = Exact<{
    email: Scalars['String'];
    password: Scalars['String'];
}>;

export type LoginMutation = {
    __typename?: 'Mutation';
    login: {
        __typename?: 'LoginUserResult';
        success: boolean;
        message: string | null;
        user: {
            __typename?: 'User';
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            fullName: string;
            roles: Array<Role>;
        } | null;
    };
};

export type CreateBranchMutationVariables = Exact<{
    input: BranchInput;
}>;

export type CreateBranchMutation = {
    __typename?: 'Mutation';
    createBranch: {
        __typename?: 'BranchCrudResult';
        success: boolean;
        message: string | null;
        branch: { __typename?: 'Branch'; id: string } | null;
    };
};

export type UpdateBranchMutationVariables = Exact<{
    id: Scalars['String'];
    input: BranchInput;
}>;

export type UpdateBranchMutation = {
    __typename?: 'Mutation';
    updateBranch: {
        __typename?: 'BranchCrudResult';
        success: boolean;
        message: string | null;
        branch: { __typename?: 'Branch'; id: string } | null;
    };
};

export type DeleteBranchMutationVariables = Exact<{
    id: Scalars['String'];
}>;

export type DeleteBranchMutation = {
    __typename?: 'Mutation';
    deleteBranch: {
        __typename?: 'BranchCrudResult';
        success: boolean;
        message: string | null;
        branch: { __typename?: 'Branch'; id: string } | null;
    };
};

export type CitiesQueryVariables = Exact<{ [key: string]: never }>;

export type CitiesQuery = {
    __typename?: 'Query';
    cities: Array<{
        __typename?: 'City';
        id: string;
        name: string;
        province: { __typename?: 'Province'; id: string; name: string };
    }>;
};

export type CreateCityMutationVariables = Exact<{
    input: CityInput;
}>;

export type CreateCityMutation = {
    __typename?: 'Mutation';
    createCity: {
        __typename?: 'CityCrudResult';
        success: boolean;
        message: string | null;
        city: { __typename?: 'City'; id: string } | null;
    };
};

export type UpdateCityMutationVariables = Exact<{
    id: Scalars['String'];
    input: CityInput;
}>;

export type UpdateCityMutation = {
    __typename?: 'Mutation';
    updateCity: {
        __typename?: 'CityCrudResult';
        success: boolean;
        message: string | null;
        city: { __typename?: 'City'; id: string } | null;
    };
};

export type DeleteCityMutationVariables = Exact<{
    id: Scalars['String'];
}>;

export type DeleteCityMutation = {
    __typename?: 'Mutation';
    deleteCity: {
        __typename?: 'CityCrudResult';
        success: boolean;
        message: string | null;
        city: { __typename?: 'City'; id: string } | null;
    };
};

export type CreatePreventiveMutationVariables = Exact<{
    data: PreventiveInput;
}>;

export type CreatePreventiveMutation = {
    __typename?: 'Mutation';
    createPreventive: {
        __typename?: 'PreventiveCrudResult';
        success: boolean;
        message: string | null;
        preventive: { __typename?: 'Preventive'; id: string } | null;
    };
};

export type UpdatePreventiveMutationVariables = Exact<{
    id: Scalars['String'];
    data: PreventiveInput;
}>;

export type UpdatePreventiveMutation = {
    __typename?: 'Mutation';
    updatePreventive: {
        __typename?: 'PreventiveCrudResult';
        success: boolean;
        message: string | null;
        preventive: { __typename?: 'Preventive'; id: string } | null;
    };
};

export type TasksQueryVariables = Exact<{
    assigneed: InputMaybe<Array<Scalars['String']>>;
    business: InputMaybe<Scalars['String']>;
    city: InputMaybe<Scalars['String']>;
    status: InputMaybe<TaskStatus>;
    client: InputMaybe<Scalars['String']>;
    taskType: InputMaybe<TaskType>;
}>;

export type TasksQuery = {
    __typename?: 'Query';
    tasks: Array<{
        __typename?: 'Task';
        id: string;
        createdAt: any;
        closedAt: any | null;
        description: string;
        taskType: TaskType;
        status: TaskStatus;
        business: { __typename?: 'Business'; id: string; name: string };
        branch: {
            __typename?: 'Branch';
            id: string;
            number: number;
            city: {
                __typename?: 'City';
                id: string;
                name: string;
                province: { __typename?: 'Province'; id: string; name: string };
            };
            client: { __typename?: 'Client'; id: string; name: string };
        };
        assigned: Array<{ __typename?: 'User'; id: string; fullName: string }>;
        expenses: Array<{ __typename?: 'Expense'; amount: number }>;
    }>;
};

export type TaskByIdQueryVariables = Exact<{
    id: Scalars['String'];
}>;

export type TaskByIdQuery = {
    __typename?: 'Query';
    taskById: {
        __typename?: 'Task';
        id: string;
        createdAt: any;
        closedAt: any | null;
        description: string;
        taskType: TaskType;
        status: TaskStatus;
        metadata: any;
        business: { __typename?: 'Business'; id: string; name: string };
        images: Array<{ __typename?: 'Image'; id: string; url: string }>;
        branch: {
            __typename?: 'Branch';
            number: number;
            city: {
                __typename?: 'City';
                name: string;
                province: { __typename?: 'Province'; name: string };
            };
            client: { __typename?: 'Client'; name: string };
        };
        assigned: Array<{
            __typename?: 'User';
            id: string;
            firstName: string;
            lastName: string;
            fullName: string;
            email: string;
        }>;
        expenses: Array<{
            __typename?: 'Expense';
            id: string;
            amount: number;
            paySource: ExpensePaySource;
            createdAt: any;
            status: ExpenseStatus;
            image: {
                __typename?: 'Image';
                id: string;
                url: string;
                urlExpire: any | null;
                key: string;
            };
            doneBy: { __typename?: 'User'; id: string; email: string; fullName: string };
        }>;
    } | null;
};

export type CreateTaskMutationVariables = Exact<{
    input: TaskInput;
}>;

export type CreateTaskMutation = {
    __typename?: 'Mutation';
    createTask: {
        __typename?: 'TaskCrudResult';
        success: boolean;
        message: string | null;
        task: { __typename?: 'Task'; id: string } | null;
    };
};

export type UpdateTaskMutationVariables = Exact<{
    id: Scalars['String'];
    input: TaskInput;
}>;

export type UpdateTaskMutation = {
    __typename?: 'Mutation';
    updateTask: {
        __typename?: 'TaskCrudResult';
        success: boolean;
        message: string | null;
        task: { __typename?: 'Task'; id: string } | null;
    };
};

export type DeleteTaskMutationVariables = Exact<{
    id: Scalars['String'];
}>;

export type DeleteTaskMutation = {
    __typename?: 'Mutation';
    deleteTask: {
        __typename?: 'TaskCrudResult';
        success: boolean;
        message: string | null;
        task: { __typename?: 'Task'; id: string } | null;
    };
};

export type UpdateTaskExpenseStatusMutationVariables = Exact<{
    expenseId: Scalars['String'];
    status: ExpenseStatus;
}>;

export type UpdateTaskExpenseStatusMutation = {
    __typename?: 'Mutation';
    updateTaskExpenseStatus: {
        __typename?: 'TaskCrudResult';
        success: boolean;
        task: {
            __typename?: 'Task';
            id: string;
            expenses: Array<{
                __typename?: 'Expense';
                id: string;
                status: ExpenseStatus;
            }>;
        } | null;
    };
};

export type CreateUserMutationVariables = Exact<{
    input: UserInput;
}>;

export type CreateUserMutation = {
    __typename?: 'Mutation';
    createUser: {
        __typename?: 'UserCrudPhotosRef';
        success: boolean;
        message: string | null;
        user: { __typename?: 'User'; id: string } | null;
    };
};

export type UpdateUserMutationVariables = Exact<{
    id: Scalars['String'];
    input: UserInput;
}>;

export type UpdateUserMutation = {
    __typename?: 'Mutation';
    updateUser: {
        __typename?: 'UserCrudPhotosRef';
        success: boolean;
        message: string | null;
        user: { __typename?: 'User'; id: string } | null;
    };
};

export type SendNewUserRandomPasswordMutationVariables = Exact<{
    id: Scalars['String'];
}>;

export type SendNewUserRandomPasswordMutation = {
    __typename?: 'Mutation';
    sendNewUserRandomPassword: {
        __typename?: 'UserCrudPhotosRef';
        success: boolean;
        message: string | null;
        user: { __typename?: 'User'; id: string } | null;
    };
};

export type BranchesOfClientQueryVariables = Exact<{
    clientId: Scalars['String'];
    cityId: InputMaybe<Scalars['String']>;
    businessId: InputMaybe<Scalars['String']>;
    provinceId: InputMaybe<Scalars['String']>;
}>;

export type BranchesOfClientQuery = {
    __typename?: 'Query';
    branchesOfClient: Array<{
        __typename?: 'Branch';
        id: string;
        number: number;
        client: { __typename?: 'Client'; id: string; name: string };
        city: {
            __typename?: 'City';
            id: string;
            name: string;
            province: { __typename?: 'Province'; id: string; name: string };
        };
        businesses: Array<{ __typename?: 'Business'; id: string; name: string }>;
    }>;
};

export type PreventivesTableQueryVariables = Exact<{ [key: string]: never }>;

export type PreventivesTableQuery = {
    __typename?: 'Query';
    preventives: Array<{
        __typename?: 'Preventive';
        id: string;
        frequency: number;
        months: Array<string>;
        observations: string | null;
        lastDoneAt: any | null;
        status: PreventiveStatus;
        batteryChangedAt: any | null;
        business: { __typename?: 'Business'; id: string; name: string };
        assigned: Array<{ __typename?: 'User'; id: string; fullName: string }>;
        branch: {
            __typename?: 'Branch';
            id: string;
            number: number;
            client: { __typename?: 'Client'; id: string; name: string };
            city: {
                __typename?: 'City';
                name: string;
                province: { __typename?: 'Province'; id: string };
            };
        };
    }>;
};

export type DeletePreventiveMutationVariables = Exact<{
    id: Scalars['String'];
}>;

export type DeletePreventiveMutation = {
    __typename?: 'Mutation';
    deletePreventive: {
        __typename?: 'PreventiveCrudResult';
        success: boolean;
        message: string | null;
        preventive: { __typename?: 'Preventive'; id: string } | null;
    };
};

export const LoginDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'login' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'email' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'String' },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'password' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'String' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'login' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'email' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'email' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'password' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'password' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'success' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'message' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'user' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'email' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'firstName',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'lastName' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'fullName' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'roles' },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const CreateBranchDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'createBranch' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'input' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'BranchInput' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createBranch' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'input' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'input' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'branch' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'success' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'message' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<CreateBranchMutation, CreateBranchMutationVariables>;
export const UpdateBranchDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'updateBranch' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'String' },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'input' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'BranchInput' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updateBranch' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'id' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'id' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'input' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'input' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'branch' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'success' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'message' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<UpdateBranchMutation, UpdateBranchMutationVariables>;
export const DeleteBranchDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'deleteBranch' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'String' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'deleteBranch' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'id' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'id' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'branch' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'success' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'message' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<DeleteBranchMutation, DeleteBranchMutationVariables>;
export const CitiesDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'cities' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'cities' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'province' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'name' },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<CitiesQuery, CitiesQueryVariables>;
export const CreateCityDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'createCity' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'input' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'CityInput' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createCity' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'input' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'input' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'city' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'success' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'message' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<CreateCityMutation, CreateCityMutationVariables>;
export const UpdateCityDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'updateCity' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'String' },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'input' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'CityInput' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updateCity' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'id' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'id' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'input' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'input' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'city' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'success' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'message' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<UpdateCityMutation, UpdateCityMutationVariables>;
export const DeleteCityDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'deleteCity' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'String' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'deleteCity' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'id' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'id' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'city' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'success' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'message' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<DeleteCityMutation, DeleteCityMutationVariables>;
export const CreatePreventiveDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'createPreventive' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'data' } },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'PreventiveInput' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createPreventive' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'data' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'data' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'success' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'message' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'preventive' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<CreatePreventiveMutation, CreatePreventiveMutationVariables>;
export const UpdatePreventiveDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'updatePreventive' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'String' },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'data' } },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'PreventiveInput' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updatePreventive' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'id' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'id' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'data' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'data' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'success' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'message' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'preventive' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<UpdatePreventiveMutation, UpdatePreventiveMutationVariables>;
export const TasksDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'tasks' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'assigneed' },
                    },
                    type: {
                        kind: 'ListType',
                        type: {
                            kind: 'NonNullType',
                            type: {
                                kind: 'NamedType',
                                name: { kind: 'Name', value: 'String' },
                            },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'business' },
                    },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'city' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'status' },
                    },
                    type: {
                        kind: 'NamedType',
                        name: { kind: 'Name', value: 'TaskStatus' },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'client' },
                    },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'taskType' },
                    },
                    type: {
                        kind: 'NamedType',
                        name: { kind: 'Name', value: 'TaskType' },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'tasks' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'assigneed' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'assigneed' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'business' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'business' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'city' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'city' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'status' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'status' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'client' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'client' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'taskType' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'taskType' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'createdAt' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'closedAt' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'description' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'business' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'name' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'branch' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'number' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'city' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'id',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'name',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'province',
                                                            },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'id',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'name',
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'client' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'id',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'name',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'assigned' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'fullName' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'expenses' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'amount' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'taskType' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'status' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<TasksQuery, TasksQueryVariables>;
export const TaskByIdDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'taskById' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'String' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'taskById' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'id' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'id' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'createdAt' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'closedAt' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'description' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'business' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'name' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'images' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'url' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'branch' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'number' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'city' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'name',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'province',
                                                            },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'name',
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'client' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'name',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'assigned' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'firstName',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'lastName' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'fullName' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'email' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'expenses' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'amount' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'paySource',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'createdAt',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'image' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'id',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'url',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'urlExpire',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'key',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'status' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'doneBy' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'id',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'email',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'fullName',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'taskType' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'status' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'metadata' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<TaskByIdQuery, TaskByIdQueryVariables>;
export const CreateTaskDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'createTask' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'input' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'TaskInput' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createTask' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'input' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'input' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'task' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'success' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'message' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<CreateTaskMutation, CreateTaskMutationVariables>;
export const UpdateTaskDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'updateTask' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'String' },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'input' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'TaskInput' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updateTask' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'id' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'id' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'input' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'input' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'task' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'success' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'message' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<UpdateTaskMutation, UpdateTaskMutationVariables>;
export const DeleteTaskDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'deleteTask' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'String' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'deleteTask' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'id' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'id' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'task' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'success' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'message' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<DeleteTaskMutation, DeleteTaskMutationVariables>;
export const UpdateTaskExpenseStatusDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'updateTaskExpenseStatus' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'expenseId' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'String' },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'status' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'ExpenseStatus' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updateTaskExpenseStatus' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'expenseId' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'expenseId' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'status' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'status' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'task' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'expenses' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'id',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'status',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'success' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    UpdateTaskExpenseStatusMutation,
    UpdateTaskExpenseStatusMutationVariables
>;
export const CreateUserDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'createUser' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'input' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'UserInput' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createUser' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'input' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'input' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'user' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'success' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'message' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const UpdateUserDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'updateUser' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'String' },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'input' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'UserInput' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updateUser' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'id' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'id' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'input' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'input' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'user' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'success' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'message' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const SendNewUserRandomPasswordDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'sendNewUserRandomPassword' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'String' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'sendNewUserRandomPassword' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'id' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'id' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'user' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'success' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'message' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    SendNewUserRandomPasswordMutation,
    SendNewUserRandomPasswordMutationVariables
>;
export const BranchesOfClientDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'branchesOfClient' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'clientId' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'String' },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'cityId' },
                    },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'businessId' },
                    },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'provinceId' },
                    },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'branchesOfClient' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'clientId' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'clientId' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'cityId' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'cityId' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'businessId' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'businessId' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'provinceId' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'provinceId' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'number' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'client' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'name' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'city' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'name' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'province' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'id',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'name',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'businesses' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'name' },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<BranchesOfClientQuery, BranchesOfClientQueryVariables>;
export const PreventivesTableDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'preventivesTable' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'preventives' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'business' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'name' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'frequency' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'months' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'observations' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'lastDoneAt' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'status' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'batteryChangedAt' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'assigned' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'fullName' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'branch' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'number' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'client' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'id',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'name',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'city' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'province',
                                                            },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'id',
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'name',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<PreventivesTableQuery, PreventivesTableQueryVariables>;
export const DeletePreventiveDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'deletePreventive' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'String' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'deletePreventive' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'id' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'id' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'preventive' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'success' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'message' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<DeletePreventiveMutation, DeletePreventiveMutationVariables>;
