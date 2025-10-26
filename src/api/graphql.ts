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

export const AccountType = {
    CajaDeAhorro: 'CajaDeAhorro',
    CuentaCorriente: 'CuentaCorriente',
    CuentaDeSueldo: 'CuentaDeSueldo',
    CuentaEnMonedaExtranjera: 'CuentaEnMonedaExtranjera',
} as const;

export type AccountType = (typeof AccountType)[keyof typeof AccountType];
export const AlicuotaIva = {
    Iva_0: 'IVA_0',
    Iva_10_5: 'IVA_10_5',
    Iva_21: 'IVA_21',
    Iva_27: 'IVA_27',
} as const;

export type AlicuotaIva = (typeof AlicuotaIva)[keyof typeof AlicuotaIva];
export type AttachmentFile = {
    __typename?: 'AttachmentFile';
    filename: Scalars['String'];
    key: Scalars['String'];
    mimeType: Scalars['String'];
    size: Scalars['Int'];
    url: Scalars['String'];
    urlExpire: Maybe<Scalars['DateTime']>;
};

export type AuthResult = {
    __typename?: 'AuthResult';
    message: Maybe<Scalars['String']>;
    success: Scalars['Boolean'];
    user: Maybe<User>;
};

export type BankAccount = {
    __typename?: 'BankAccount';
    accountNumber: Scalars['String'];
    accountType: AccountType;
    alias: Maybe<Scalars['String']>;
    balance: Scalars['Float'];
    bank: Scalars['String'];
    billingProfile: Maybe<BillingProfile>;
    cbu: Maybe<Scalars['String']>;
    createdAt: Scalars['DateTime'];
    deleted: Scalars['Boolean'];
    deletedAt: Maybe<Scalars['DateTime']>;
    holder: Scalars['String'];
    holderCUIT: Scalars['String'];
    id: Scalars['ID'];
    updatedAt: Scalars['DateTime'];
};

export type BankAccountCrudResult = {
    __typename?: 'BankAccountCrudResult';
    bankAccount: Maybe<BankAccount>;
    message: Maybe<Scalars['String']>;
    success: Scalars['Boolean'];
};

export type BankAccountInput = {
    accountNumber: Scalars['String'];
    accountType: AccountType;
    alias: InputMaybe<Scalars['String']>;
    bank: Scalars['String'];
    billingProfileId: InputMaybe<Scalars['String']>;
    cbu: InputMaybe<Scalars['String']>;
    holder: Scalars['String'];
    holderCUIT: Scalars['String'];
};

export type BankAccountUpdateInput = {
    alias: Scalars['String'];
};

export type BankMovement = {
    __typename?: 'BankMovement';
    amount: Scalars['Float'];
    createdAt: Scalars['DateTime'];
    date: Scalars['DateTime'];
    deleted: Scalars['Boolean'];
    deletedAt: Maybe<Scalars['DateTime']>;
    destinationAccount: Maybe<BankAccount>;
    id: Scalars['ID'];
    sourceAccount: BankAccount;
    updatedAt: Scalars['DateTime'];
};

export type BankMovementCrudResult = {
    __typename?: 'BankMovementCrudResult';
    bankMovement: Maybe<BankMovement>;
    message: Maybe<Scalars['String']>;
    success: Scalars['Boolean'];
};

export type Bill = {
    __typename?: 'Bill';
    CUIT: Scalars['String'];
    IVACondition: IvaCondition;
    billingAddress: Scalars['String'];
    billingProfile: BillingProfile;
    business: Business;
    caeData: Maybe<CaeData>;
    comprobanteType: ComprobanteType;
    createdAt: Scalars['DateTime'];
    description: Maybe<Scalars['String']>;
    details: Array<BillDetail>;
    dueDate: Maybe<Scalars['DateTime']>;
    endDate: Maybe<Scalars['DateTime']>;
    id: Scalars['ID'];
    legalName: Scalars['String'];
    pointOfSale: Maybe<Scalars['Int']>;
    punctualService: Scalars['Boolean'];
    saleCondition: Scalars['String'];
    serviceDate: Maybe<Scalars['DateTime']>;
    startDate: Maybe<Scalars['DateTime']>;
    status: BillStatus;
    updatedAt: Scalars['DateTime'];
    withholdingAmount: Maybe<Scalars['Float']>;
};

export type BillCrudResult = {
    __typename?: 'BillCrudResult';
    bill: Maybe<Bill>;
    message: Maybe<Scalars['String']>;
    success: Scalars['Boolean'];
};

export type BillDetail = {
    __typename?: 'BillDetail';
    alicuotaIVA: AlicuotaIva;
    description: Scalars['String'];
    quantity: Scalars['Int'];
    unitPrice: Scalars['Float'];
};

export type BillDetailInput = {
    alicuotaIVA: AlicuotaIva;
    description: Scalars['String'];
    quantity: Scalars['Int'];
    unitPrice: Scalars['Float'];
};

export type BillInput = {
    billingProfileId: Scalars['String'];
    comprobanteType: ComprobanteType;
    description: InputMaybe<Scalars['String']>;
    details: Array<BillDetailInput>;
    dueDate: InputMaybe<Scalars['DateTime']>;
    endDate: InputMaybe<Scalars['DateTime']>;
    punctualService: Scalars['Boolean'];
    saleCondition: Scalars['String'];
    serviceDate: InputMaybe<Scalars['DateTime']>;
    startDate: InputMaybe<Scalars['DateTime']>;
    status: BillStatus;
    withholdingAmount: InputMaybe<Scalars['Float']>;
};

export const BillStatus = {
    Borrador: 'Borrador',
    Pagada: 'Pagada',
    Pendiente: 'Pendiente',
    Vencida: 'Vencida',
} as const;

export type BillStatus = (typeof BillStatus)[keyof typeof BillStatus];
export type BillingProfile = {
    __typename?: 'BillingProfile';
    IVACondition: IvaCondition;
    billingEmails: Array<Scalars['String']>;
    bills: Array<Bill>;
    business: Business;
    comercialAddress: Scalars['String'];
    contacts: Array<Contact>;
    createdAt: Scalars['DateTime'];
    deleted: Scalars['Boolean'];
    deletedAt: Maybe<Scalars['DateTime']>;
    firstContact: Maybe<Contact>;
    id: Scalars['ID'];
    legalName: Scalars['String'];
    numeroDocumento: Scalars['String'];
    tipoDocumento: TipoDocumento;
    updatedAt: Scalars['DateTime'];
};

export type BillingProfileCrudResult = {
    __typename?: 'BillingProfileCrudResult';
    billingProfile: Maybe<BillingProfile>;
    message: Maybe<Scalars['String']>;
    success: Scalars['Boolean'];
};

export type BillingProfileInput = {
    IVACondition: IvaCondition;
    billingEmails: Array<Scalars['String']>;
    businessId: InputMaybe<Scalars['String']>;
    businessName: InputMaybe<Scalars['String']>;
    comercialAddress: Scalars['String'];
    contacts: InputMaybe<Array<ContactInput>>;
    legalName: Scalars['String'];
    numeroDocumento: Scalars['String'];
    tipoDocumento: TipoDocumento;
};

export type Branch = {
    __typename?: 'Branch';
    businesses: Array<Business>;
    city: City;
    client: Client;
    id: Scalars['ID'];
    name: Maybe<Scalars['String']>;
    number: Maybe<Scalars['Int']>;
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
    name: InputMaybe<Scalars['String']>;
    number: InputMaybe<Scalars['Int']>;
};

export type Budget = {
    __typename?: 'Budget';
    billingProfile: BillingProfile;
    branch: Maybe<Branch>;
    budgetBranch: Maybe<BudgetBranch>;
    budgetNumber: Scalars['Int'];
    client: Maybe<Client>;
    clientName: Maybe<Scalars['String']>;
    createdAt: Scalars['DateTime'];
    createdBy: User;
    deleted: Scalars['Boolean'];
    deletedAt: Maybe<Scalars['DateTime']>;
    description: Maybe<Scalars['String']>;
    expectedExpenses: Array<ExpectedExpense>;
    id: Scalars['ID'];
    manpower: Array<Manpower>;
    markup: Maybe<Scalars['Float']>;
    price: Scalars['Float'];
    status: BudgetStatus;
    subject: Scalars['String'];
    totalExpectedExpenses: Scalars['Float'];
    updatedAt: Scalars['DateTime'];
};

export type BudgetBranch = {
    __typename?: 'BudgetBranch';
    name: Maybe<Scalars['String']>;
    number: Maybe<Scalars['Int']>;
};

export type BudgetBranchInput = {
    name: InputMaybe<Scalars['String']>;
    number: InputMaybe<Scalars['Int']>;
};

export type BudgetCrudResult = {
    __typename?: 'BudgetCrudResult';
    budget: Maybe<Budget>;
    message: Maybe<Scalars['String']>;
    success: Scalars['Boolean'];
};

export type BudgetInput = {
    billingProfileId: Scalars['String'];
    branchId: InputMaybe<Scalars['String']>;
    budgetBranch: InputMaybe<BudgetBranchInput>;
    clientId: InputMaybe<Scalars['String']>;
    clientName: InputMaybe<Scalars['String']>;
    description: InputMaybe<Scalars['String']>;
    expectedExpenses: InputMaybe<Array<ExpectedExpenseInput>>;
    manpower: InputMaybe<Array<ManpowerInput>>;
    markup: InputMaybe<Scalars['Float']>;
    price: Scalars['Float'];
    subject: Scalars['String'];
};

export const BudgetStatus = {
    Aprobado: 'Aprobado',
    Borrador: 'Borrador',
    Enviado: 'Enviado',
    Expirado: 'Expirado',
    Rechazado: 'Rechazado',
} as const;

export type BudgetStatus = (typeof BudgetStatus)[keyof typeof BudgetStatus];
export type Business = {
    __typename?: 'Business';
    billingProfile: BillingProfile;
    branchesIDs: Maybe<Array<Scalars['String']>>;
    createdAt: Scalars['Date'];
    deletedAt: Maybe<Scalars['Date']>;
    id: Scalars['ID'];
    name: Scalars['String'];
    updatedAt: Scalars['Date'];
};

export type BusinessInput = {
    name: Scalars['String'];
};

export type BusinessResult = {
    __typename?: 'BusinessResult';
    business: Maybe<Business>;
    message: Maybe<Scalars['String']>;
    success: Scalars['Boolean'];
};

export type CaeData = {
    __typename?: 'CAEData';
    code: Scalars['String'];
    comprobanteNumber: Scalars['String'];
    expirationDate: Scalars['DateTime'];
    status: CaeStatus;
};

export const CaeStatus = {
    Autorizado: 'Autorizado',
    Observado: 'Observado',
    Rechazado: 'Rechazado',
} as const;

export type CaeStatus = (typeof CaeStatus)[keyof typeof CaeStatus];
export type ChangePasswordInput = {
    currentPassword: Scalars['String'];
    newPassword: Scalars['String'];
};

export type City = {
    __typename?: 'City';
    id: Scalars['ID'];
    name: Scalars['String'];
    province: Province;
};

export type CityCrudRef = {
    __typename?: 'CityCrudRef';
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
    branches: Array<Branch>;
    createdAt: Scalars['Date'];
    deletedAt: Maybe<Scalars['Date']>;
    id: Scalars['ID'];
    name: Scalars['String'];
    updatedAt: Scalars['Date'];
};

export type ClientInput = {
    name: Scalars['String'];
};

export type ClientResult = {
    __typename?: 'ClientResult';
    client: Maybe<Client>;
    message: Maybe<Scalars['String']>;
    success: Scalars['Boolean'];
};

export const ComprobanteType = {
    A: 'A',
    B: 'B',
    C: 'C',
} as const;

export type ComprobanteType = (typeof ComprobanteType)[keyof typeof ComprobanteType];
export type Contact = {
    __typename?: 'Contact';
    email: Scalars['String'];
    fullName: Scalars['String'];
    notes: Scalars['String'];
    phone: Scalars['String'];
};

export type ContactInput = {
    email: Scalars['String'];
    fullName: Scalars['String'];
    notes: Scalars['String'];
    phone: Scalars['String'];
};

export type CreateBudgetWithBillingProfileInput = {
    billingProfileId: InputMaybe<Scalars['String']>;
    branchId: InputMaybe<Scalars['String']>;
    budgetBranch: InputMaybe<BudgetBranchInput>;
    businessBillingEmails: InputMaybe<Array<Scalars['String']>>;
    businessComercialAddress: InputMaybe<Scalars['String']>;
    businessIVACondition: InputMaybe<Scalars['String']>;
    businessId: InputMaybe<Scalars['String']>;
    businessLegalName: InputMaybe<Scalars['String']>;
    businessName: InputMaybe<Scalars['String']>;
    businessNumeroDocumento: InputMaybe<Scalars['String']>;
    businessTipoDocumento: InputMaybe<Scalars['String']>;
    clientId: InputMaybe<Scalars['String']>;
    clientName: InputMaybe<Scalars['String']>;
    contacts: InputMaybe<Array<ContactInput>>;
    description: InputMaybe<Scalars['String']>;
    expectedExpenses: InputMaybe<Array<ExpectedExpenseInput>>;
    manpower: InputMaybe<Array<ManpowerInput>>;
    markup: InputMaybe<Scalars['Float']>;
    price: Scalars['Float'];
    subject: Scalars['String'];
};

export type DownloadTaskPhotosResult = {
    __typename?: 'DownloadTaskPhotosResult';
    message: Maybe<Scalars['String']>;
    success: Scalars['Boolean'];
    url: Maybe<Scalars['String']>;
};

export type ExpectedExpense = {
    __typename?: 'ExpectedExpense';
    amount: Scalars['Float'];
    quantity: Scalars['Int'];
    type: ExpenseType;
    unitPrice: Scalars['Float'];
};

export type ExpectedExpenseInput = {
    amount: Scalars['Float'];
    quantity: InputMaybe<Scalars['Int']>;
    type: ExpenseType;
    unitPrice: Scalars['Float'];
};

export type Expense = {
    __typename?: 'Expense';
    administrativeNotes: Maybe<Scalars['String']>;
    amount: Scalars['Float'];
    attachmentFiles: Array<AttachmentFile>;
    auditor: Maybe<User>;
    cityName: Maybe<Scalars['String']>;
    createdAt: Scalars['DateTime'];
    discountAmount: Maybe<Scalars['Float']>;
    doneBy: Scalars['String'];
    expenseDate: Maybe<Scalars['DateTime']>;
    expenseNumber: Scalars['String'];
    expenseType: ExpenseType;
    files: Array<File>;
    id: Scalars['ID'];
    images: Array<Image>;
    installments: Maybe<Scalars['Int']>;
    invoiceType: ExpenseInvoiceType;
    observations: Maybe<Scalars['String']>;
    paySource: ExpensePaySource;
    paySourceBank: Maybe<ExpensePaySourceBank>;
    registeredBy: User;
    status: ExpenseStatus;
    task: Maybe<Task>;
};

export type ExpenseCrudResult = {
    __typename?: 'ExpenseCrudResult';
    expense: Maybe<Expense>;
    message: Maybe<Scalars['String']>;
    success: Scalars['Boolean'];
};

export type ExpenseInput = {
    amount: Scalars['Float'];
    cityName: Scalars['String'];
    doneBy: Scalars['String'];
    expenseDate: InputMaybe<Scalars['DateTime']>;
    expenseType: ExpenseType;
    fileKeys: InputMaybe<Array<Scalars['String']>>;
    filenames: InputMaybe<Array<Scalars['String']>>;
    imageKeys: InputMaybe<Array<Scalars['String']>>;
    installments: Scalars['Int'];
    invoiceType: ExpenseInvoiceType;
    mimeTypes: InputMaybe<Array<Scalars['String']>>;
    observations: InputMaybe<Scalars['String']>;
    paySource: ExpensePaySource;
    paySourceBank: InputMaybe<ExpensePaySourceBank>;
    sizes: InputMaybe<Array<Scalars['Int']>>;
};

export const ExpenseInvoiceType = {
    FacturaElectronicaAdjunta: 'FacturaElectronicaAdjunta',
    FacturaPapel: 'FacturaPapel',
    FacturaViaMailOWhatsapp: 'FacturaViaMailOWhatsapp',
    SinFactura: 'SinFactura',
} as const;

export type ExpenseInvoiceType =
    (typeof ExpenseInvoiceType)[keyof typeof ExpenseInvoiceType];
export const ExpensePaySource = {
    Credito: 'Credito',
    Debito: 'Debito',
    Otro: 'Otro',
    Reintegro: 'Reintegro',
    Transferencia: 'Transferencia',
} as const;

