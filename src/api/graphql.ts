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
};

export type Branch = {
    __typename?: 'Branch';
    city: City;
    client: Client;
    id: Scalars['ID'];
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
    message: Maybe<Scalars['String']>;
    success: Scalars['Boolean'];
    user: Maybe<User>;
};

export type Mutation = {
    __typename?: 'Mutation';
    createPreventive: PreventiveCrudResult;
    createTask: TaskCrudResult;
    deleteTask: TaskCrudResult;
    login: LoginUserResult;
    updateMyAssignedTask: TaskCrudResult;
    updatePreventive: PreventiveCrudResult;
    updateTask: TaskCrudResult;
    updateTaskExpenseStatus: TaskCrudResult;
};

export type MutationCreatePreventiveArgs = {
    data: PreventiveInput;
};

export type MutationCreateTaskArgs = {
    input: TaskInput;
};

export type MutationDeleteTaskArgs = {
    id: Scalars['String'];
};

export type MutationLoginArgs = {
    email: Scalars['String'];
    password: Scalars['String'];
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

export type Preventive = {
    __typename?: 'Preventive';
    assigned: Array<User>;
    branch: Branch;
    business: Business;
    createdAt: Scalars['DateTime'];
    deleted: Scalars['Boolean'];
    frequency: Scalars['Int'];
    id: Scalars['ID'];
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