export type ExpensePaySource = (typeof ExpensePaySource)[keyof typeof ExpensePaySource];
export const ExpensePaySourceBank = {
    Bbva: 'BBVA',
    Chubut: 'Chubut',
    Nacion: 'Nacion',
    Otro: 'Otro',
    Santander: 'Santander',
} as const;

export type ExpensePaySourceBank =
    (typeof ExpensePaySourceBank)[keyof typeof ExpensePaySourceBank];
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
    Otro: 'Otro',
    Viatico: 'Viatico',
} as const;

export type ExpenseType = (typeof ExpenseType)[keyof typeof ExpenseType];
export type ExpensesResponse = {
    __typename?: 'ExpensesResponse';
    items: Array<Expense>;
    total: Scalars['Int'];
};

export type File = {
    __typename?: 'File';
    createdAt: Scalars['Date'];
    expenses: Array<Expense>;
    filename: Scalars['String'];
    id: Scalars['ID'];
    key: Scalars['String'];
    mimeType: Scalars['String'];
    size: Scalars['Int'];
    updatedAt: Scalars['Date'];
    url: Scalars['String'];
    urlExpire: Maybe<Scalars['Date']>;
};

export type FileCrudRef = {
    __typename?: 'FileCrudRef';
    file: Maybe<File>;
    message: Maybe<Scalars['String']>;
    success: Scalars['Boolean'];
};

export type FileInput = {
    filename: Scalars['String'];
    key: Scalars['String'];
    mimeType: Scalars['String'];
    size: Scalars['Int'];
    url: Scalars['String'];
};

export type GeneratePresignedUrlsResponse = {
    __typename?: 'GeneratePresignedUrlsResponse';
    message: Maybe<Scalars['String']>;
    presignedUrls: Array<PresignedUrlInfo>;
    success: Scalars['Boolean'];
};

export type GmailMessage = {
    __typename?: 'GmailMessage';
    historyId: Scalars['String'];
    id: Scalars['String'];
    internalDate: Scalars['String'];
    labelIds: Array<Scalars['String']>;
    payload: Scalars['JSON'];
    sizeEstimate: Scalars['Int'];
    snippet: Scalars['String'];
    threadId: Scalars['String'];
};

export type GmailResult = {
    __typename?: 'GmailResult';
    data: Maybe<Scalars['JSON']>;
    message: Maybe<Scalars['String']>;
    success: Scalars['Boolean'];
};

export type GmailThread = {
    __typename?: 'GmailThread';
    historyId: Scalars['String'];
    id: Scalars['String'];
    messages: Array<GmailMessage>;
    snippet: Scalars['String'];
    subject: Maybe<Scalars['String']>;
};

export type GmailThreadResult = {
    __typename?: 'GmailThreadResult';
    message: Maybe<Scalars['String']>;
    success: Scalars['Boolean'];
    thread: Maybe<GmailThread>;
};

export type GmailThreadsResult = {
    __typename?: 'GmailThreadsResult';
    message: Maybe<Scalars['String']>;
    success: Scalars['Boolean'];
    threads: Maybe<Array<GmailThread>>;
};

export const IvaCondition = {
    ConsumidorFinal: 'ConsumidorFinal',
    Exento: 'Exento',
    Monotributo: 'Monotributo',
    ResponsableInscripto: 'ResponsableInscripto',
} as const;

export type IvaCondition = (typeof IvaCondition)[keyof typeof IvaCondition];
export type Image = {
    __typename?: 'Image';
    id: Scalars['ID'];
    key: Scalars['String'];
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

export type Manpower = {
    __typename?: 'Manpower';
    payAmount: Scalars['Float'];
    technician: Scalars['String'];
};

export type ManpowerInput = {
    payAmount: Scalars['Float'];
    technician: Scalars['String'];
};

export type Mutation = {
    __typename?: 'Mutation';
    changePassword: AuthResult;
    createBankAccount: BankAccountCrudResult;
    createBill: BillCrudResult;
    createBillingProfile: BillingProfileCrudResult;
    createBranch: BranchCrudResult;
    createBudget: BudgetCrudResult;
    createBudgetWithBillingProfile: BudgetCrudResult;
    createBusiness: BusinessResult;
    createCity: CityCrudRef;
    createClient: ClientResult;
    createExpense: ExpenseCrudResult;
    createFile: FileCrudRef;
    createMyTask: TaskCrudResult;
    createPreventive: PreventiveCrudRef;
    createProvince: ProvinceCrudResult;
    createServiceOrder: ServiceOrderCrudResult;
    createTask: TaskCrudResult;
    createTaskPrice: TaskPriceCrudResult;
    createUser: UserCrudPothosRef;
    deleteBankAccount: BankAccountCrudResult;
    deleteBillingProfile: BillingProfileCrudResult;
    deleteBranch: BranchCrudResult;
    deleteBudget: BudgetCrudResult;
    deleteBusiness: BusinessResult;
    deleteCity: CityCrudRef;
    deleteClient: ClientResult;
    deleteExpense: ExpenseCrudResult;
    deleteFile: FileCrudRef;
    deleteImage: TaskCrudResult;
    deletePreventive: PreventiveCrudRef;
    deleteProvince: ProvinceCrudResult;
    deleteTask: TaskCrudResult;
    deleteUser: UserCrudPothosRef;
    downloadTaskPhotos: DownloadTaskPhotosResult;
    finishTask: TaskCrudResult;
    generateApprovedExpensesReport: Scalars['String'];
    generateApprovedTasksReport: Scalars['String'];
    generatePresignedUrls: GeneratePresignedUrlsResponse;
    generateUploadUrls: PresignedUrlResponse;
    login: LoginUserResult;
    logout: AuthResult;
    registerExpoToken: Scalars['Boolean'];
    sendNewUserRandomPassword: UserCrudPothosRef;
    updateBankAccount: BankAccountCrudResult;
    updateBill: BillCrudResult;
    updateBillingProfile: BillingProfileCrudResult;
    updateBranch: BranchCrudResult;
    updateBudget: BudgetCrudResult;
    updateBudgetStatus: BudgetCrudResult;
    updateBusiness: BusinessResult;
    updateCity: CityCrudRef;
    updateClient: ClientResult;
    updateExpenseAdministrative: ExpenseCrudResult;
    updateExpenseDiscountAmount: ExpenseCrudResult;
    updateExpenseStatus: ExpenseCrudResult;
    updateMyAssignedTask: TaskCrudResult;
    updatePreventive: PreventiveCrudRef;
    updateProvince: ProvinceCrudResult;
    updateTask: TaskCrudResult;
    updateTaskPrice: TaskPriceCrudResult;
    updateTaskStatus: TaskCrudResult;
    updateUser: UserCrudPothosRef;
};

export type MutationChangePasswordArgs = {
    data: ChangePasswordInput;
};

export type MutationCreateBankAccountArgs = {
    input: BankAccountInput;
};

export type MutationCreateBillArgs = {
    input: BillInput;
};

export type MutationCreateBillingProfileArgs = {
    input: BillingProfileInput;
};

export type MutationCreateBranchArgs = {
    input: BranchInput;
};

export type MutationCreateBudgetArgs = {
    input: BudgetInput;
};

export type MutationCreateBudgetWithBillingProfileArgs = {
    input: CreateBudgetWithBillingProfileInput;
};

export type MutationCreateBusinessArgs = {
    data: BusinessInput;
};

export type MutationCreateCityArgs = {
    input: CityInput;
};

export type MutationCreateClientArgs = {
    data: ClientInput;
};

export type MutationCreateExpenseArgs = {
    expenseData: ExpenseInput;
    taskId: InputMaybe<Scalars['String']>;
};

export type MutationCreateFileArgs = {
    input: FileInput;
};

export type MutationCreateMyTaskArgs = {
    input: MyTaskInput;
};

export type MutationCreatePreventiveArgs = {
    input: PreventiveInput;
};

export type MutationCreateProvinceArgs = {
    data: ProvinceInput;
};

export type MutationCreateServiceOrderArgs = {
    branchId: Scalars['String'];
    businessId: Scalars['String'];
    clientId: Scalars['String'];
    description: InputMaybe<Scalars['String']>;
    status: ServiceOrderStatus;
};

export type MutationCreateTaskArgs = {
    input: TaskInput;
};

export type MutationCreateTaskPriceArgs = {
    input: TaskPriceInput;
};

export type MutationCreateUserArgs = {
    input: UserInput;
};

export type MutationDeleteBankAccountArgs = {
    id: Scalars['String'];
};

export type MutationDeleteBillingProfileArgs = {
    id: Scalars['String'];
};

export type MutationDeleteBranchArgs = {
    id: Scalars['String'];
};

export type MutationDeleteBudgetArgs = {
    id: Scalars['String'];
};

export type MutationDeleteBusinessArgs = {
    id: Scalars['String'];
};

export type MutationDeleteCityArgs = {
    id: Scalars['String'];
};

export type MutationDeleteClientArgs = {
    id: Scalars['String'];
};

export type MutationDeleteExpenseArgs = {
    id: Scalars['String'];
    taskId: Scalars['String'];
};

export type MutationDeleteFileArgs = {
    id: Scalars['String'];
};

export type MutationDeleteImageArgs = {
    imageId: Scalars['String'];
    taskId: Scalars['String'];
};

export type MutationDeletePreventiveArgs = {
    id: Scalars['String'];
};

export type MutationDeleteProvinceArgs = {
    id: Scalars['String'];
};

export type MutationDeleteTaskArgs = {
    id: Scalars['String'];
};

export type MutationDeleteUserArgs = {
    id: Scalars['String'];
};

export type MutationDownloadTaskPhotosArgs = {
    businessId: InputMaybe<Scalars['String']>;
    endDate: Scalars['DateTime'];
    startDate: Scalars['DateTime'];
};

export type MutationFinishTaskArgs = {
    id: Scalars['String'];
};

export type MutationGenerateApprovedExpensesReportArgs = {
    endDate: Scalars['DateTime'];
    startDate: Scalars['DateTime'];
};

export type MutationGenerateApprovedTasksReportArgs = {
    endDate: Scalars['DateTime'];
    startDate: Scalars['DateTime'];
};

export type MutationGeneratePresignedUrlsArgs = {
    fileCount: Scalars['Int'];
    mimeTypes: Array<Scalars['String']>;
    prefix: Scalars['String'];
};

export type MutationGenerateUploadUrlsArgs = {
    fileCount: Scalars['Int'];
    mimeTypes: Array<Scalars['String']>;
    prefix: Scalars['String'];
};

export type MutationLoginArgs = {
    email: Scalars['String'];
    password: Scalars['String'];
};

export type MutationRegisterExpoTokenArgs = {
    token: Scalars['String'];
};

export type MutationSendNewUserRandomPasswordArgs = {
    id: Scalars['String'];
};

export type MutationUpdateBankAccountArgs = {
    id: Scalars['String'];
    input: BankAccountUpdateInput;
};

export type MutationUpdateBillArgs = {
    id: Scalars['String'];
    input: BillInput;
};

export type MutationUpdateBillingProfileArgs = {
    id: Scalars['String'];
    input: UpdateBillingProfileInput;
};

export type MutationUpdateBranchArgs = {
    id: Scalars['String'];
    input: BranchInput;
};

export type MutationUpdateBudgetArgs = {
    id: Scalars['String'];
    input: UpdateBudgetInput;
};

export type MutationUpdateBudgetStatusArgs = {
    id: Scalars['String'];
    input: UpdateBudgetStatusInput;
};

export type MutationUpdateBusinessArgs = {
    data: BusinessInput;
    id: Scalars['String'];
};

export type MutationUpdateCityArgs = {
    id: Scalars['String'];
    input: CityInput;
};

export type MutationUpdateClientArgs = {
    data: ClientInput;
    id: Scalars['String'];
};

export type MutationUpdateExpenseAdministrativeArgs = {
    id: Scalars['String'];
    input: UpdateExpenseAdministrativeInput;
};

export type MutationUpdateExpenseDiscountAmountArgs = {
    discountAmount: InputMaybe<Scalars['Float']>;
    expenseId: Scalars['String'];
};

export type MutationUpdateExpenseStatusArgs = {
    expenseId: Scalars['String'];
    status: ExpenseStatus;
};

export type MutationUpdateMyAssignedTaskArgs = {
    input: UpdateMyTaskInput;
};

export type MutationUpdatePreventiveArgs = {
    id: Scalars['String'];
    input: PreventiveInput;
};

export type MutationUpdateProvinceArgs = {
    data: ProvinceInput;
    id: Scalars['String'];
};

export type MutationUpdateTaskArgs = {
    id: Scalars['String'];
    input: TaskInput;
};

export type MutationUpdateTaskPriceArgs = {
    id: Scalars['String'];
    input: TaskPriceUpdateInput;
};

export type MutationUpdateTaskStatusArgs = {
    id: Scalars['String'];
    status: TaskStatus;
};

export type MutationUpdateUserArgs = {
    id: Scalars['String'];
    input: UserInput;
};

export type MyTaskInput = {
    actNumber: InputMaybe<Scalars['String']>;
    assigned: InputMaybe<Array<Scalars['String']>>;
    branch: InputMaybe<Scalars['String']>;
    business: InputMaybe<Scalars['String']>;
    businessName: InputMaybe<Scalars['String']>;
    clientName: InputMaybe<Scalars['String']>;
    closedAt: InputMaybe<Scalars['DateTime']>;
    expenses: InputMaybe<Array<ExpenseInput>>;
    imageKeys: InputMaybe<Array<Scalars['String']>>;
    observations: InputMaybe<Scalars['String']>;
    participants: InputMaybe<Array<Scalars['String']>>;
    startedAt: InputMaybe<Scalars['DateTime']>;
    taskType: TaskType;
    useMaterials: Scalars['Boolean'];
};

export type PresignedUrlInfo = {
    __typename?: 'PresignedUrlInfo';
    expiresIn: Scalars['Int'];
    key: Scalars['String'];
    url: Scalars['String'];
};

export type PresignedUrlResponse = {
    __typename?: 'PresignedUrlResponse';
    message: Maybe<Scalars['String']>;
    success: Scalars['Boolean'];
    uploadUrls: Array<UploadUrlInfo>;
};

export type Preventive = {
    __typename?: 'Preventive';
    assigned: Array<User>;
    batteryChangedAt: Maybe<Scalars['DateTime']>;
    branch: Branch;
    business: Business;
    frequency: Maybe<PreventiveFrequency>;
    id: Scalars['ID'];
    lastDoneAt: Maybe<Scalars['DateTime']>;
    months: Array<Scalars['String']>;
    observations: Maybe<Scalars['String']>;
    status: PreventiveStatus;
    tasks: Array<Task>;
};

export type PreventiveCrudRef = {
    __typename?: 'PreventiveCrudRef';
    message: Maybe<Scalars['String']>;
    preventive: Maybe<Preventive>;
    success: Scalars['Boolean'];
};

export const PreventiveFrequency = {
    Anual: 'Anual',
    Bimestral: 'Bimestral',
    Cuatrimestral: 'Cuatrimestral',
    Mensual: 'Mensual',
    Semestral: 'Semestral',
    Trimestral: 'Trimestral',
} as const;

export type PreventiveFrequency =
    (typeof PreventiveFrequency)[keyof typeof PreventiveFrequency];
export type PreventiveInput = {
    assignedIds: Array<Scalars['String']>;
    batteryChangedAt: InputMaybe<Scalars['DateTime']>;
    branchId: Scalars['String'];
    businessId: Scalars['String'];
    frequency: InputMaybe<PreventiveFrequency>;
    lastDoneAt: InputMaybe<Scalars['DateTime']>;
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
    cities: Array<City>;
    createdAt: Scalars['Date'];
    id: Scalars['ID'];
    name: Scalars['String'];
    updatedAt: Scalars['Date'];
};

export type ProvinceCrudResult = {
    __typename?: 'ProvinceCrudResult';
    message: Maybe<Scalars['String']>;
    province: Maybe<Province>;
    success: Scalars['Boolean'];
};

export type ProvinceInput = {
    name: Scalars['String'];
};

export type Query = {
    __typename?: 'Query';
    bankAccount: Maybe<BankAccount>;
    bankAccounts: Array<BankAccount>;
    bankAccountsByBillingProfile: Array<BankAccount>;
    bankMovement: Maybe<BankMovement>;
    bankMovements: Array<BankMovement>;
    bankMovementsCount: Scalars['Int'];
    bill: Maybe<Bill>;
    billingProfileByBusinessId: Maybe<BillingProfile>;
    billingProfileById: Maybe<BillingProfile>;
    billingProfiles: Array<BillingProfile>;
    billingProfilesCount: Scalars['Int'];
    bills: Array<Bill>;
    billsCount: Scalars['Int'];
    branch: Branch;
    branchBusinesses: Array<Business>;
    branches: Array<Branch>;
    budgetById: Maybe<Budget>;
    budgets: Array<Budget>;
    budgetsCount: Scalars['Int'];
    business: Business;
    businesses: Array<Business>;
    businessesCount: Scalars['Int'];
    cities: Array<City>;
    citiesCount: Scalars['Int'];
    city: City;
    client: Client;
    clientBranches: Array<Branch>;
    clientBranchesByBusiness: Array<Branch>;
    clientBranchesCount: Scalars['Int'];
    clients: Array<Client>;
    clientsByBusiness: Array<Client>;
    clientsCount: Scalars['Int'];
    expenseById: Maybe<Expense>;
    expenses: Array<Expense>;
    expensesCount: Scalars['Int'];
    file: File;
    files: Array<File>;
    getGmailThread: GmailThreadResult;
    getGmailThreadInfo: GmailThreadResult;
    getRecentGmailThreads: GmailThreadsResult;
    getTaskPhotosWithInfo: Array<Scalars['String']>;
    gmailThreadExists: Scalars['Boolean'];
    images: Array<Image>;
    isGmailConfigured: GmailResult;
    myAssignedTaskById: Maybe<Task>;
    myAssignedTasks: Array<Task>;
    myExpenseById: Maybe<Expense>;
    myExpenses: Maybe<Array<Expense>>;
    preventive: Preventive;
    preventives: Array<Preventive>;
    preventivesCount: Scalars['Int'];
    province: Province;
    provinces: Array<Province>;
    provincesCount: Scalars['Int'];
    searchBudgetThreads: GmailThreadsResult;
    searchGmailThreads: GmailThreadsResult;
    searchThreadsByClient: GmailThreadsResult;
    serviceOrder: Maybe<ServiceOrder>;
    serviceOrders: Array<ServiceOrder>;
    taskById: Maybe<Task>;
    taskPrice: Maybe<TaskPrice>;
    taskPrices: Array<TaskPrice>;
    taskPricesCount: Scalars['Int'];
    taskTypes: Array<TaskType>;
    tasks: Array<Task>;
    tasksCount: Scalars['Int'];
    technicians: Array<User>;
    user: User;
    users: Array<User>;
    usersCount: Scalars['Int'];
};

export type QueryBankAccountArgs = {
    id: Scalars['String'];
};

export type QueryBankAccountsByBillingProfileArgs = {
    billingProfileId: Scalars['String'];
};

export type QueryBankMovementArgs = {
    id: Scalars['String'];
};

export type QueryBankMovementsArgs = {
    destinationAccountId: InputMaybe<Scalars['String']>;
    endDate: InputMaybe<Scalars['DateTime']>;
    orderBy: InputMaybe<Scalars['String']>;
    orderDirection: InputMaybe<Scalars['String']>;
    skip: InputMaybe<Scalars['Int']>;
    sourceAccountId: InputMaybe<Scalars['String']>;
    startDate: InputMaybe<Scalars['DateTime']>;
    take: InputMaybe<Scalars['Int']>;
};

export type QueryBankMovementsCountArgs = {
    destinationAccountId: InputMaybe<Scalars['String']>;
    endDate: InputMaybe<Scalars['DateTime']>;
    sourceAccountId: InputMaybe<Scalars['String']>;
    startDate: InputMaybe<Scalars['DateTime']>;
};

export type QueryBillArgs = {
    id: Scalars['String'];
};

export type QueryBillingProfileByBusinessIdArgs = {
    businessId: Scalars['String'];
};

export type QueryBillingProfileByIdArgs = {
    id: Scalars['String'];
};

export type QueryBillingProfilesArgs = {
    businessId: InputMaybe<Array<Scalars['String']>>;
    orderBy: InputMaybe<Scalars['String']>;
    orderDirection: InputMaybe<Scalars['String']>;
    skip: InputMaybe<Scalars['Int']>;
    take: InputMaybe<Scalars['Int']>;
};

export type QueryBillingProfilesCountArgs = {
    businessId: InputMaybe<Array<Scalars['String']>>;
};

export type QueryBillsArgs = {
    businessId: InputMaybe<Scalars['String']>;
    orderBy: InputMaybe<Scalars['String']>;
    orderDirection: InputMaybe<Scalars['String']>;
    skip: InputMaybe<Scalars['Int']>;
    status: InputMaybe<BillStatus>;
    take: InputMaybe<Scalars['Int']>;
};

export type QueryBillsCountArgs = {
    businessId: InputMaybe<Scalars['String']>;
    status: InputMaybe<BillStatus>;
};

export type QueryBranchArgs = {
    id: Scalars['String'];
};

export type QueryBranchBusinessesArgs = {
    branch: InputMaybe<Scalars['String']>;
};

export type QueryBudgetByIdArgs = {
    id: Scalars['String'];
};

export type QueryBudgetsArgs = {
    businessId: InputMaybe<Array<Scalars['String']>>;
    clientId: InputMaybe<Array<Scalars['String']>>;
    orderBy: InputMaybe<Scalars['String']>;
    orderDirection: InputMaybe<Scalars['String']>;
    search: InputMaybe<Scalars['String']>;
    skip: InputMaybe<Scalars['Int']>;
    take: InputMaybe<Scalars['Int']>;
};

export type QueryBudgetsCountArgs = {
    businessId: InputMaybe<Array<Scalars['String']>>;
    clientId: InputMaybe<Array<Scalars['String']>>;
    search: InputMaybe<Scalars['String']>;
};

export type QueryBusinessArgs = {
    id: Scalars['String'];
};

export type QueryBusinessesArgs = {
    search: InputMaybe<Scalars['String']>;
    skip: InputMaybe<Scalars['Int']>;
    take: InputMaybe<Scalars['Int']>;
    withoutBillingProfile: InputMaybe<Scalars['Boolean']>;
};

export type QueryBusinessesCountArgs = {
    search: InputMaybe<Scalars['String']>;
};

export type QueryCitiesArgs = {
    provinceId: InputMaybe<Scalars['String']>;
    search: InputMaybe<Scalars['String']>;
    skip: InputMaybe<Scalars['Int']>;
    take: InputMaybe<Scalars['Int']>;
};

export type QueryCitiesCountArgs = {
    provinceId: InputMaybe<Scalars['String']>;
    search: InputMaybe<Scalars['String']>;
};

export type QueryCityArgs = {
    id: Scalars['String'];
};

export type QueryClientArgs = {
    id: Scalars['String'];
};

export type QueryClientBranchesArgs = {
    businessId: InputMaybe<Array<Scalars['String']>>;
    cityId: InputMaybe<Array<Scalars['String']>>;
    clientId: Scalars['String'];
    skip: InputMaybe<Scalars['Int']>;
    take: InputMaybe<Scalars['Int']>;
};

export type QueryClientBranchesByBusinessArgs = {
    businessId: Scalars['String'];
    clientId: Scalars['String'];
};

export type QueryClientBranchesCountArgs = {
    businessId: InputMaybe<Array<Scalars['String']>>;
    cityId: InputMaybe<Array<Scalars['String']>>;
    clientId: Scalars['String'];
    provinceId: InputMaybe<Array<Scalars['String']>>;
};

export type QueryClientsArgs = {
    search: InputMaybe<Scalars['String']>;
    skip: InputMaybe<Scalars['Int']>;
    take: InputMaybe<Scalars['Int']>;
};

export type QueryClientsByBusinessArgs = {
    businessId: Scalars['String'];
    search: InputMaybe<Scalars['String']>;
};

export type QueryClientsCountArgs = {
    search: InputMaybe<Scalars['String']>;
};

export type QueryExpenseByIdArgs = {
    id: Scalars['String'];
};

export type QueryExpensesArgs = {
    expenseDateFrom: InputMaybe<Scalars['DateTime']>;
    expenseDateTo: InputMaybe<Scalars['DateTime']>;
    expenseType: InputMaybe<Array<ExpenseType>>;
    orderBy: InputMaybe<Scalars['String']>;
    orderDirection: InputMaybe<Scalars['String']>;
    paySource: InputMaybe<Array<ExpensePaySource>>;
    registeredBy: InputMaybe<Array<Scalars['String']>>;
    skip: InputMaybe<Scalars['Int']>;
    status: InputMaybe<Array<ExpenseStatus>>;
    take: InputMaybe<Scalars['Int']>;
};

export type QueryExpensesCountArgs = {
    expenseDateFrom: InputMaybe<Scalars['DateTime']>;
    expenseDateTo: InputMaybe<Scalars['DateTime']>;
    expenseType: InputMaybe<Array<ExpenseType>>;
    paySource: InputMaybe<Array<ExpensePaySource>>;
    registeredBy: InputMaybe<Array<Scalars['String']>>;
    status: InputMaybe<Array<ExpenseStatus>>;
};

export type QueryFileArgs = {
    id: Scalars['String'];
};

export type QueryGetGmailThreadArgs = {
    threadId: Scalars['String'];
};

export type QueryGetGmailThreadInfoArgs = {
    threadId: Scalars['String'];
};

export type QueryGetTaskPhotosWithInfoArgs = {
    businessId: InputMaybe<Scalars['String']>;
    endDate: Scalars['DateTime'];
    startDate: Scalars['DateTime'];
};

export type QueryGmailThreadExistsArgs = {
    threadId: Scalars['String'];
};

export type QueryMyAssignedTaskByIdArgs = {
    id: Scalars['String'];
};

export type QueryMyExpenseByIdArgs = {
    id: Scalars['String'];
};

export type QueryPreventiveArgs = {
    id: Scalars['String'];
};

export type QueryPreventivesArgs = {
    assigned: InputMaybe<Array<Scalars['String']>>;
    business: InputMaybe<Array<Scalars['String']>>;
    city: InputMaybe<Array<Scalars['String']>>;
    client: InputMaybe<Array<Scalars['String']>>;
    frequency: InputMaybe<Array<PreventiveFrequency>>;
    months: InputMaybe<Array<Scalars['String']>>;
    skip?: InputMaybe<Scalars['Int']>;
    status: InputMaybe<Array<PreventiveStatus>>;
    take?: InputMaybe<Scalars['Int']>;
};

export type QueryPreventivesCountArgs = {
    assigned: InputMaybe<Array<Scalars['String']>>;
    business: InputMaybe<Array<Scalars['String']>>;
    city: InputMaybe<Array<Scalars['String']>>;
    client: InputMaybe<Array<Scalars['String']>>;
    frequency: InputMaybe<Array<PreventiveFrequency>>;
    months: InputMaybe<Array<Scalars['String']>>;
    status: InputMaybe<Array<PreventiveStatus>>;
};

export type QueryProvinceArgs = {
    id: Scalars['String'];
};

export type QueryProvincesArgs = {
    search: InputMaybe<Scalars['String']>;
    skip: InputMaybe<Scalars['Int']>;
    take: InputMaybe<Scalars['Int']>;
};

export type QueryProvincesCountArgs = {
    search: InputMaybe<Scalars['String']>;
};

export type QuerySearchBudgetThreadsArgs = {
    query: InputMaybe<Scalars['String']>;
};

export type QuerySearchGmailThreadsArgs = {
    input: SearchGmailThreadsInput;
};

export type QuerySearchThreadsByClientArgs = {
    clientEmail: Scalars['String'];
};

export type QueryServiceOrderArgs = {
    id: Scalars['String'];
};

export type QueryServiceOrdersArgs = {
    businessId: InputMaybe<Scalars['String']>;
    clientId: InputMaybe<Scalars['String']>;
    orderBy: InputMaybe<Scalars['String']>;
    orderDirection: InputMaybe<Scalars['String']>;
    skip: InputMaybe<Scalars['Int']>;
    status: InputMaybe<Scalars['String']>;
    take: InputMaybe<Scalars['Int']>;
};

export type QueryTaskByIdArgs = {
    id: Scalars['String'];
};

export type QueryTaskPriceArgs = {
    id: Scalars['String'];
};

export type QueryTaskPricesArgs = {
    businessId: InputMaybe<Scalars['String']>;
    orderBy: InputMaybe<Scalars['String']>;
    orderDirection: InputMaybe<Scalars['String']>;
    skip: InputMaybe<Scalars['Int']>;
    take: InputMaybe<Scalars['Int']>;
    taskType: InputMaybe<TaskType>;
};

export type QueryTaskPricesCountArgs = {
    businessId: InputMaybe<Scalars['String']>;
    taskType: InputMaybe<TaskType>;
};

export type QueryTasksArgs = {
    assigned: InputMaybe<Array<Scalars['String']>>;
    business: InputMaybe<Array<Scalars['String']>>;
    city: InputMaybe<Array<Scalars['String']>>;
    client: InputMaybe<Array<Scalars['String']>>;
    endDate: InputMaybe<Scalars['DateTime']>;
    orderBy: InputMaybe<Scalars['String']>;
    orderDirection: InputMaybe<Scalars['String']>;
    skip: InputMaybe<Scalars['Int']>;
    startDate: InputMaybe<Scalars['DateTime']>;
    status: InputMaybe<Array<TaskStatus>>;
    take: InputMaybe<Scalars['Int']>;
    taskType: InputMaybe<Array<TaskType>>;
};

export type QueryTasksCountArgs = {
    assigned: InputMaybe<Array<Scalars['String']>>;
    business: InputMaybe<Array<Scalars['String']>>;
    city: InputMaybe<Array<Scalars['String']>>;
    client: InputMaybe<Array<Scalars['String']>>;
    endDate: InputMaybe<Scalars['DateTime']>;
    startDate: InputMaybe<Scalars['DateTime']>;
    status: InputMaybe<Array<TaskStatus>>;
    taskType: InputMaybe<Array<TaskType>>;
};

export type QueryUserArgs = {
    id: Scalars['String'];
};

export type QueryUsersArgs = {
    cityId: InputMaybe<Array<Scalars['String']>>;
    roles: InputMaybe<Array<Role>>;
    search: InputMaybe<Scalars['String']>;
    skip: InputMaybe<Scalars['Int']>;
    take: InputMaybe<Scalars['Int']>;
};

export type QueryUsersCountArgs = {
    cityId: InputMaybe<Array<Scalars['String']>>;
    roles: InputMaybe<Array<Role>>;
    search: InputMaybe<Scalars['String']>;
};

export const Role = {
    AdministrativoContable: 'AdministrativoContable',
    AdministrativoTecnico: 'AdministrativoTecnico',
    Auditor: 'Auditor',
    Tecnico: 'Tecnico',
} as const;

export type Role = (typeof Role)[keyof typeof Role];
export type SearchGmailThreadsInput = {
    /** Número máximo de resultados (default: 20) */
    maxResults: InputMaybe<Scalars['Int']>;
    /** Query de búsqueda de Gmail (ej: "from:example@gmail.com subject:presupuesto") */
    query: Scalars['String'];
};

export type ServiceOrder = {
    __typename?: 'ServiceOrder';
    branch: Branch;
    business: Business;
    client: Client;
    createdAt: Scalars['DateTime'];
    description: Maybe<Scalars['String']>;
    id: Scalars['ID'];
    serviceOrderNumber: Scalars['Int'];
    status: ServiceOrderStatus;
    tasks: Array<Task>;
    updatedAt: Scalars['DateTime'];
};

export type ServiceOrderCrudResult = {
    __typename?: 'ServiceOrderCrudResult';
    message: Maybe<Scalars['String']>;
    serviceOrder: Maybe<ServiceOrder>;
    success: Scalars['Boolean'];
};

export const ServiceOrderStatus = {
    EnProgreso: 'EnProgreso',
    Finalizada: 'Finalizada',
    ParaFacturar: 'ParaFacturar',
    Pendiente: 'Pendiente',
} as const;

export type ServiceOrderStatus =
    (typeof ServiceOrderStatus)[keyof typeof ServiceOrderStatus];
export type Task = {
    __typename?: 'Task';
    actNumber: Maybe<Scalars['Int']>;
    assigned: Array<User>;
    auditor: Maybe<User>;
    branch: Maybe<Branch>;
    business: Maybe<Business>;
    businessName: Maybe<Scalars['String']>;
    clientName: Maybe<Scalars['String']>;
    closedAt: Maybe<Scalars['DateTime']>;
    createdAt: Scalars['DateTime'];
    deleted: Scalars['Boolean'];
    deletedAt: Maybe<Scalars['DateTime']>;
    description: Scalars['String'];
    expenses: Array<Expense>;
    id: Scalars['ID'];
    images: Array<Image>;
    imagesIDs: Array<Scalars['String']>;
    movitecTicket: Maybe<Scalars['String']>;
    observations: Maybe<Scalars['String']>;
    openedAt: Scalars['DateTime'];
    participants: Array<Scalars['String']>;
    preventive: Maybe<Preventive>;
    startedAt: Maybe<Scalars['DateTime']>;
    status: TaskStatus;
    taskNumber: Scalars['Int'];
    taskType: TaskType;
    updatedAt: Scalars['DateTime'];
    useMaterials: Maybe<Scalars['Boolean']>;
};

export type TaskCrudResult = {
    __typename?: 'TaskCrudResult';
    message: Maybe<Scalars['String']>;
    success: Scalars['Boolean'];
    task: Maybe<Task>;
};

export type TaskInput = {
    actNumber: InputMaybe<Scalars['Int']>;
    assigned: Array<Scalars['String']>;
    auditor: InputMaybe<Scalars['String']>;
    branch: InputMaybe<Scalars['String']>;
    business: InputMaybe<Scalars['String']>;
    businessName: InputMaybe<Scalars['String']>;
    clientName: InputMaybe<Scalars['String']>;
    description: Scalars['String'];
    movitecTicket: InputMaybe<Scalars['String']>;
    serviceOrderId: InputMaybe<Scalars['String']>;
    taskType: TaskType;
};

export type TaskPrice = {
    __typename?: 'TaskPrice';
    business: Business;
    businessId: Scalars['String'];
    createdAt: Scalars['DateTime'];
    id: Scalars['ID'];
    price: Scalars['Float'];
    priceHistory: Array<TaskPriceHistory>;
    taskType: TaskType;
    updatedAt: Scalars['DateTime'];
};

export type TaskPriceCrudResult = {
    __typename?: 'TaskPriceCrudResult';
    message: Maybe<Scalars['String']>;
    success: Scalars['Boolean'];
    taskPrice: Maybe<TaskPrice>;
};

export type TaskPriceHistory = {
    __typename?: 'TaskPriceHistory';
    price: Scalars['Float'];
    updatedAt: Scalars['DateTime'];
};

export type TaskPriceInput = {
    businessId: Scalars['String'];
    price: Scalars['Float'];
    taskType: TaskType;
};

export type TaskPriceUpdateInput = {
    price: Scalars['Float'];
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
    InspeccionPolicial: 'InspeccionPolicial',
    Instalacion: 'Instalacion',
    Preventivo: 'Preventivo',
} as const;

export type TaskType = (typeof TaskType)[keyof typeof TaskType];
export const TipoDocumento = {
    Cdi: 'CDI',
    Cuil: 'CUIL',
    Cuit: 'CUIT',
    Dni: 'DNI',
    Otro: 'Otro',
    Pasaporte: 'Pasaporte',
} as const;

export type TipoDocumento = (typeof TipoDocumento)[keyof typeof TipoDocumento];
export type UpdateBillingProfileInput = {
    IVACondition: InputMaybe<IvaCondition>;
    billingEmails: InputMaybe<Array<Scalars['String']>>;
    comercialAddress: InputMaybe<Scalars['String']>;
    contacts: InputMaybe<Array<ContactInput>>;
    legalName: InputMaybe<Scalars['String']>;
    numeroDocumento: InputMaybe<Scalars['String']>;
    tipoDocumento: InputMaybe<TipoDocumento>;
};

export type UpdateBudgetInput = {
    branchId: InputMaybe<Scalars['String']>;
    budgetBranch: InputMaybe<BudgetBranchInput>;
    clientId: InputMaybe<Scalars['String']>;
    clientName: InputMaybe<Scalars['String']>;
    description: InputMaybe<Scalars['String']>;
    expectedExpenses: InputMaybe<Array<ExpectedExpenseInput>>;
    manpower: InputMaybe<Array<ManpowerInput>>;
    markup: InputMaybe<Scalars['Float']>;
    price: InputMaybe<Scalars['Float']>;
    subject: InputMaybe<Scalars['String']>;
};

export type UpdateBudgetStatusInput = {
    status: BudgetStatus;
};

export type UpdateExpenseAdministrativeInput = {
    administrativeNotes: InputMaybe<Scalars['String']>;
    fileKeys: InputMaybe<Array<Scalars['String']>>;
    filenames: InputMaybe<Array<Scalars['String']>>;
    mimeTypes: InputMaybe<Array<Scalars['String']>>;
    sizes: InputMaybe<Array<Scalars['Int']>>;
};

export type UpdateMyTaskInput = {
    actNumber: InputMaybe<Scalars['String']>;
    closedAt: InputMaybe<Scalars['DateTime']>;
    expenseIdsToDelete: InputMaybe<Array<Scalars['String']>>;
    expenses: InputMaybe<Array<ExpenseInput>>;
    id: Scalars['String'];
    imageIdsToDelete: InputMaybe<Array<Scalars['String']>>;
    imageKeys: InputMaybe<Array<Scalars['String']>>;
    observations: InputMaybe<Scalars['String']>;
    participants: InputMaybe<Array<Scalars['String']>>;
    startedAt: InputMaybe<Scalars['DateTime']>;
    useMaterials: Scalars['Boolean'];
};

export type UploadUrlInfo = {
    __typename?: 'UploadUrlInfo';
    key: Scalars['String'];
    url: Scalars['String'];
    urlExpire: Scalars['String'];
};

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

export type UserCrudPothosRef = {
    __typename?: 'UserCrudPothosRef';
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

export type LogoutMutationVariables = Exact<{ [key: string]: never }>;

export type LogoutMutation = {
    __typename?: 'Mutation';
    logout: { __typename?: 'AuthResult'; success: boolean; message: string | null };
};

export type ChangePasswordMutationVariables = Exact<{
    data: ChangePasswordInput;
}>;

export type ChangePasswordMutation = {
    __typename?: 'Mutation';
    changePassword: {
        __typename?: 'AuthResult';
        success: boolean;
        message: string | null;
    };
};

export type CreateBillingProfileMutationVariables = Exact<{
    input: BillingProfileInput;
}>;

export type CreateBillingProfileMutation = {
    __typename?: 'Mutation';
    createBillingProfile: {
        __typename?: 'BillingProfileCrudResult';
        success: boolean;
        message: string | null;
        billingProfile: {
            __typename?: 'BillingProfile';
            id: string;
            tipoDocumento: TipoDocumento;
            numeroDocumento: string;
            legalName: string;
            IVACondition: IvaCondition;
            comercialAddress: string;
            billingEmails: Array<string>;
            createdAt: any;
            updatedAt: any;
            business: { __typename?: 'Business'; id: string; name: string };
            contacts: Array<{ __typename?: 'Contact'; email: string; fullName: string }>;
        } | null;
    };
};

export type UpdateBillingProfileMutationVariables = Exact<{
    id: Scalars['String'];
    input: UpdateBillingProfileInput;
}>;

export type UpdateBillingProfileMutation = {
    __typename?: 'Mutation';
    updateBillingProfile: {
        __typename?: 'BillingProfileCrudResult';
        success: boolean;
        message: string | null;
        billingProfile: {
            __typename?: 'BillingProfile';
            id: string;
            tipoDocumento: TipoDocumento;
            numeroDocumento: string;
            legalName: string;
            IVACondition: IvaCondition;
            comercialAddress: string;
            billingEmails: Array<string>;
            createdAt: any;
            updatedAt: any;
            business: { __typename?: 'Business'; id: string; name: string };
            contacts: Array<{ __typename?: 'Contact'; email: string; fullName: string }>;
        } | null;
    };
};

export type DeleteBillingProfileMutationVariables = Exact<{
    id: Scalars['String'];
}>;

export type DeleteBillingProfileMutation = {
    __typename?: 'Mutation';
    deleteBillingProfile: {
        __typename?: 'BillingProfileCrudResult';
        success: boolean;
        message: string | null;
        billingProfile: {
            __typename?: 'BillingProfile';
            id: string;
            tipoDocumento: TipoDocumento;
            numeroDocumento: string;
            legalName: string;
            IVACondition: IvaCondition;
            comercialAddress: string;
            billingEmails: Array<string>;
            createdAt: any;
            updatedAt: any;
            business: { __typename?: 'Business'; id: string; name: string };
            contacts: Array<{ __typename?: 'Contact'; email: string; fullName: string }>;
        } | null;
    };
};

export type GetBillingProfilesQueryVariables = Exact<{
    businessId?: InputMaybe<Array<Scalars['String']>>;
    skip?: InputMaybe<Scalars['Int']>;
    take?: InputMaybe<Scalars['Int']>;
    orderBy?: InputMaybe<Scalars['String']>;
    orderDirection?: InputMaybe<Scalars['String']>;
}>;

export type GetBillingProfilesQuery = {
    __typename?: 'Query';
    billingProfilesCount: number;
    billingProfiles: Array<{
        __typename?: 'BillingProfile';
        id: string;
        tipoDocumento: TipoDocumento;
        numeroDocumento: string;
        legalName: string;
        IVACondition: IvaCondition;
        comercialAddress: string;
        billingEmails: Array<string>;
        createdAt: any;
        updatedAt: any;
        business: { __typename?: 'Business'; id: string; name: string };
        contacts: Array<{
            __typename?: 'Contact';
            email: string;
            fullName: string;
            phone: string;
            notes: string;
        }>;
        firstContact: {
            __typename?: 'Contact';
            email: string;
            fullName: string;
            phone: string;
            notes: string;
        } | null;
    }>;
};

export type GetBillingProfileByIdQueryVariables = Exact<{
    id: Scalars['String'];
}>;

export type GetBillingProfileByIdQuery = {
    __typename?: 'Query';
    billingProfileById: {
        __typename?: 'BillingProfile';
        id: string;
        tipoDocumento: TipoDocumento;
        numeroDocumento: string;
        legalName: string;
        IVACondition: IvaCondition;
        comercialAddress: string;
        billingEmails: Array<string>;
        createdAt: any;
        updatedAt: any;
        business: { __typename?: 'Business'; id: string; name: string };
        contacts: Array<{
            __typename?: 'Contact';
            email: string;
            fullName: string;
            phone: string;
            notes: string;
        }>;
        bills: Array<{
            __typename?: 'Bill';
            id: string;
            description: string | null;
            serviceDate: any | null;
            startDate: any | null;
            dueDate: any | null;
            status: BillStatus;
            pointOfSale: number | null;
            caeData: { __typename?: 'CAEData'; comprobanteNumber: string } | null;
            details: Array<{
                __typename?: 'BillDetail';
                quantity: number;
                unitPrice: number;
            }>;
        }>;
    } | null;
};

export type GetBillingProfileByBusinessIdQueryVariables = Exact<{
    businessId: Scalars['String'];
}>;

export type GetBillingProfileByBusinessIdQuery = {
    __typename?: 'Query';
    billingProfileByBusinessId: {
        __typename?: 'BillingProfile';
        id: string;
        tipoDocumento: TipoDocumento;
        numeroDocumento: string;
        legalName: string;
        IVACondition: IvaCondition;
        comercialAddress: string;
        billingEmails: Array<string>;
        createdAt: any;
        updatedAt: any;
        business: { __typename?: 'Business'; id: string; name: string };
        contacts: Array<{
            __typename?: 'Contact';
            email: string;
            fullName: string;
            phone: string;
            notes: string;
        }>;
    } | null;
};

export type GetBusinessesWithoutBillingProfileQueryVariables = Exact<{
    skip?: InputMaybe<Scalars['Int']>;
    take?: InputMaybe<Scalars['Int']>;
}>;

export type GetBusinessesWithoutBillingProfileQuery = {
    __typename?: 'Query';
    businesses: Array<{ __typename?: 'Business'; id: string; name: string }>;
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

export type GetClientBranchesQueryVariables = Exact<{
    clientId: Scalars['String'];
    cityId: InputMaybe<Array<Scalars['String']>>;
    businessId: InputMaybe<Array<Scalars['String']>>;
    skip: InputMaybe<Scalars['Int']>;
    take: InputMaybe<Scalars['Int']>;
}>;

export type GetClientBranchesQuery = {
    __typename?: 'Query';
    clientBranchesCount: number;
    clientBranches: Array<{
        __typename?: 'Branch';
        id: string;
        number: number | null;
        name: string | null;
        city: {
            __typename?: 'City';
            id: string;
            name: string;
            province: { __typename?: 'Province'; id: string; name: string };
        };
        businesses: Array<{ __typename?: 'Business'; id: string; name: string }>;
    }>;
};

export type GetBranchesQueryVariables = Exact<{ [key: string]: never }>;

export type GetBranchesQuery = {
    __typename?: 'Query';
    branches: Array<{
        __typename?: 'Branch';
        id: string;
        number: number | null;
        name: string | null;
        city: { __typename?: 'City'; id: string; name: string };
        businesses: Array<{ __typename?: 'Business'; id: string; name: string }>;
        client: { __typename?: 'Client'; id: string; name: string };
    }>;
};

export type GetBranchQueryVariables = Exact<{
    id: Scalars['String'];
}>;

export type GetBranchQuery = {
    __typename?: 'Query';
    branch: {
        __typename?: 'Branch';
        id: string;
        number: number | null;
        name: string | null;
        city: {
            __typename?: 'City';
            id: string;
            name: string;
            province: { __typename?: 'Province'; id: string; name: string };
        };
        client: { __typename?: 'Client'; id: string; name: string };
        businesses: Array<{ __typename?: 'Business'; id: string; name: string }>;
    };
};

export type GetBudgetsQueryVariables = Exact<{
    search: InputMaybe<Scalars['String']>;
    clientId: InputMaybe<Array<Scalars['String']>>;
    businessId: InputMaybe<Array<Scalars['String']>>;
    skip: InputMaybe<Scalars['Int']>;
    take: InputMaybe<Scalars['Int']>;
    orderBy: InputMaybe<Scalars['String']>;
    orderDirection: InputMaybe<Scalars['String']>;
}>;

export type GetBudgetsQuery = {
    __typename?: 'Query';
    budgetsCount: number;
    budgets: Array<{
        __typename?: 'Budget';
        id: string;
        budgetNumber: number;
        subject: string;
        description: string | null;
        price: number;
        status: BudgetStatus;
        clientName: string | null;
        createdAt: any;
        updatedAt: any;
        markup: number | null;
        totalExpectedExpenses: number;
        expectedExpenses: Array<{
            __typename?: 'ExpectedExpense';
            type: ExpenseType;
            unitPrice: number;
            quantity: number;
            amount: number;
        }>;
        manpower: Array<{
            __typename?: 'Manpower';
            technician: string;
            payAmount: number;
        }>;
        billingProfile: {
            __typename?: 'BillingProfile';
            id: string;
            business: { __typename?: 'Business'; id: string; name: string };
        };
        client: { __typename?: 'Client'; id: string; name: string } | null;
        branch: {
            __typename?: 'Branch';
            id: string;
            name: string | null;
            number: number | null;
        } | null;
        createdBy: { __typename?: 'User'; id: string; fullName: string };
    }>;
};

export type GetBudgetByIdQueryVariables = Exact<{
    id: Scalars['String'];
}>;

export type GetBudgetByIdQuery = {
    __typename?: 'Query';
    budgetById: {
        __typename?: 'Budget';
        id: string;
        budgetNumber: number;
        subject: string;
        description: string | null;
        price: number;
        status: BudgetStatus;
        clientName: string | null;
        createdAt: any;
        updatedAt: any;
        markup: number | null;
        totalExpectedExpenses: number;
        expectedExpenses: Array<{
            __typename?: 'ExpectedExpense';
            type: ExpenseType;
            unitPrice: number;
            quantity: number;
            amount: number;
        }>;
        manpower: Array<{
            __typename?: 'Manpower';
            technician: string;
            payAmount: number;
        }>;
        budgetBranch: {
            __typename?: 'BudgetBranch';
            name: string | null;
            number: number | null;
        } | null;
        billingProfile: {
            __typename?: 'BillingProfile';
            id: string;
            legalName: string;
            tipoDocumento: TipoDocumento;
            numeroDocumento: string;
            IVACondition: IvaCondition;
            comercialAddress: string;
            billingEmails: Array<string>;
            contacts: Array<{
                __typename?: 'Contact';
                email: string;
                fullName: string;
                phone: string;
                notes: string;
            }>;
            business: { __typename?: 'Business'; id: string; name: string };
        };
        client: { __typename?: 'Client'; id: string; name: string } | null;
        branch: {
            __typename?: 'Branch';
            id: string;
            name: string | null;
            number: number | null;
        } | null;
        createdBy: { __typename?: 'User'; id: string; fullName: string };
    } | null;
};

export type SearchGmailThreadsQueryVariables = Exact<{
    query: InputMaybe<Scalars['String']>;
}>;

export type SearchGmailThreadsQuery = {
    __typename?: 'Query';
    searchBudgetThreads: {
        __typename?: 'GmailThreadsResult';
        success: boolean;
        message: string | null;
        threads: Array<{
            __typename?: 'GmailThread';
            id: string;
            subject: string | null;
            snippet: string;
            historyId: string;
            messages: Array<{
                __typename?: 'GmailMessage';
                id: string;
                threadId: string;
                labelIds: Array<string>;
                snippet: string;
            }>;
        }> | null;
    };
};

export type GetBusinessesWithBillingProfilesQueryVariables = Exact<{
    search: InputMaybe<Scalars['String']>;
    skip: InputMaybe<Scalars['Int']>;
    take: InputMaybe<Scalars['Int']>;
}>;

export type GetBusinessesWithBillingProfilesQuery = {
    __typename?: 'Query';
    businesses: Array<{
        __typename?: 'Business';
        id: string;
        name: string;
        billingProfile: {
            __typename?: 'BillingProfile';
            id: string;
            legalName: string;
            tipoDocumento: TipoDocumento;
            numeroDocumento: string;
            IVACondition: IvaCondition;
            billingEmails: Array<string>;
            comercialAddress: string;
        };
    }>;
};

export type GetClientBranchesByBusinessQueryVariables = Exact<{
    clientId: Scalars['String'];
    businessId: Scalars['String'];
}>;

export type GetClientBranchesByBusinessQuery = {
    __typename?: 'Query';
    clientBranchesByBusiness: Array<{
        __typename?: 'Branch';
        id: string;
        name: string | null;
        number: number | null;
        city: {
            __typename?: 'City';
            id: string;
            name: string;
            province: { __typename?: 'Province'; id: string; name: string };
        };
    }>;
};

export type CreateBudgetMutationVariables = Exact<{
    input: BudgetInput;
}>;

export type CreateBudgetMutation = {
    __typename?: 'Mutation';
    createBudget: {
        __typename?: 'BudgetCrudResult';
        success: boolean;
        message: string | null;
        budget: {
            __typename?: 'Budget';
            id: string;
            subject: string;
            description: string | null;
            price: number;
            status: BudgetStatus;
            createdAt: any;
            billingProfile: {
                __typename?: 'BillingProfile';
                id: string;
                legalName: string;
                business: { __typename?: 'Business'; id: string; name: string };
            };
            client: { __typename?: 'Client'; id: string; name: string } | null;
            branch: {
                __typename?: 'Branch';
                id: string;
                name: string | null;
                number: number | null;
            } | null;
            createdBy: { __typename?: 'User'; id: string; fullName: string };
        } | null;
    };
};

export type UpdateBudgetMutationVariables = Exact<{
    id: Scalars['String'];
    input: UpdateBudgetInput;
}>;

export type UpdateBudgetMutation = {
    __typename?: 'Mutation';
    updateBudget: {
        __typename?: 'BudgetCrudResult';
        success: boolean;
        message: string | null;
        budget: {
            __typename?: 'Budget';
            id: string;
            subject: string;
            description: string | null;
            price: number;
            status: BudgetStatus;
            updatedAt: any;
            billingProfile: {
                __typename?: 'BillingProfile';
                id: string;
                legalName: string;
                business: { __typename?: 'Business'; id: string; name: string };
            };
            client: { __typename?: 'Client'; id: string; name: string } | null;
            branch: {
                __typename?: 'Branch';
                id: string;
                name: string | null;
                number: number | null;
            } | null;
        } | null;
    };
};

export type DeleteBudgetMutationVariables = Exact<{
    id: Scalars['String'];
}>;

export type DeleteBudgetMutation = {
    __typename?: 'Mutation';
    deleteBudget: {
        __typename?: 'BudgetCrudResult';
        success: boolean;
        message: string | null;
    };
};

export type UpdateBudgetStatusMutationVariables = Exact<{
    id: Scalars['String'];
    input: UpdateBudgetStatusInput;
}>;

export type UpdateBudgetStatusMutation = {
    __typename?: 'Mutation';
    updateBudgetStatus: {
        __typename?: 'BudgetCrudResult';
        success: boolean;
        message: string | null;
        budget: {
            __typename?: 'Budget';
            id: string;
            subject: string;
            description: string | null;
            price: number;
            status: BudgetStatus;
            createdAt: any;
            updatedAt: any;
            billingProfile: {
                __typename?: 'BillingProfile';
                id: string;
                business: { __typename?: 'Business'; id: string; name: string };
            };
            createdBy: { __typename?: 'User'; id: string; fullName: string };
        } | null;
    };
};

export type CreateBudgetWithBillingProfileMutationVariables = Exact<{
    input: CreateBudgetWithBillingProfileInput;
}>;

export type CreateBudgetWithBillingProfileMutation = {
    __typename?: 'Mutation';
    createBudgetWithBillingProfile: {
        __typename?: 'BudgetCrudResult';
        success: boolean;
        message: string | null;
        budget: {
            __typename?: 'Budget';
            id: string;
            subject: string;
            description: string | null;
            price: number;
            status: BudgetStatus;
            createdAt: any;
            billingProfile: {
                __typename?: 'BillingProfile';
                id: string;
                legalName: string;
                business: { __typename?: 'Business'; id: string; name: string };
            };
            client: { __typename?: 'Client'; id: string; name: string } | null;
            branch: {
                __typename?: 'Branch';
                id: string;
                name: string | null;
                number: number | null;
            } | null;
            createdBy: { __typename?: 'User'; id: string; fullName: string };
        } | null;
    };
};

export type CreateBusinessMutationVariables = Exact<{
    data: BusinessInput;
}>;

export type CreateBusinessMutation = {
    __typename?: 'Mutation';
    createBusiness: {
        __typename?: 'BusinessResult';
        success: boolean;
        message: string | null;
        business: { __typename?: 'Business'; id: string; name: string } | null;
    };
};

export type UpdateBusinessMutationVariables = Exact<{
    id: Scalars['String'];
    data: BusinessInput;
}>;

export type UpdateBusinessMutation = {
    __typename?: 'Mutation';
    updateBusiness: {
        __typename?: 'BusinessResult';
        success: boolean;
        message: string | null;
        business: { __typename?: 'Business'; id: string; name: string } | null;
    };
};

export type DeleteBusinessMutationVariables = Exact<{
    id: Scalars['String'];
}>;

export type DeleteBusinessMutation = {
    __typename?: 'Mutation';
    deleteBusiness: {
        __typename?: 'BusinessResult';
        success: boolean;
        message: string | null;
        business: { __typename?: 'Business'; id: string; name: string } | null;
    };
};

export type GetBusinessQueryVariables = Exact<{
    id: Scalars['String'];
}>;

export type GetBusinessQuery = {
    __typename?: 'Query';
    business: { __typename?: 'Business'; id: string; name: string };
};

export type GetBusinessesQueryVariables = Exact<{
    search?: InputMaybe<Scalars['String']>;
    skip?: InputMaybe<Scalars['Int']>;
    take?: InputMaybe<Scalars['Int']>;
}>;

export type GetBusinessesQuery = {
    __typename?: 'Query';
    businessesCount: number;
    businesses: Array<{ __typename?: 'Business'; id: string; name: string }>;
};

export type GetCitiesQueryVariables = Exact<{
    search?: InputMaybe<Scalars['String']>;
    skip?: InputMaybe<Scalars['Int']>;
    take?: InputMaybe<Scalars['Int']>;
    provinceId?: InputMaybe<Scalars['String']>;
}>;

export type GetCitiesQuery = {
    __typename?: 'Query';
    citiesCount: number;
    cities: Array<{
        __typename?: 'City';
        id: string;
        name: string;
        province: { __typename?: 'Province'; id: string; name: string };
    }>;
};

export type GetCityQueryVariables = Exact<{
    id: Scalars['String'];
}>;

export type GetCityQuery = {
    __typename?: 'Query';
    city: {
        __typename?: 'City';
        id: string;
        name: string;
        province: { __typename?: 'Province'; id: string; name: string };
    };
};

export type CreateCityMutationVariables = Exact<{
    input: CityInput;
}>;

export type CreateCityMutation = {
    __typename?: 'Mutation';
    createCity: {
        __typename?: 'CityCrudRef';
        success: boolean;
        message: string | null;
        city: {
            __typename?: 'City';
            id: string;
            name: string;
            province: { __typename?: 'Province'; id: string; name: string };
        } | null;
    };
};

export type UpdateCityMutationVariables = Exact<{
    id: Scalars['String'];
    input: CityInput;
}>;

export type UpdateCityMutation = {
    __typename?: 'Mutation';
    updateCity: {
        __typename?: 'CityCrudRef';
        success: boolean;
        message: string | null;
        city: {
            __typename?: 'City';
            id: string;
            name: string;
            province: { __typename?: 'Province'; id: string; name: string };
        } | null;
    };
};

export type DeleteCityMutationVariables = Exact<{
    id: Scalars['String'];
}>;

export type DeleteCityMutation = {
    __typename?: 'Mutation';
    deleteCity: {
        __typename?: 'CityCrudRef';
        success: boolean;
        message: string | null;
        city: { __typename?: 'City'; id: string; name: string } | null;
    };
};

export type CreateClientMutationVariables = Exact<{
    data: ClientInput;
}>;

export type CreateClientMutation = {
    __typename?: 'Mutation';
    createClient: {
        __typename?: 'ClientResult';
        success: boolean;
        message: string | null;
        client: { __typename?: 'Client'; id: string; name: string } | null;
    };
};

export type UpdateClientMutationVariables = Exact<{
    id: Scalars['String'];
    data: ClientInput;
}>;

export type UpdateClientMutation = {
    __typename?: 'Mutation';
    updateClient: {
        __typename?: 'ClientResult';
        success: boolean;
        message: string | null;
        client: { __typename?: 'Client'; id: string; name: string } | null;
    };
};

export type GetClientQueryVariables = Exact<{
    id: Scalars['String'];
}>;

export type GetClientQuery = {
    __typename?: 'Query';
    client: { __typename?: 'Client'; id: string; name: string };
};

export type GetClientsQueryVariables = Exact<{
    search?: InputMaybe<Scalars['String']>;
    skip?: InputMaybe<Scalars['Int']>;
    take?: InputMaybe<Scalars['Int']>;
}>;

export type GetClientsQuery = {
    __typename?: 'Query';
    clientsCount: number;
    clients: Array<{ __typename?: 'Client'; id: string; name: string }>;
};

export type GetClientsWithBranchesQueryVariables = Exact<{ [key: string]: never }>;

export type GetClientsWithBranchesQuery = {
    __typename?: 'Query';
    clients: Array<{
        __typename?: 'Client';
        id: string;
        name: string;
        branches: Array<{
            __typename?: 'Branch';
            id: string;
            number: number | null;
            name: string | null;
            businesses: Array<{ __typename?: 'Business'; id: string; name: string }>;
            city: { __typename?: 'City'; id: string; name: string };
        }>;
    }>;
};

export type GetClientsByBusinessQueryVariables = Exact<{
    businessId: Scalars['String'];
    search?: InputMaybe<Scalars['String']>;
}>;

export type GetClientsByBusinessQuery = {
    __typename?: 'Query';
    clientsByBusiness: Array<{
        __typename?: 'Client';
        id: string;
        name: string;
        branches: Array<{
            __typename?: 'Branch';
            id: string;
            number: number | null;
            name: string | null;
            city: { __typename?: 'City'; id: string; name: string };
        }>;
    }>;
};

export type DeleteClientMutationVariables = Exact<{
    id: Scalars['String'];
}>;

export type DeleteClientMutation = {
    __typename?: 'Mutation';
    deleteClient: {
        __typename?: 'ClientResult';
        success: boolean;
        message: string | null;
        client: { __typename?: 'Client'; id: string; name: string } | null;
    };
};

export type GetExpenseQueryVariables = Exact<{
    id: Scalars['String'];
}>;

export type GetExpenseQuery = {
    __typename?: 'Query';
    expenseById: {
        __typename?: 'Expense';
        id: string;
        amount: number;
        discountAmount: number | null;
        expenseType: ExpenseType;
        expenseNumber: string;
        cityName: string | null;
        paySource: ExpensePaySource;
        paySourceBank: ExpensePaySourceBank | null;
        invoiceType: ExpenseInvoiceType;
        status: ExpenseStatus;
        doneBy: string;
        observations: string | null;
        administrativeNotes: string | null;
        installments: number | null;
        expenseDate: any | null;
        createdAt: any;
        task: { __typename?: 'Task'; id: string; taskNumber: number } | null;
        registeredBy: { __typename?: 'User'; id: string; fullName: string };
        images: Array<{ __typename?: 'Image'; id: string; url: string }>;
        files: Array<{
            __typename?: 'File';
            id: string;
            url: string;
            mimeType: string;
            filename: string;
        }>;
        attachmentFiles: Array<{
            __typename?: 'AttachmentFile';
            url: string;
            mimeType: string;
            filename: string;
            key: string;
            size: number;
            urlExpire: any | null;
        }>;
        auditor: { __typename?: 'User'; id: string; fullName: string } | null;
    } | null;
};

export type GetExpensesQueryVariables = Exact<{
    registeredBy: InputMaybe<Array<Scalars['String']>>;
    status: InputMaybe<Array<ExpenseStatus>>;
    expenseType: InputMaybe<Array<ExpenseType>>;
    paySource: InputMaybe<Array<ExpensePaySource>>;
    expenseDateFrom: InputMaybe<Scalars['DateTime']>;
    expenseDateTo: InputMaybe<Scalars['DateTime']>;
    skip: InputMaybe<Scalars['Int']>;
    take: InputMaybe<Scalars['Int']>;
    orderBy: InputMaybe<Scalars['String']>;
    orderDirection: InputMaybe<Scalars['String']>;
}>;

export type GetExpensesQuery = {
    __typename?: 'Query';
    expensesCount: number;
    expenses: Array<{
        __typename?: 'Expense';
        id: string;
        expenseNumber: string;
        amount: number;
        discountAmount: number | null;
        expenseType: ExpenseType;
        paySource: ExpensePaySource;
        paySourceBank: ExpensePaySourceBank | null;
        invoiceType: ExpenseInvoiceType;
        installments: number | null;
        expenseDate: any | null;
        observations: string | null;
        administrativeNotes: string | null;
        doneBy: string;
        status: ExpenseStatus;
        task: {
            __typename?: 'Task';
            id: string;
            taskNumber: number;
            businessName: string | null;
            clientName: string | null;
            business: { __typename?: 'Business'; name: string } | null;
            branch: {
                __typename?: 'Branch';
                number: number | null;
                client: { __typename?: 'Client'; name: string };
                city: { __typename?: 'City'; name: string };
            } | null;
        } | null;
        registeredBy: { __typename?: 'User'; id: string; fullName: string };
    }>;
};

export type DeleteExpenseMutationVariables = Exact<{
    id: Scalars['String'];
    taskId: Scalars['String'];
}>;

export type DeleteExpenseMutation = {
    __typename?: 'Mutation';
    deleteExpense: {
        __typename?: 'ExpenseCrudResult';
        success: boolean;
        message: string | null;
        expense: { __typename?: 'Expense'; id: string } | null;
    };
};

export type GenerateApprovedExpensesReportMutationVariables = Exact<{
    startDate: Scalars['DateTime'];
    endDate: Scalars['DateTime'];
}>;

export type GenerateApprovedExpensesReportMutation = {
    __typename?: 'Mutation';
    generateApprovedExpensesReport: string;
};

export type UpdateExpenseStatusMutationVariables = Exact<{
    expenseId: Scalars['String'];
    status: ExpenseStatus;
}>;

export type UpdateExpenseStatusMutation = {
    __typename?: 'Mutation';
    updateExpenseStatus: {
        __typename?: 'ExpenseCrudResult';
        success: boolean;
        message: string | null;
        expense: {
            __typename?: 'Expense';
            id: string;
            amount: number;
            expenseType: ExpenseType;
            paySource: ExpensePaySource;
            paySourceBank: ExpensePaySourceBank | null;
            installments: number | null;
            task: {
                __typename?: 'Task';
                id: string;
                expenses: Array<{
                    __typename?: 'Expense';
                    id: string;
                    status: ExpenseStatus;
                }>;
            } | null;
        } | null;
    };
};

export type UpdateExpenseDiscountAmountMutationVariables = Exact<{
    expenseId: Scalars['String'];
    discountAmount: InputMaybe<Scalars['Float']>;
}>;

export type UpdateExpenseDiscountAmountMutation = {
    __typename?: 'Mutation';
    updateExpenseDiscountAmount: {
        __typename?: 'ExpenseCrudResult';
        success: boolean;
        message: string | null;
        expense: {
            __typename?: 'Expense';
            id: string;
            amount: number;
            discountAmount: number | null;
        } | null;
    };
};

export type CreateExpenseMutationVariables = Exact<{
    taskId: InputMaybe<Scalars['String']>;
    expenseData: ExpenseInput;
}>;

export type CreateExpenseMutation = {
    __typename?: 'Mutation';
    createExpense: {
        __typename?: 'ExpenseCrudResult';
        success: boolean;
        message: string | null;
        expense: {
            __typename?: 'Expense';
            id: string;
            amount: number;
            expenseType: ExpenseType;
            paySource: ExpensePaySource;
            paySourceBank: ExpensePaySourceBank | null;
            installments: number | null;
            expenseDate: any | null;
            doneBy: string;
            cityName: string | null;
            observations: string | null;
            expenseNumber: string;
            status: ExpenseStatus;
        } | null;
    };
};

export type UpdateExpenseAdministrativeMutationVariables = Exact<{
    id: Scalars['String'];
    input: UpdateExpenseAdministrativeInput;
}>;

export type UpdateExpenseAdministrativeMutation = {
    __typename?: 'Mutation';
    updateExpenseAdministrative: {
        __typename?: 'ExpenseCrudResult';
        success: boolean;
        message: string | null;
        expense: {
            __typename?: 'Expense';
            id: string;
            administrativeNotes: string | null;
            attachmentFiles: Array<{
                __typename?: 'AttachmentFile';
                filename: string;
                url: string;
                mimeType: string;
                key: string;
                size: number;
                urlExpire: any | null;
            }>;
        } | null;
    };
};

export type GenerateUploadUrlsMutationVariables = Exact<{
    fileCount: Scalars['Int'];
    prefix: Scalars['String'];
    mimeTypes: Array<Scalars['String']>;
}>;

export type GenerateUploadUrlsMutation = {
    __typename?: 'Mutation';
    generateUploadUrls: {
        __typename?: 'PresignedUrlResponse';
        success: boolean;
        message: string | null;
        uploadUrls: Array<{
            __typename?: 'UploadUrlInfo';
            url: string;
            key: string;
            urlExpire: string;
        }>;
    };
};

export type GeneratePresignedUrlsMutationVariables = Exact<{
    fileCount: Scalars['Int'];
    prefix: Scalars['String'];
    mimeTypes: Array<Scalars['String']>;
}>;

export type GeneratePresignedUrlsMutation = {
    __typename?: 'Mutation';
    generatePresignedUrls: {
        __typename?: 'GeneratePresignedUrlsResponse';
        success: boolean;
        message: string | null;
        presignedUrls: Array<{
            __typename?: 'PresignedUrlInfo';
            url: string;
            key: string;
            expiresIn: number;
        }>;
    };
};

export type GetPreventivesQueryVariables = Exact<{
    skip: InputMaybe<Scalars['Int']>;
    take: InputMaybe<Scalars['Int']>;
    business: InputMaybe<Array<Scalars['String']>>;
    city: InputMaybe<Array<Scalars['String']>>;
    assigned: InputMaybe<Array<Scalars['String']>>;
    client: InputMaybe<Array<Scalars['String']>>;
    frequency: InputMaybe<Array<PreventiveFrequency>>;
    months: InputMaybe<Array<Scalars['String']>>;
    status: InputMaybe<Array<PreventiveStatus>>;
}>;

export type GetPreventivesQuery = {
    __typename?: 'Query';
    preventivesCount: number;
    preventives: Array<{
        __typename?: 'Preventive';
        id: string;
        lastDoneAt: any | null;
        batteryChangedAt: any | null;
        frequency: PreventiveFrequency | null;
        months: Array<string>;
        observations: string | null;
        status: PreventiveStatus;
        business: { __typename?: 'Business'; id: string; name: string };
        branch: {
            __typename?: 'Branch';
            id: string;
            number: number | null;
            client: { __typename?: 'Client'; id: string; name: string };
            city: {
                __typename?: 'City';
                id: string;
                name: string;
                province: { __typename?: 'Province'; id: string; name: string };
            };
        };
        assigned: Array<{ __typename?: 'User'; id: string; fullName: string }>;
    }>;
};

export type GetPreventiveQueryVariables = Exact<{
    id: Scalars['String'];
}>;

export type GetPreventiveQuery = {
    __typename?: 'Query';
    preventive: {
        __typename?: 'Preventive';
        id: string;
        lastDoneAt: any | null;
        batteryChangedAt: any | null;
        frequency: PreventiveFrequency | null;
        months: Array<string>;
        observations: string | null;
        status: PreventiveStatus;
        business: { __typename?: 'Business'; id: string; name: string };
        branch: {
            __typename?: 'Branch';
            id: string;
            number: number | null;
            client: { __typename?: 'Client'; id: string; name: string };
            city: { __typename?: 'City'; id: string; name: string };
        };
        assigned: Array<{ __typename?: 'User'; id: string; fullName: string }>;
        tasks: Array<{
            __typename?: 'Task';
            id: string;
            taskNumber: number;
            createdAt: any;
            closedAt: any | null;
            status: TaskStatus;
        }>;
    };
};

export type CreatePreventiveMutationVariables = Exact<{
    input: PreventiveInput;
}>;

export type CreatePreventiveMutation = {
    __typename?: 'Mutation';
    createPreventive: {
        __typename?: 'PreventiveCrudRef';
        success: boolean;
        message: string | null;
        preventive: { __typename?: 'Preventive'; id: string } | null;
    };
};

export type UpdatePreventiveMutationVariables = Exact<{
    id: Scalars['String'];
    input: PreventiveInput;
}>;

export type UpdatePreventiveMutation = {
    __typename?: 'Mutation';
    updatePreventive: {
        __typename?: 'PreventiveCrudRef';
        success: boolean;
        message: string | null;
        preventive: { __typename?: 'Preventive'; id: string } | null;
    };
};

export type DeletePreventiveMutationVariables = Exact<{
    id: Scalars['String'];
}>;

export type DeletePreventiveMutation = {
    __typename?: 'Mutation';
    deletePreventive: {
        __typename?: 'PreventiveCrudRef';
        success: boolean;
        message: string | null;
        preventive: { __typename?: 'Preventive'; id: string } | null;
    };
};

export type GetProvincesQueryVariables = Exact<{
    search?: InputMaybe<Scalars['String']>;
    skip?: InputMaybe<Scalars['Int']>;
    take?: InputMaybe<Scalars['Int']>;
}>;

export type GetProvincesQuery = {
    __typename?: 'Query';
    provincesCount: number;
    provinces: Array<{ __typename?: 'Province'; id: string; name: string }>;
};

export type GetProvinceQueryVariables = Exact<{
    id: Scalars['String'];
}>;

export type GetProvinceQuery = {
    __typename?: 'Query';
    province: { __typename?: 'Province'; id: string; name: string };
};

export type CreateProvinceMutationVariables = Exact<{
    data: ProvinceInput;
}>;

export type CreateProvinceMutation = {
    __typename?: 'Mutation';
    createProvince: {
        __typename?: 'ProvinceCrudResult';
        success: boolean;
        message: string | null;
        province: { __typename?: 'Province'; id: string; name: string } | null;
    };
};

export type UpdateProvinceMutationVariables = Exact<{
    id: Scalars['String'];
    data: ProvinceInput;
}>;

export type UpdateProvinceMutation = {
    __typename?: 'Mutation';
    updateProvince: {
        __typename?: 'ProvinceCrudResult';
        success: boolean;
        message: string | null;
        province: { __typename?: 'Province'; id: string; name: string } | null;
    };
};

export type DeleteProvinceMutationVariables = Exact<{
    id: Scalars['String'];
}>;

export type DeleteProvinceMutation = {
    __typename?: 'Mutation';
    deleteProvince: {
        __typename?: 'ProvinceCrudResult';
        success: boolean;
        message: string | null;
        province: { __typename?: 'Province'; id: string; name: string } | null;
    };
};

export type TasksQueryVariables = Exact<{
    assigned: InputMaybe<Array<Scalars['String']>>;
    business: InputMaybe<Array<Scalars['String']>>;
    city: InputMaybe<Array<Scalars['String']>>;
    status: InputMaybe<Array<TaskStatus>>;
    client: InputMaybe<Array<Scalars['String']>>;
    taskType: InputMaybe<Array<TaskType>>;
    startDate: InputMaybe<Scalars['DateTime']>;
    endDate: InputMaybe<Scalars['DateTime']>;
    skip: InputMaybe<Scalars['Int']>;
    take: InputMaybe<Scalars['Int']>;
    orderBy: InputMaybe<Scalars['String']>;
    orderDirection: InputMaybe<Scalars['String']>;
}>;

export type TasksQuery = {
    __typename?: 'Query';
    tasksCount: number;
    tasks: Array<{
        __typename?: 'Task';
        id: string;
        useMaterials: boolean | null;
        taskNumber: number;
        createdAt: any;
        startedAt: any | null;
        closedAt: any | null;
        description: string;
        participants: Array<string>;
        businessName: string | null;
        clientName: string | null;
        taskType: TaskType;
        status: TaskStatus;
        preventive: {
            __typename?: 'Preventive';
            id: string;
            frequency: PreventiveFrequency | null;
        } | null;
        business: { __typename?: 'Business'; id: string; name: string } | null;
        branch: {
            __typename?: 'Branch';
            id: string;
            number: number | null;
            name: string | null;
            city: {
                __typename?: 'City';
                id: string;
                name: string;
                province: { __typename?: 'Province'; id: string; name: string };
            };
            client: { __typename?: 'Client'; id: string; name: string };
        } | null;
        assigned: Array<{ __typename?: 'User'; id: string; fullName: string }>;
        expenses: Array<{ __typename?: 'Expense'; amount: number }>;
    }>;
};

export type GetTaskQueryVariables = Exact<{
    id: Scalars['String'];
}>;

export type GetTaskQuery = {
    __typename?: 'Query';
    taskById: {
        __typename?: 'Task';
        id: string;
        useMaterials: boolean | null;
        taskNumber: number;
        startedAt: any | null;
        createdAt: any;
        closedAt: any | null;
        description: string;
        actNumber: number | null;
        observations: string | null;
        clientName: string | null;
        businessName: string | null;
        participants: Array<string>;
        taskType: TaskType;
        status: TaskStatus;
        movitecTicket: string | null;
        preventive: {
            __typename?: 'Preventive';
            id: string;
            frequency: PreventiveFrequency | null;
        } | null;
        business: { __typename?: 'Business'; id: string; name: string } | null;
        images: Array<{ __typename?: 'Image'; id: string; url: string }>;
        branch: {
            __typename?: 'Branch';
            id: string;
            number: number | null;
            name: string | null;
            city: {
                __typename?: 'City';
                id: string;
                name: string;
                province: { __typename?: 'Province'; id: string; name: string };
            };
            client: { __typename?: 'Client'; id: string; name: string };
        } | null;
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
            expenseNumber: string;
            amount: number;
            paySource: ExpensePaySource;
            paySourceBank: ExpensePaySourceBank | null;
            expenseType: ExpenseType;
            observations: string | null;
            createdAt: any;
            installments: number | null;
            expenseDate: any | null;
            status: ExpenseStatus;
            doneBy: string;
            images: Array<{
                __typename?: 'Image';
                id: string;
                url: string;
                urlExpire: any | null;
                key: string;
            }>;
            files: Array<{
                __typename?: 'File';
                id: string;
                url: string;
                key: string;
                mimeType: string;
                filename: string;
            }>;
            registeredBy: { __typename?: 'User'; fullName: string };
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

export type UpdateTaskStatusMutationVariables = Exact<{
    id: Scalars['String'];
    status: TaskStatus;
}>;

export type UpdateTaskStatusMutation = {
    __typename?: 'Mutation';
    updateTaskStatus: {
        __typename?: 'TaskCrudResult';
        success: boolean;
        message: string | null;
        task: { __typename?: 'Task'; id: string; status: TaskStatus } | null;
    };
};

export type GenerateApprovedTasksReportMutationVariables = Exact<{
    startDate: Scalars['DateTime'];
    endDate: Scalars['DateTime'];
}>;

export type GenerateApprovedTasksReportMutation = {
    __typename?: 'Mutation';
    generateApprovedTasksReport: string;
};

export type GetTaskPhotosKeysQueryVariables = Exact<{
    startDate: Scalars['DateTime'];
    endDate: Scalars['DateTime'];
    businessId: InputMaybe<Scalars['String']>;
}>;

export type GetTaskPhotosKeysQuery = {
    __typename?: 'Query';
    getTaskPhotosWithInfo: Array<string>;
};

export type DownloadTaskPhotosMutationVariables = Exact<{
    startDate: Scalars['DateTime'];
    endDate: Scalars['DateTime'];
    businessId: InputMaybe<Scalars['String']>;
}>;

export type DownloadTaskPhotosMutation = {
    __typename?: 'Mutation';
    downloadTaskPhotos: {
        __typename?: 'DownloadTaskPhotosResult';
        success: boolean;
        url: string | null;
        message: string | null;
    };
};

export type GetUsersQueryVariables = Exact<{
    search?: InputMaybe<Scalars['String']>;
    skip?: InputMaybe<Scalars['Int']>;
    take?: InputMaybe<Scalars['Int']>;
    cityId: InputMaybe<Array<Scalars['String']>>;
    roles: InputMaybe<Array<Role>>;
}>;

export type GetUsersQuery = {
    __typename?: 'Query';
    usersCount: number;
    users: Array<{
        __typename?: 'User';
        id: string;
        fullName: string;
        email: string;
        roles: Array<Role>;
        city: { __typename?: 'City'; id: string; name: string } | null;
    }>;
};

export type GetTechniciansQueryVariables = Exact<{ [key: string]: never }>;

export type GetTechniciansQuery = {
    __typename?: 'Query';
    technicians: Array<{
        __typename?: 'User';
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        fullName: string;
        roles: Array<Role>;
        city: { __typename?: 'City'; id: string; name: string } | null;
    }>;
};

export type CreateUserMutationVariables = Exact<{
    input: UserInput;
}>;

export type CreateUserMutation = {
    __typename?: 'Mutation';
    createUser: {
        __typename?: 'UserCrudPothosRef';
        success: boolean;
        message: string | null;
        user: {
            __typename?: 'User';
            id: string;
            fullName: string;
            email: string;
            roles: Array<Role>;
            city: { __typename?: 'City'; id: string; name: string } | null;
        } | null;
    };
};

export type UpdateUserMutationVariables = Exact<{
    id: Scalars['String'];
    input: UserInput;
}>;

export type UpdateUserMutation = {
    __typename?: 'Mutation';
    updateUser: {
        __typename?: 'UserCrudPothosRef';
        success: boolean;
        message: string | null;
        user: {
            __typename?: 'User';
            id: string;
            fullName: string;
            email: string;
            roles: Array<Role>;
            city: { __typename?: 'City'; id: string; name: string } | null;
        } | null;
    };
};

export type DeleteUserMutationVariables = Exact<{
    id: Scalars['String'];
}>;

export type DeleteUserMutation = {
    __typename?: 'Mutation';
    deleteUser: {
        __typename?: 'UserCrudPothosRef';
        success: boolean;
        message: string | null;
        user: { __typename?: 'User'; id: string; fullName: string; email: string } | null;
    };
};

export type SendNewUserRandomPasswordMutationVariables = Exact<{
    id: Scalars['String'];
}>;

export type SendNewUserRandomPasswordMutation = {
    __typename?: 'Mutation';
    sendNewUserRandomPassword: {
        __typename?: 'UserCrudPothosRef';
        success: boolean;
        message: string | null;
        user: { __typename?: 'User'; id: string } | null;
    };
};

export type GetUserQueryVariables = Exact<{
    id: Scalars['String'];
}>;

export type GetUserQuery = {
    __typename?: 'Query';
    user: {
        __typename?: 'User';
        firstName: string;
        lastName: string;
        email: string;
        roles: Array<Role>;
        city: { __typename?: 'City'; id: string; name: string } | null;
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
export const LogoutDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'logout' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'logout' },
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
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const ChangePasswordDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'changePassword' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'data' } },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'ChangePasswordInput' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'changePassword' },
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
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const CreateBillingProfileDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'CreateBillingProfile' },
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
                            name: { kind: 'Name', value: 'BillingProfileInput' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createBillingProfile' },
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
                                    name: { kind: 'Name', value: 'success' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'message' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'billingProfile' },
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
                                                    value: 'tipoDocumento',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'numeroDocumento',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'legalName',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'IVACondition',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'comercialAddress',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'billingEmails',
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
                                                name: {
                                                    kind: 'Name',
                                                    value: 'updatedAt',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'business' },
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
                                                name: { kind: 'Name', value: 'contacts' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
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
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    CreateBillingProfileMutation,
    CreateBillingProfileMutationVariables
>;
export const UpdateBillingProfileDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'UpdateBillingProfile' },
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
                            name: { kind: 'Name', value: 'UpdateBillingProfileInput' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updateBillingProfile' },
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
                                    name: { kind: 'Name', value: 'success' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'message' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'billingProfile' },
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
                                                    value: 'tipoDocumento',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'numeroDocumento',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'legalName',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'IVACondition',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'comercialAddress',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'billingEmails',
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
                                                name: {
                                                    kind: 'Name',
                                                    value: 'updatedAt',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'business' },
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
                                                name: { kind: 'Name', value: 'contacts' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
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
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    UpdateBillingProfileMutation,
    UpdateBillingProfileMutationVariables
>;
export const DeleteBillingProfileDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'DeleteBillingProfile' },
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
                        name: { kind: 'Name', value: 'deleteBillingProfile' },
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
                                    name: { kind: 'Name', value: 'success' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'message' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'billingProfile' },
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
                                                    value: 'tipoDocumento',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'numeroDocumento',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'legalName',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'IVACondition',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'comercialAddress',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'billingEmails',
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
                                                name: {
                                                    kind: 'Name',
                                                    value: 'updatedAt',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'business' },
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
                                                name: { kind: 'Name', value: 'contacts' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
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
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    DeleteBillingProfileMutation,
    DeleteBillingProfileMutationVariables
>;
export const GetBillingProfilesDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'GetBillingProfiles' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'businessId' },
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
                    defaultValue: { kind: 'NullValue' },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                    defaultValue: { kind: 'NullValue' },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'take' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                    defaultValue: { kind: 'NullValue' },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'orderBy' },
                    },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    defaultValue: { kind: 'NullValue' },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'orderDirection' },
                    },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    defaultValue: { kind: 'NullValue' },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'billingProfiles' },
                        arguments: [
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
                                name: { kind: 'Name', value: 'skip' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'skip' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'take' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'take' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'orderBy' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'orderBy' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'orderDirection' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'orderDirection' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'tipoDocumento' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'numeroDocumento' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'legalName' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'IVACondition' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'comercialAddress' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'billingEmails' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'createdAt' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'updatedAt' },
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
                                    name: { kind: 'Name', value: 'contacts' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'email' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'fullName' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'phone' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'notes' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'firstContact' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'email' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'fullName' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'phone' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'notes' },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'billingProfilesCount' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'businessId' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'businessId' },
                                },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetBillingProfilesQuery, GetBillingProfilesQueryVariables>;
export const GetBillingProfileByIdDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'GetBillingProfileById' },
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
                        name: { kind: 'Name', value: 'billingProfileById' },
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
                                    name: { kind: 'Name', value: 'tipoDocumento' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'numeroDocumento' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'legalName' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'IVACondition' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'comercialAddress' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'billingEmails' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'createdAt' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'updatedAt' },
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
                                    name: { kind: 'Name', value: 'contacts' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'email' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'fullName' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'phone' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'notes' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'bills' },
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
                                                    value: 'description',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'serviceDate',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'startDate',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'dueDate' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'status' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'pointOfSale',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'caeData' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'comprobanteNumber',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'details' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'quantity',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'unitPrice',
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
} as unknown as DocumentNode<
    GetBillingProfileByIdQuery,
    GetBillingProfileByIdQueryVariables
>;
export const GetBillingProfileByBusinessIdDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'GetBillingProfileByBusinessId' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'businessId' },
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
                        name: { kind: 'Name', value: 'billingProfileByBusinessId' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'businessId' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'businessId' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'tipoDocumento' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'numeroDocumento' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'legalName' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'IVACondition' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'comercialAddress' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'billingEmails' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'createdAt' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'updatedAt' },
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
                                    name: { kind: 'Name', value: 'contacts' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'email' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'fullName' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'phone' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'notes' },
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
} as unknown as DocumentNode<
    GetBillingProfileByBusinessIdQuery,
    GetBillingProfileByBusinessIdQueryVariables
>;
export const GetBusinessesWithoutBillingProfileDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'GetBusinessesWithoutBillingProfile' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                    defaultValue: { kind: 'NullValue' },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'take' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                    defaultValue: { kind: 'NullValue' },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'businesses' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'withoutBillingProfile' },
                                value: { kind: 'BooleanValue', value: true },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'skip' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'skip' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'take' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'take' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    GetBusinessesWithoutBillingProfileQuery,
    GetBusinessesWithoutBillingProfileQueryVariables
>;
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
export const GetClientBranchesDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'GetClientBranches' },
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
                        name: { kind: 'Name', value: 'businessId' },
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
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'take' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'clientBranches' },
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
                                name: { kind: 'Name', value: 'skip' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'skip' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'take' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'take' },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
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
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'clientBranchesCount' },
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
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetClientBranchesQuery, GetClientBranchesQueryVariables>;
export const GetBranchesDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'GetBranches' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'branches' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'number' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
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
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetBranchesQuery, GetBranchesQueryVariables>;
export const GetBranchDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'GetBranch' },
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
                        name: { kind: 'Name', value: 'branch' },
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
                                    name: { kind: 'Name', value: 'number' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
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
} as unknown as DocumentNode<GetBranchQuery, GetBranchQueryVariables>;
export const GetBudgetsDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'GetBudgets' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'search' },
                    },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'clientId' },
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
                        name: { kind: 'Name', value: 'businessId' },
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
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'take' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'orderBy' },
                    },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'orderDirection' },
                    },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'budgets' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'search' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'search' },
                                },
                            },
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
                                name: { kind: 'Name', value: 'businessId' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'businessId' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'skip' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'skip' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'take' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'take' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'orderBy' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'orderBy' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'orderDirection' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'orderDirection' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'budgetNumber' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'subject' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'description' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'status' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'clientName' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'createdAt' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'updatedAt' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'expectedExpenses' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'type' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'unitPrice',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'quantity' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'amount' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'manpower' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'technician',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'payAmount',
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'markup' },
                                },
                                {
                                    kind: 'Field',
                                    name: {
                                        kind: 'Name',
                                        value: 'totalExpectedExpenses',
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'billingProfile' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'business' },
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
                                                name: { kind: 'Name', value: 'name' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'number' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'createdBy' },
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
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'budgetsCount' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'search' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'search' },
                                },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetBudgetsQuery, GetBudgetsQueryVariables>;
export const GetBudgetByIdDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'GetBudgetById' },
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
                        name: { kind: 'Name', value: 'budgetById' },
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
                                    name: { kind: 'Name', value: 'budgetNumber' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'subject' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'description' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'status' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'clientName' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'createdAt' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'updatedAt' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'expectedExpenses' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'type' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'unitPrice',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'quantity' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'amount' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'manpower' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'technician',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'payAmount',
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'markup' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'budgetBranch' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'name' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'number' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: {
                                        kind: 'Name',
                                        value: 'totalExpectedExpenses',
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'billingProfile' },
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
                                                    value: 'legalName',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'tipoDocumento',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'numeroDocumento',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'IVACondition',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'comercialAddress',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'billingEmails',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'contacts' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
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
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'phone',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'notes',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'business' },
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
                                                name: { kind: 'Name', value: 'name' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'number' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'createdBy' },
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
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetBudgetByIdQuery, GetBudgetByIdQueryVariables>;
export const SearchGmailThreadsDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'SearchGmailThreads' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'query' },
                    },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'searchBudgetThreads' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'query' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'query' },
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
                                    name: { kind: 'Name', value: 'threads' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'subject' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'snippet' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'historyId',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'messages' },
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
                                                                value: 'threadId',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'labelIds',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'snippet',
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
} as unknown as DocumentNode<SearchGmailThreadsQuery, SearchGmailThreadsQueryVariables>;
export const GetBusinessesWithBillingProfilesDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'GetBusinessesWithBillingProfiles' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'search' },
                    },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'take' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'businesses' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'search' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'search' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'skip' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'skip' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'take' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'take' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'billingProfile' },
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
                                                    value: 'legalName',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'tipoDocumento',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'numeroDocumento',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'IVACondition',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'billingEmails',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'comercialAddress',
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
} as unknown as DocumentNode<
    GetBusinessesWithBillingProfilesQuery,
    GetBusinessesWithBillingProfilesQueryVariables
>;
export const GetClientBranchesByBusinessDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'GetClientBranchesByBusiness' },
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
                        name: { kind: 'Name', value: 'businessId' },
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
                        name: { kind: 'Name', value: 'clientBranchesByBusiness' },
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
                                name: { kind: 'Name', value: 'businessId' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'businessId' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
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
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    GetClientBranchesByBusinessQuery,
    GetClientBranchesByBusinessQueryVariables
>;
export const CreateBudgetDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'CreateBudget' },
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
                            name: { kind: 'Name', value: 'BudgetInput' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createBudget' },
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
                                    name: { kind: 'Name', value: 'success' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'message' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'budget' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'subject' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'description',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'price' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'status' },
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
                                                name: {
                                                    kind: 'Name',
                                                    value: 'billingProfile',
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
                                                                value: 'legalName',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'business',
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
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'branch' },
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
                                                                value: 'number',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'createdBy',
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
                                                                value: 'fullName',
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
} as unknown as DocumentNode<CreateBudgetMutation, CreateBudgetMutationVariables>;
export const UpdateBudgetDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'UpdateBudget' },
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
                            name: { kind: 'Name', value: 'UpdateBudgetInput' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updateBudget' },
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
                                    name: { kind: 'Name', value: 'success' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'message' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'budget' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'subject' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'description',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'price' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'status' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'updatedAt',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'billingProfile',
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
                                                                value: 'legalName',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'business',
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
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'branch' },
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
                                                                value: 'number',
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
} as unknown as DocumentNode<UpdateBudgetMutation, UpdateBudgetMutationVariables>;
export const DeleteBudgetDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'DeleteBudget' },
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
                        name: { kind: 'Name', value: 'deleteBudget' },
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
} as unknown as DocumentNode<DeleteBudgetMutation, DeleteBudgetMutationVariables>;
export const UpdateBudgetStatusDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'UpdateBudgetStatus' },
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
                            name: { kind: 'Name', value: 'UpdateBudgetStatusInput' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updateBudgetStatus' },
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
                                    name: { kind: 'Name', value: 'success' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'message' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'budget' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'subject' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'description',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'price' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'status' },
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
                                                name: {
                                                    kind: 'Name',
                                                    value: 'updatedAt',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'billingProfile',
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
                                                                value: 'business',
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
                                                name: {
                                                    kind: 'Name',
                                                    value: 'createdBy',
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
                                                                value: 'fullName',
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
} as unknown as DocumentNode<
    UpdateBudgetStatusMutation,
    UpdateBudgetStatusMutationVariables
>;
export const CreateBudgetWithBillingProfileDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'CreateBudgetWithBillingProfile' },
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
                            name: {
                                kind: 'Name',
                                value: 'CreateBudgetWithBillingProfileInput',
                            },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createBudgetWithBillingProfile' },
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
                                    name: { kind: 'Name', value: 'success' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'message' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'budget' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'subject' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'description',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'price' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'status' },
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
                                                name: {
                                                    kind: 'Name',
                                                    value: 'billingProfile',
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
                                                                value: 'legalName',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'business',
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
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'branch' },
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
                                                                value: 'number',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'createdBy',
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
                                                                value: 'fullName',
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
} as unknown as DocumentNode<
    CreateBudgetWithBillingProfileMutation,
    CreateBudgetWithBillingProfileMutationVariables
>;
export const CreateBusinessDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'CreateBusiness' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'data' } },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'BusinessInput' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createBusiness' },
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
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<CreateBusinessMutation, CreateBusinessMutationVariables>;
export const UpdateBusinessDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'UpdateBusiness' },
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
                            name: { kind: 'Name', value: 'BusinessInput' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updateBusiness' },
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
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<UpdateBusinessMutation, UpdateBusinessMutationVariables>;
export const DeleteBusinessDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'DeleteBusiness' },
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
                        name: { kind: 'Name', value: 'deleteBusiness' },
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
                                    name: { kind: 'Name', value: 'success' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'message' },
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
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<DeleteBusinessMutation, DeleteBusinessMutationVariables>;
export const GetBusinessDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'GetBusiness' },
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
                        name: { kind: 'Name', value: 'business' },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetBusinessQuery, GetBusinessQueryVariables>;
export const GetBusinessesDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'GetBusinesses' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'search' },
                    },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    defaultValue: { kind: 'NullValue' },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                    defaultValue: { kind: 'NullValue' },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'take' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                    defaultValue: { kind: 'NullValue' },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'businesses' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'search' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'search' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'skip' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'skip' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'take' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'take' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'businessesCount' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'search' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'search' },
                                },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetBusinessesQuery, GetBusinessesQueryVariables>;
export const GetCitiesDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'GetCities' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'search' },
                    },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    defaultValue: { kind: 'StringValue', value: '', block: false },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                    defaultValue: { kind: 'NullValue' },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'take' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                    defaultValue: { kind: 'NullValue' },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'provinceId' },
                    },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    defaultValue: { kind: 'StringValue', value: '', block: false },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'cities' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'search' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'search' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'skip' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'skip' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'take' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'take' },
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
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'citiesCount' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'search' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'search' },
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
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetCitiesQuery, GetCitiesQueryVariables>;
export const GetCityDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'GetCity' },
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
                        name: { kind: 'Name', value: 'city' },
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
} as unknown as DocumentNode<GetCityQuery, GetCityQueryVariables>;
export const CreateCityDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'CreateCity' },
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
                                    name: { kind: 'Name', value: 'success' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'message' },
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
            name: { kind: 'Name', value: 'UpdateCity' },
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
                                    name: { kind: 'Name', value: 'success' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'message' },
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
            name: { kind: 'Name', value: 'DeleteCity' },
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
                                    name: { kind: 'Name', value: 'success' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'message' },
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
} as unknown as DocumentNode<DeleteCityMutation, DeleteCityMutationVariables>;
export const CreateClientDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'CreateClient' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'data' } },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'ClientInput' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createClient' },
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
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<CreateClientMutation, CreateClientMutationVariables>;
export const UpdateClientDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'UpdateClient' },
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
                            name: { kind: 'Name', value: 'ClientInput' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updateClient' },
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
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<UpdateClientMutation, UpdateClientMutationVariables>;
export const GetClientDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'GetClient' },
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
                        name: { kind: 'Name', value: 'client' },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetClientQuery, GetClientQueryVariables>;
export const GetClientsDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'GetClients' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'search' },
                    },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    defaultValue: { kind: 'NullValue' },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                    defaultValue: { kind: 'NullValue' },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'take' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                    defaultValue: { kind: 'NullValue' },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'clients' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'search' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'search' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'skip' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'skip' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'take' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'take' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'clientsCount' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'search' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'search' },
                                },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetClientsQuery, GetClientsQueryVariables>;
export const GetClientsWithBranchesDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'GetClientsWithBranches' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'clients' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'branches' },
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
                                                name: { kind: 'Name', value: 'name' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'businesses',
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
} as unknown as DocumentNode<
    GetClientsWithBranchesQuery,
    GetClientsWithBranchesQueryVariables
>;
export const GetClientsByBusinessDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'GetClientsByBusiness' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'businessId' },
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
                        name: { kind: 'Name', value: 'search' },
                    },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    defaultValue: { kind: 'NullValue' },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'clientsByBusiness' },
                        arguments: [
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
                                name: { kind: 'Name', value: 'search' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'search' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'branches' },
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
                                                name: { kind: 'Name', value: 'name' },
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
} as unknown as DocumentNode<
    GetClientsByBusinessQuery,
    GetClientsByBusinessQueryVariables
>;
export const DeleteClientDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'DeleteClient' },
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
                        name: { kind: 'Name', value: 'deleteClient' },
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
                                    name: { kind: 'Name', value: 'success' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'message' },
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
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<DeleteClientMutation, DeleteClientMutationVariables>;
export const GetExpenseDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'GetExpense' },
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
                        name: { kind: 'Name', value: 'expenseById' },
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
                                    name: { kind: 'Name', value: 'amount' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'discountAmount' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'expenseType' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'expenseNumber' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'cityName' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'paySource' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'paySourceBank' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'invoiceType' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'status' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'doneBy' },
                                },
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
                                                name: {
                                                    kind: 'Name',
                                                    value: 'taskNumber',
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'registeredBy' },
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
                                    name: { kind: 'Name', value: 'observations' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'administrativeNotes' },
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
                                    name: { kind: 'Name', value: 'files' },
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
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'mimeType' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'filename' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'attachmentFiles' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'url' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'mimeType' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'filename' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'key' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'size' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'urlExpire',
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'auditor' },
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
                                    name: { kind: 'Name', value: 'installments' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'expenseDate' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'createdAt' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetExpenseQuery, GetExpenseQueryVariables>;
export const GetExpensesDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'GetExpenses' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'registeredBy' },
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
                        name: { kind: 'Name', value: 'status' },
                    },
                    type: {
                        kind: 'ListType',
                        type: {
                            kind: 'NonNullType',
                            type: {
                                kind: 'NamedType',
                                name: { kind: 'Name', value: 'ExpenseStatus' },
                            },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'expenseType' },
                    },
                    type: {
                        kind: 'ListType',
                        type: {
                            kind: 'NonNullType',
                            type: {
                                kind: 'NamedType',
                                name: { kind: 'Name', value: 'ExpenseType' },
                            },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'paySource' },
                    },
                    type: {
                        kind: 'ListType',
                        type: {
                            kind: 'NonNullType',
                            type: {
                                kind: 'NamedType',
                                name: { kind: 'Name', value: 'ExpensePaySource' },
                            },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'expenseDateFrom' },
                    },
                    type: {
                        kind: 'NamedType',
                        name: { kind: 'Name', value: 'DateTime' },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'expenseDateTo' },
                    },
                    type: {
                        kind: 'NamedType',
                        name: { kind: 'Name', value: 'DateTime' },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'take' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'orderBy' },
                    },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'orderDirection' },
                    },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'expenses' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'registeredBy' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'registeredBy' },
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
                                name: { kind: 'Name', value: 'expenseType' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'expenseType' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'paySource' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'paySource' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'expenseDateFrom' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'expenseDateFrom' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'expenseDateTo' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'expenseDateTo' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'skip' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'skip' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'take' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'take' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'orderBy' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'orderBy' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'orderDirection' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'orderDirection' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'expenseNumber' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'amount' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'discountAmount' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'expenseType' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'paySource' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'paySourceBank' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'invoiceType' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'installments' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'expenseDate' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'observations' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'administrativeNotes' },
                                },
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
                                                name: {
                                                    kind: 'Name',
                                                    value: 'taskNumber',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'businessName',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'clientName',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'business' },
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
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'branch' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'number',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'client',
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
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'city',
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
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'registeredBy' },
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
                                    name: { kind: 'Name', value: 'doneBy' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'status' },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'expensesCount' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'registeredBy' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'registeredBy' },
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
                                name: { kind: 'Name', value: 'expenseType' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'expenseType' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'paySource' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'paySource' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'expenseDateFrom' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'expenseDateFrom' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'expenseDateTo' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'expenseDateTo' },
                                },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetExpensesQuery, GetExpensesQueryVariables>;
export const DeleteExpenseDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'DeleteExpense' },
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
                        name: { kind: 'Name', value: 'taskId' },
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
                        name: { kind: 'Name', value: 'deleteExpense' },
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
                                name: { kind: 'Name', value: 'taskId' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'taskId' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'expense' },
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
} as unknown as DocumentNode<DeleteExpenseMutation, DeleteExpenseMutationVariables>;
export const GenerateApprovedExpensesReportDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'GenerateApprovedExpensesReport' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'startDate' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'DateTime' },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'endDate' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'DateTime' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'generateApprovedExpensesReport' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'startDate' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'startDate' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'endDate' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'endDate' },
                                },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    GenerateApprovedExpensesReportMutation,
    GenerateApprovedExpensesReportMutationVariables
>;
export const UpdateExpenseStatusDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'UpdateExpenseStatus' },
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
                        name: { kind: 'Name', value: 'updateExpenseStatus' },
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
                                    name: { kind: 'Name', value: 'expense' },
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
                                                    value: 'expenseType',
                                                },
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
                                                    value: 'paySourceBank',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'installments',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'task' },
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
                                                                value: 'expenses',
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
                                                                            value: 'status',
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
    UpdateExpenseStatusMutation,
    UpdateExpenseStatusMutationVariables
>;
export const UpdateExpenseDiscountAmountDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'UpdateExpenseDiscountAmount' },
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
                        name: { kind: 'Name', value: 'discountAmount' },
                    },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Float' } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updateExpenseDiscountAmount' },
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
                                name: { kind: 'Name', value: 'discountAmount' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'discountAmount' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'expense' },
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
                                                    value: 'discountAmount',
                                                },
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
    UpdateExpenseDiscountAmountMutation,
    UpdateExpenseDiscountAmountMutationVariables
>;
export const CreateExpenseDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'CreateExpense' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'taskId' },
                    },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'expenseData' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'ExpenseInput' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createExpense' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'taskId' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'taskId' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'expenseData' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'expenseData' },
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
                                    name: { kind: 'Name', value: 'expense' },
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
                                                    value: 'expenseType',
                                                },
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
                                                    value: 'paySourceBank',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'installments',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'expenseDate',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'doneBy' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'cityName' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'observations',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'expenseNumber',
                                                },
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
            },
        },
    ],
} as unknown as DocumentNode<CreateExpenseMutation, CreateExpenseMutationVariables>;
export const UpdateExpenseAdministrativeDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'UpdateExpenseAdministrative' },
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
                            name: {
                                kind: 'Name',
                                value: 'UpdateExpenseAdministrativeInput',
                            },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updateExpenseAdministrative' },
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
                                    name: { kind: 'Name', value: 'success' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'message' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'expense' },
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
                                                    value: 'administrativeNotes',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'attachmentFiles',
                                                },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'filename',
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
                                                                value: 'mimeType',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'key',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'size',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'urlExpire',
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
} as unknown as DocumentNode<
    UpdateExpenseAdministrativeMutation,
    UpdateExpenseAdministrativeMutationVariables
>;
export const GenerateUploadUrlsDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'GenerateUploadUrls' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'fileCount' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'prefix' },
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
                        name: { kind: 'Name', value: 'mimeTypes' },
                    },
                    type: {
                        kind: 'NonNullType',
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
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'generateUploadUrls' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'fileCount' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'fileCount' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'prefix' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'prefix' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'mimeTypes' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'mimeTypes' },
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
                                    name: { kind: 'Name', value: 'uploadUrls' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'url' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'key' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'urlExpire',
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
} as unknown as DocumentNode<
    GenerateUploadUrlsMutation,
    GenerateUploadUrlsMutationVariables
>;
export const GeneratePresignedUrlsDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'GeneratePresignedUrls' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'fileCount' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'prefix' },
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
                        name: { kind: 'Name', value: 'mimeTypes' },
                    },
                    type: {
                        kind: 'NonNullType',
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
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'generatePresignedUrls' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'fileCount' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'fileCount' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'prefix' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'prefix' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'mimeTypes' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'mimeTypes' },
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
                                    name: { kind: 'Name', value: 'presignedUrls' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'url' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'key' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'expiresIn',
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
} as unknown as DocumentNode<
    GeneratePresignedUrlsMutation,
    GeneratePresignedUrlsMutationVariables
>;
export const GetPreventivesDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'GetPreventives' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'take' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'business' },
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
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'city' } },
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
                        name: { kind: 'Name', value: 'assigned' },
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
                        name: { kind: 'Name', value: 'client' },
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
                        name: { kind: 'Name', value: 'frequency' },
                    },
                    type: {
                        kind: 'ListType',
                        type: {
                            kind: 'NonNullType',
                            type: {
                                kind: 'NamedType',
                                name: { kind: 'Name', value: 'PreventiveFrequency' },
                            },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'months' },
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
                        name: { kind: 'Name', value: 'status' },
                    },
                    type: {
                        kind: 'ListType',
                        type: {
                            kind: 'NonNullType',
                            type: {
                                kind: 'NamedType',
                                name: { kind: 'Name', value: 'PreventiveStatus' },
                            },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'preventives' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'skip' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'skip' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'take' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'take' },
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
                                name: { kind: 'Name', value: 'assigned' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'assigned' },
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
                                name: { kind: 'Name', value: 'frequency' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'frequency' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'months' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'months' },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'lastDoneAt' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'batteryChangedAt' },
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
                                    name: { kind: 'Name', value: 'status' },
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
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'preventivesCount' },
                        arguments: [
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
                                name: { kind: 'Name', value: 'assigned' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'assigned' },
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
                                name: { kind: 'Name', value: 'frequency' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'frequency' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'months' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'months' },
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
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetPreventivesQuery, GetPreventivesQueryVariables>;
export const GetPreventiveDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'GetPreventive' },
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
                        name: { kind: 'Name', value: 'preventive' },
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
                                    name: { kind: 'Name', value: 'lastDoneAt' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'batteryChangedAt' },
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
                                    name: { kind: 'Name', value: 'status' },
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
                                    name: { kind: 'Name', value: 'tasks' },
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
                                                    value: 'taskNumber',
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
                                                name: { kind: 'Name', value: 'closedAt' },
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
            },
        },
    ],
} as unknown as DocumentNode<GetPreventiveQuery, GetPreventiveQueryVariables>;
export const CreatePreventiveDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'CreatePreventive' },
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
            name: { kind: 'Name', value: 'UpdatePreventive' },
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
export const DeletePreventiveDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'DeletePreventive' },
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
} as unknown as DocumentNode<DeletePreventiveMutation, DeletePreventiveMutationVariables>;
export const GetProvincesDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'GetProvinces' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'search' },
                    },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    defaultValue: { kind: 'StringValue', value: '', block: false },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                    defaultValue: { kind: 'NullValue' },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'take' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                    defaultValue: { kind: 'NullValue' },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'provinces' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'search' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'search' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'skip' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'skip' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'take' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'take' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'provincesCount' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'search' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'search' },
                                },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetProvincesQuery, GetProvincesQueryVariables>;
export const GetProvinceDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'GetProvince' },
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
                        name: { kind: 'Name', value: 'province' },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetProvinceQuery, GetProvinceQueryVariables>;
export const CreateProvinceDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'CreateProvince' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'data' } },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'ProvinceInput' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createProvince' },
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
} as unknown as DocumentNode<CreateProvinceMutation, CreateProvinceMutationVariables>;
export const UpdateProvinceDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'UpdateProvince' },
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
                            name: { kind: 'Name', value: 'ProvinceInput' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updateProvince' },
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
} as unknown as DocumentNode<UpdateProvinceMutation, UpdateProvinceMutationVariables>;
export const DeleteProvinceDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'DeleteProvince' },
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
                        name: { kind: 'Name', value: 'deleteProvince' },
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
                                    name: { kind: 'Name', value: 'success' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'message' },
                                },
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
} as unknown as DocumentNode<DeleteProvinceMutation, DeleteProvinceMutationVariables>;
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
                        name: { kind: 'Name', value: 'assigned' },
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
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'city' } },
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
                        name: { kind: 'Name', value: 'status' },
                    },
                    type: {
                        kind: 'ListType',
                        type: {
                            kind: 'NonNullType',
                            type: {
                                kind: 'NamedType',
                                name: { kind: 'Name', value: 'TaskStatus' },
                            },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'client' },
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
                        name: { kind: 'Name', value: 'taskType' },
                    },
                    type: {
                        kind: 'ListType',
                        type: {
                            kind: 'NonNullType',
                            type: {
                                kind: 'NamedType',
                                name: { kind: 'Name', value: 'TaskType' },
                            },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'startDate' },
                    },
                    type: {
                        kind: 'NamedType',
                        name: { kind: 'Name', value: 'DateTime' },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'endDate' },
                    },
                    type: {
                        kind: 'NamedType',
                        name: { kind: 'Name', value: 'DateTime' },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'take' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'orderBy' },
                    },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'orderDirection' },
                    },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
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
                                name: { kind: 'Name', value: 'assigned' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'assigned' },
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
                                name: { kind: 'Name', value: 'status' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'status' },
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
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'startDate' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'startDate' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'endDate' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'endDate' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'orderBy' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'orderBy' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'orderDirection' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'orderDirection' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'skip' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'skip' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'take' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'take' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'useMaterials' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'taskNumber' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'createdAt' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'startedAt' },
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
                                    name: { kind: 'Name', value: 'participants' },
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
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'frequency',
                                                },
                                            },
                                        ],
                                    },
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
                                    name: { kind: 'Name', value: 'businessName' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'clientName' },
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
                                                name: { kind: 'Name', value: 'name' },
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
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'tasksCount' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'assigned' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'assigned' },
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
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'startDate' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'startDate' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'endDate' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'endDate' },
                                },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<TasksQuery, TasksQueryVariables>;
export const GetTaskDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'GetTask' },
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
                                    name: { kind: 'Name', value: 'useMaterials' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'taskNumber' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'startedAt' },
                                },
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
                                    name: { kind: 'Name', value: 'actNumber' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'observations' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'clientName' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'businessName' },
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
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'frequency',
                                                },
                                            },
                                        ],
                                    },
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
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'number' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'name' },
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
                                    name: { kind: 'Name', value: 'participants' },
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
                                                name: {
                                                    kind: 'Name',
                                                    value: 'expenseNumber',
                                                },
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
                                                    value: 'paySourceBank',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'expenseType',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'observations',
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
                                                name: { kind: 'Name', value: 'images' },
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
                                                name: { kind: 'Name', value: 'files' },
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
                                                                value: 'key',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'mimeType',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'filename',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'installments',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'expenseDate',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'status' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'registeredBy',
                                                },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
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
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'doneBy' },
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
                                    name: { kind: 'Name', value: 'movitecTicket' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetTaskQuery, GetTaskQueryVariables>;
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
export const UpdateTaskStatusDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'updateTaskStatus' },
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
                        name: { kind: 'Name', value: 'status' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'TaskStatus' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updateTaskStatus' },
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
                                                name: { kind: 'Name', value: 'status' },
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
} as unknown as DocumentNode<UpdateTaskStatusMutation, UpdateTaskStatusMutationVariables>;
export const GenerateApprovedTasksReportDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'GenerateApprovedTasksReport' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'startDate' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'DateTime' },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'endDate' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'DateTime' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'generateApprovedTasksReport' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'startDate' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'startDate' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'endDate' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'endDate' },
                                },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    GenerateApprovedTasksReportMutation,
    GenerateApprovedTasksReportMutationVariables
>;
export const GetTaskPhotosKeysDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'GetTaskPhotosKeys' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'startDate' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'DateTime' },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'endDate' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'DateTime' },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'businessId' },
                    },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'getTaskPhotosWithInfo' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'startDate' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'startDate' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'endDate' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'endDate' },
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
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetTaskPhotosKeysQuery, GetTaskPhotosKeysQueryVariables>;
export const DownloadTaskPhotosDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'DownloadTaskPhotos' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'startDate' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'DateTime' },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'endDate' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'DateTime' },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'businessId' },
                    },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'downloadTaskPhotos' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'startDate' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'startDate' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'endDate' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'endDate' },
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
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'success' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
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
    DownloadTaskPhotosMutation,
    DownloadTaskPhotosMutationVariables
>;
export const GetUsersDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'GetUsers' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'search' },
                    },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    defaultValue: { kind: 'StringValue', value: '', block: false },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'skip' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                    defaultValue: { kind: 'IntValue', value: '0' },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'take' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                    defaultValue: { kind: 'IntValue', value: '10' },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'cityId' },
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
                        name: { kind: 'Name', value: 'roles' },
                    },
                    type: {
                        kind: 'ListType',
                        type: {
                            kind: 'NonNullType',
                            type: {
                                kind: 'NamedType',
                                name: { kind: 'Name', value: 'Role' },
                            },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'users' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'search' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'search' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'skip' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'skip' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'take' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'take' },
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
                                name: { kind: 'Name', value: 'roles' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'roles' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'fullName' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'roles' } },
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
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'usersCount' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'search' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'search' },
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
                                name: { kind: 'Name', value: 'roles' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'roles' },
                                },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetUsersQuery, GetUsersQueryVariables>;
export const GetTechniciansDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'GetTechnicians' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'technicians' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'firstName' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'lastName' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'fullName' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'roles' } },
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
} as unknown as DocumentNode<GetTechniciansQuery, GetTechniciansQueryVariables>;
export const CreateUserDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'CreateUser' },
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
                                                name: { kind: 'Name', value: 'fullName' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'email' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'roles' },
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
} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const UpdateUserDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'UpdateUser' },
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
                                                name: { kind: 'Name', value: 'fullName' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'email' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'roles' },
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
} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const DeleteUserDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'DeleteUser' },
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
                        name: { kind: 'Name', value: 'deleteUser' },
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
                                                name: { kind: 'Name', value: 'fullName' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'email' },
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
} as unknown as DocumentNode<DeleteUserMutation, DeleteUserMutationVariables>;
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
export const GetUserDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'GetUser' },
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
                        name: { kind: 'Name', value: 'user' },
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
                                    name: { kind: 'Name', value: 'firstName' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'lastName' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'roles' } },
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
} as unknown as DocumentNode<GetUserQuery, GetUserQueryVariables>;
