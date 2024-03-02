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
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
    [_ in K]?: never;
};
export type Incremental<T> =
    | T
    | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: { input: string; output: string };
    String: { input: string; output: string };
    Boolean: { input: boolean; output: boolean };
    Int: { input: number; output: number };
    Float: { input: number; output: number };
    BigInt: { input: any; output: any };
    Date: { input: string; output: string };
    DateTime: { input: any; output: any };
    GenericScalar: { input: any; output: any };
};

export type Admin = {
    __typename?: 'Admin';
    id: Scalars['ID']['output'];
    offices: Array<Office>;
    user: User;
};

export type Brand = {
    __typename?: 'Brand';
    createdOn: Scalars['DateTime']['output'];
    id: Scalars['ID']['output'];
    modifiedOn: Scalars['DateTime']['output'];
    name: Scalars['String']['output'];
    products: Array<Product>;
};

export type CancelContract = {
    __typename?: 'CancelContract';
    contract: Maybe<Contract>;
    error: Maybe<Scalars['String']['output']>;
};

export type CancelInternalOrder = {
    __typename?: 'CancelInternalOrder';
    error: Maybe<Scalars['String']['output']>;
    internalOrder: Maybe<InternalOrder>;
};

export type CancelOrderSupplier = {
    __typename?: 'CancelOrderSupplier';
    error: Maybe<Scalars['String']['output']>;
    orderSupplier: Scalars['ID']['output'];
};

export type Client = {
    __typename?: 'Client';
    contracts: Array<Contract>;
    createdOn: Scalars['DateTime']['output'];
    /** Número de documento de identidad del cliente */
    dni: Scalars['String']['output'];
    email: Scalars['String']['output'];
    firstName: Scalars['String']['output'];
    /** Número de la calle donde vive el cliente */
    houseNumber: Scalars['String']['output'];
    /** Número de la casa o departamento */
    houseUnit: Maybe<Scalars['String']['output']>;
    id: Scalars['ID']['output'];
    lastName: Scalars['String']['output'];
    locality: Locality;
    modifiedOn: Scalars['DateTime']['output'];
    /** Notas adicionales sobre el cliente */
    note: Maybe<Scalars['String']['output']>;
    /** Código de área del teléfono del cliente */
    phoneCode: Scalars['String']['output'];
    /** Número de teléfono del cliente */
    phoneNumber: Scalars['String']['output'];
    sales: Array<Sale>;
    /** Nombre de la calle donde vive el cliente */
    streetName: Scalars['String']['output'];
};

export type Contract = {
    __typename?: 'Contract';
    client: Client;
    contractEndDatetime: Scalars['DateTime']['output'];
    contractItems: Array<ContractItem>;
    contractStartDatetime: Scalars['DateTime']['output'];
    createdBy: User;
    createdOn: Scalars['DateTime']['output'];
    discountAmount: Scalars['BigInt']['output'];
    expirationDate: Scalars['DateTime']['output'];
    history: Array<ContractHistory>;
    /** Número de la calle donde vive el cliente */
    houseNumber: Scalars['String']['output'];
    /** Número de la casa o departamento */
    houseUnit: Maybe<Scalars['String']['output']>;
    id: Scalars['ID']['output'];
    latestHistoryEntry: Maybe<ContractHistory>;
    locality: Locality;
    modifiedOn: Scalars['DateTime']['output'];
    numberOfRentalDays: Scalars['Int']['output'];
    office: Office;
    /** Nombre de la calle donde vive el cliente */
    streetName: Scalars['String']['output'];
    subtotal: Scalars['BigInt']['output'];
    total: Scalars['BigInt']['output'];
};

export type ContractHistory = {
    __typename?: 'ContractHistory';
    contract: Contract;
    createdOn: Scalars['DateTime']['output'];
    currentContract: Maybe<Contract>;
    id: Scalars['ID']['output'];
    modifiedOn: Scalars['DateTime']['output'];
    status: ContractStatusChoices;
};

export type ContractInput = {
    clientId: Scalars['ID']['input'];
    contractEnd: Scalars['DateTime']['input'];
    contractStart: Scalars['DateTime']['input'];
    expirationDate: Scalars['DateTime']['input'];
    houseNumber: Scalars['String']['input'];
    houseUnit: InputMaybe<Scalars['String']['input']>;
    localityId: Scalars['ID']['input'];
    streetName: Scalars['String']['input'];
};

export type ContractItem = {
    __typename?: 'ContractItem';
    contract: Contract;
    createdOn: Scalars['DateTime']['output'];
    id: Scalars['ID']['output'];
    modifiedOn: Scalars['DateTime']['output'];
    product: Product;
    productDiscount: Scalars['BigInt']['output'];
    productPrice: Scalars['BigInt']['output'];
    productSubtotal: Scalars['BigInt']['output'];
    quantity: Scalars['Int']['output'];
    quantityReturned: Scalars['Int']['output'];
    serviceItems: Array<ContractItemService>;
    servicesDiscount: Scalars['BigInt']['output'];
    servicesSubtotal: Scalars['Int']['output'];
    shippingDiscount: Scalars['BigInt']['output'];
    shippingSubtotal: Scalars['Int']['output'];
    total: Scalars['BigInt']['output'];
};

export type ContractItemInput = {
    allocations: Array<InputMaybe<ContractItemProductAllocationInput>>;
    productDiscount: InputMaybe<Scalars['Int']['input']>;
    productId: Scalars['ID']['input'];
    serviceItems: InputMaybe<Array<InputMaybe<ContractItemServiceItemInput>>>;
};

export type ContractItemProductAllocationInput = {
    officeId: Scalars['ID']['input'];
    quantity: Scalars['Int']['input'];
    shippingCost: InputMaybe<Scalars['Int']['input']>;
    shippingDiscount: InputMaybe<Scalars['Int']['input']>;
};

export type ContractItemService = {
    __typename?: 'ContractItemService';
    billingPeriod: Maybe<Scalars['Int']['output']>;
    billingType: CoreContractItemServiceBillingTypeChoices;
    createdOn: Scalars['DateTime']['output'];
    discount: Scalars['BigInt']['output'];
    id: Scalars['ID']['output'];
    item: ContractItem;
    modifiedOn: Scalars['DateTime']['output'];
    price: Scalars['BigInt']['output'];
    service: ProductService;
    subtotal: Scalars['BigInt']['output'];
    total: Scalars['BigInt']['output'];
};

export type ContractItemServiceItemInput = {
    discount: InputMaybe<Scalars['Int']['input']>;
    serviceId: Scalars['ID']['input'];
};

/** An enumeration. */
export enum ContractStatusChoices {
    Activo = 'ACTIVO',
    Cancelado = 'CANCELADO',
    ConDeposito = 'CON_DEPOSITO',
    DevolucionExitosa = 'DEVOLUCION_EXITOSA',
    DevolucionFallida = 'DEVOLUCION_FALLIDA',
    Finalizado = 'FINALIZADO',
    Pagado = 'PAGADO',
    Presupuestado = 'PRESUPUESTADO',
    Vencido = 'VENCIDO',
}

/** An enumeration. */
export enum CoreContractItemServiceBillingTypeChoices {
    /** CUSTOM */
    Custom = 'CUSTOM',
    /** MONTHLY */
    Monthly = 'MONTHLY',
    /** ONE_TIME */
    OneTime = 'ONE_TIME',
    /** WEEKLY */
    Weekly = 'WEEKLY',
}

/** An enumeration. */
export enum CoreProductServiceBillingTypeChoices {
    /** CUSTOM */
    Custom = 'CUSTOM',
    /** MONTHLY */
    Monthly = 'MONTHLY',
    /** ONE_TIME */
    OneTime = 'ONE_TIME',
    /** WEEKLY */
    Weekly = 'WEEKLY',
}

/** An enumeration. */
export enum CoreSupplierOrderHistoryStatusChoices {
    /** Cancelado */
    Canceled = 'CANCELED',
    /** Completado */
    Completed = 'COMPLETED',
    /** En progreso */
    InProgress = 'IN_PROGRESS',
    /** Pendiente */
    Pending = 'PENDING',
}

export type CreateBrand = {
    __typename?: 'CreateBrand';
    brand: Maybe<Brand>;
    error: Maybe<Scalars['String']['output']>;
};

export type CreateClient = {
    __typename?: 'CreateClient';
    client: Maybe<Client>;
    error: Maybe<Scalars['String']['output']>;
};

export type CreateClientInput = {
    dni: Scalars['String']['input'];
    email: Scalars['String']['input'];
    firstName: Scalars['String']['input'];
    houseNumber: Scalars['String']['input'];
    houseUnit: InputMaybe<Scalars['String']['input']>;
    lastName: Scalars['String']['input'];
    localityId: Scalars['ID']['input'];
    phoneCode: Scalars['String']['input'];
    phoneNumber: Scalars['String']['input'];
    streetName: Scalars['String']['input'];
};

export type CreateContract = {
    __typename?: 'CreateContract';
    contractId: Maybe<Scalars['ID']['output']>;
    error: Maybe<Scalars['String']['output']>;
    ok: Maybe<Scalars['Boolean']['output']>;
};

export type CreateEmployee = {
    __typename?: 'CreateEmployee';
    employee: Maybe<Employee>;
    error: Maybe<Scalars['String']['output']>;
};

export type CreateEmployeeInput = {
    email: Scalars['String']['input'];
    firstName: Scalars['String']['input'];
    lastName: Scalars['String']['input'];
    offices: Array<Scalars['ID']['input']>;
};

export type CreateInternalOrder = {
    __typename?: 'CreateInternalOrder';
    error: Maybe<Scalars['String']['output']>;
    internalOrder: Maybe<InternalOrder>;
};

export type CreateInternalOrderInput = {
    products: Array<CreateInternalOrderProductInput>;
    sourceOfficeId: Scalars['ID']['input'];
    targetOfficeId: Scalars['ID']['input'];
};

export type CreateInternalOrderProductInput = {
    id: Scalars['ID']['input'];
    quantity: Scalars['Int']['input'];
};

export type CreateLocality = {
    __typename?: 'CreateLocality';
    error: Maybe<Scalars['String']['output']>;
    locality: Maybe<Locality>;
};

export type CreateProduct = {
    __typename?: 'CreateProduct';
    error: Maybe<Scalars['String']['output']>;
    product: Maybe<Product>;
};

export type CreateSale = {
    __typename?: 'CreateSale';
    error: Maybe<Scalars['String']['output']>;
    sale: Maybe<Sale>;
};

export type CreateSaleInput = {
    client: Scalars['ID']['input'];
    orders: Array<SaleOrderItemInput>;
};

export type CreateSupplier = {
    __typename?: 'CreateSupplier';
    error: Maybe<Scalars['String']['output']>;
    supplier: Maybe<Supplier>;
};

export type CreateSupplierInput = {
    cuit: Scalars['String']['input'];
    email: Scalars['String']['input'];
    houseNumber: Scalars['String']['input'];
    houseUnit: InputMaybe<Scalars['String']['input']>;
    locality: Scalars['ID']['input'];
    name: Scalars['String']['input'];
    note: InputMaybe<Scalars['String']['input']>;
    phoneCode: Scalars['String']['input'];
    phoneNumber: Scalars['String']['input'];
    streetName: Scalars['String']['input'];
};

export type CreateSupplierOrder = {
    __typename?: 'CreateSupplierOrder';
    error: Maybe<Scalars['String']['output']>;
    supplierOrder: Maybe<OrderSupplier>;
};

export type CreateSupplierOrderInput = {
    officeDestinationId: Scalars['ID']['input'];
    products: Array<CreateSupplierOrderProductInput>;
    supplierId: Scalars['ID']['input'];
};

export type CreateSupplierOrderProductInput = {
    id: Scalars['ID']['input'];
    quantity: Scalars['Int']['input'];
};

export type DeleteClient = {
    __typename?: 'DeleteClient';
    success: Scalars['Boolean']['output'];
};

export type DeleteContract = {
    __typename?: 'DeleteContract';
    success: Scalars['Boolean']['output'];
};

export type DeleteEmployee = {
    __typename?: 'DeleteEmployee';
    success: Scalars['Boolean']['output'];
};

export type DeleteInternalOrder = {
    __typename?: 'DeleteInternalOrder';
    success: Scalars['Boolean']['output'];
};

export type DeleteLocality = {
    __typename?: 'DeleteLocality';
    success: Scalars['Boolean']['output'];
};

export type DeleteProduct = {
    __typename?: 'DeleteProduct';
    success: Scalars['Boolean']['output'];
};

export type DeleteSale = {
    __typename?: 'DeleteSale';
    success: Scalars['Boolean']['output'];
};

export type DeleteSupplier = {
    __typename?: 'DeleteSupplier';
    success: Scalars['Boolean']['output'];
};

export type DeleteSupplierOrder = {
    __typename?: 'DeleteSupplierOrder';
    success: Scalars['Boolean']['output'];
};

export type Employee = {
    __typename?: 'Employee';
    createdOn: Scalars['DateTime']['output'];
    id: Scalars['ID']['output'];
    modifiedOn: Scalars['DateTime']['output'];
    offices: Array<Office>;
    user: User;
};

export type EmployeeOffice = {
    __typename?: 'EmployeeOffice';
    createdOn: Scalars['DateTime']['output'];
    employee: Employee;
    id: Scalars['ID']['output'];
    modifiedOn: Scalars['DateTime']['output'];
    office: Office;
};

export type ExpiredContract = {
    __typename?: 'ExpiredContract';
    contract: Maybe<Contract>;
    error: Maybe<Scalars['String']['output']>;
};

export type FailedReturnContract = {
    __typename?: 'FailedReturnContract';
    contract: Maybe<Contract>;
    error: Maybe<Scalars['String']['output']>;
};

export type FinishContract = {
    __typename?: 'FinishContract';
    contract: Maybe<Contract>;
    error: Maybe<Scalars['String']['output']>;
};

export type InProgressInternalOrder = {
    __typename?: 'InProgressInternalOrder';
    error: Maybe<Scalars['String']['output']>;
    internalOrder: Maybe<InternalOrder>;
};

export type InternalOrder = {
    __typename?: 'InternalOrder';
    approximateDeliveryDate: Maybe<Scalars['Date']['output']>;
    createdOn: Scalars['DateTime']['output'];
    historyEntries: Array<InternalOrderHistory>;
    id: Scalars['ID']['output'];
    latestHistoryEntry: Maybe<InternalOrderHistory>;
    modifiedOn: Scalars['DateTime']['output'];
    orderItems: Array<InternalOrderItem>;
    requestedForDate: Maybe<Scalars['Date']['output']>;
    sourceOffice: Office;
    targetOffice: Office;
};

export type InternalOrderHistory = {
    __typename?: 'InternalOrderHistory';
    createdOn: Scalars['DateTime']['output'];
    currentOrder: Maybe<InternalOrder>;
    id: Scalars['ID']['output'];
    internalOrder: InternalOrder;
    modifiedOn: Scalars['DateTime']['output'];
    note: Maybe<Scalars['String']['output']>;
    responsibleUser: Maybe<User>;
    status: InternalOrderHistoryStatusChoices;
};

/** An enumeration. */
export enum InternalOrderHistoryStatusChoices {
    Canceled = 'CANCELED',
    Completed = 'COMPLETED',
    InProgress = 'IN_PROGRESS',
    Pending = 'PENDING',
}

export type InternalOrderItem = {
    __typename?: 'InternalOrderItem';
    createdOn: Scalars['DateTime']['output'];
    id: Scalars['ID']['output'];
    internalOrder: InternalOrder;
    modifiedOn: Scalars['DateTime']['output'];
    product: Product;
    quantityOrdered: Scalars['Int']['output'];
    quantityReceived: Scalars['Int']['output'];
};

export type Locality = {
    __typename?: 'Locality';
    clients: Array<Client>;
    contracts: Array<Contract>;
    createdOn: Scalars['DateTime']['output'];
    id: Scalars['ID']['output'];
    modifiedOn: Scalars['DateTime']['output'];
    name: Scalars['String']['output'];
    officeSet: Array<Office>;
    postalCode: Scalars['String']['output'];
    state: StateChoices;
    suppliers: Array<Supplier>;
};

export type Login = {
    __typename?: 'Login';
    token: Scalars['String']['output'];
    user: User;
};

export type Mutation = {
    __typename?: 'Mutation';
    cancelContract: Maybe<CancelContract>;
    cancelInternalOrder: Maybe<CancelInternalOrder>;
    cancelOrderSupplier: Maybe<CancelOrderSupplier>;
    createBrand: Maybe<CreateBrand>;
    createClient: Maybe<CreateClient>;
    createContract: Maybe<CreateContract>;
    createEmployee: Maybe<CreateEmployee>;
    createInternalOrder: Maybe<CreateInternalOrder>;
    createLocality: Maybe<CreateLocality>;
    createProduct: Maybe<CreateProduct>;
    createSale: Maybe<CreateSale>;
    createSupplier: Maybe<CreateSupplier>;
    createSupplierOrder: Maybe<CreateSupplierOrder>;
    deleteClient: Maybe<DeleteClient>;
    deleteContract: Maybe<DeleteContract>;
    deleteEmployee: Maybe<DeleteEmployee>;
    deleteInternalOrder: Maybe<DeleteInternalOrder>;
    deleteLocality: Maybe<DeleteLocality>;
    deleteProduct: Maybe<DeleteProduct>;
    deleteSale: Maybe<DeleteSale>;
    deleteSupplier: Maybe<DeleteSupplier>;
    deleteSupplierOrder: Maybe<DeleteSupplierOrder>;
    expiredContract: Maybe<ExpiredContract>;
    failedReturnContract: Maybe<FailedReturnContract>;
    finishContract: Maybe<FinishContract>;
    inProgressInternalOrder: Maybe<InProgressInternalOrder>;
    login: Maybe<Login>;
    payContractDeposit: Maybe<PayContractDeposit>;
    payTotalContract: Maybe<PayTotalContract>;
    receiveInternalOrder: Maybe<ReceiveInternalOrder>;
    receiveOrderSupplier: Maybe<ReceiveOrderSupplier>;
    refreshToken: Maybe<Refresh>;
    resetEmployeePassword: Maybe<ResetEmployeePassword>;
    startContract: Maybe<StartContract>;
    successfulReturnContract: Maybe<SuccessfulReturnContract>;
    /** Obtain JSON Web Token mutation */
    tokenAuth: Maybe<ObtainJsonWebToken>;
    updateClient: Maybe<UpdateClient>;
    updateEmployee: Maybe<UpdateEmployee>;
    updateLocality: Maybe<UpdateLocality>;
    updateProduct: Maybe<UpdateProduct>;
    updateSupplier: Maybe<UpdateSupplier>;
    verifyToken: Maybe<Verify>;
};

export type MutationCancelContractArgs = {
    id: Scalars['ID']['input'];
};

export type MutationCancelInternalOrderArgs = {
    id: Scalars['ID']['input'];
};

export type MutationCancelOrderSupplierArgs = {
    orderSupplierId: Scalars['ID']['input'];
};

export type MutationCreateBrandArgs = {
    name: Scalars['String']['input'];
};

export type MutationCreateClientArgs = {
    clientData: CreateClientInput;
};

export type MutationCreateContractArgs = {
    contractData: ContractInput;
    itemsData: Array<ContractItemInput>;
};

export type MutationCreateEmployeeArgs = {
    employeeData: CreateEmployeeInput;
};

export type MutationCreateInternalOrderArgs = {
    data: CreateInternalOrderInput;
};

export type MutationCreateLocalityArgs = {
    name: Scalars['String']['input'];
    postalCode: Scalars['String']['input'];
    state: StateChoices;
};

export type MutationCreateProductArgs = {
    productData: ProductDataInput;
    services: InputMaybe<Array<InputMaybe<ProductServiceInput>>>;
    stockItems: InputMaybe<Array<InputMaybe<ProductStockItemInput>>>;
    suppliers: InputMaybe<Array<InputMaybe<ProductSupplierInput>>>;
};

export type MutationCreateSaleArgs = {
    data: CreateSaleInput;
};

export type MutationCreateSupplierArgs = {
    data: CreateSupplierInput;
};

export type MutationCreateSupplierOrderArgs = {
    data: CreateSupplierOrderInput;
};

export type MutationDeleteClientArgs = {
    id: Scalars['ID']['input'];
};

export type MutationDeleteContractArgs = {
    id: Scalars['ID']['input'];
};

export type MutationDeleteEmployeeArgs = {
    id: Scalars['ID']['input'];
};

export type MutationDeleteInternalOrderArgs = {
    id: Scalars['ID']['input'];
};

export type MutationDeleteLocalityArgs = {
    id: Scalars['ID']['input'];
};

export type MutationDeleteProductArgs = {
    id: Scalars['ID']['input'];
};

export type MutationDeleteSaleArgs = {
    id: Scalars['ID']['input'];
};

export type MutationDeleteSupplierArgs = {
    id: Scalars['ID']['input'];
};

export type MutationDeleteSupplierOrderArgs = {
    id: Scalars['ID']['input'];
};

export type MutationExpiredContractArgs = {
    id: Scalars['ID']['input'];
};

export type MutationFailedReturnContractArgs = {
    id: Scalars['ID']['input'];
};

export type MutationFinishContractArgs = {
    id: Scalars['ID']['input'];
};

export type MutationInProgressInternalOrderArgs = {
    id: Scalars['ID']['input'];
};

export type MutationLoginArgs = {
    email: Scalars['String']['input'];
    password: Scalars['String']['input'];
};

export type MutationPayContractDepositArgs = {
    id: Scalars['ID']['input'];
};

export type MutationPayTotalContractArgs = {
    id: Scalars['ID']['input'];
};

export type MutationReceiveInternalOrderArgs = {
    id: Scalars['ID']['input'];
};

export type MutationReceiveOrderSupplierArgs = {
    orderSupplierId: Scalars['ID']['input'];
};

export type MutationRefreshTokenArgs = {
    token: InputMaybe<Scalars['String']['input']>;
};

export type MutationResetEmployeePasswordArgs = {
    id: Scalars['ID']['input'];
};

export type MutationStartContractArgs = {
    id: Scalars['ID']['input'];
};

export type MutationSuccessfulReturnContractArgs = {
    id: Scalars['ID']['input'];
};

export type MutationTokenAuthArgs = {
    email: Scalars['String']['input'];
    password: Scalars['String']['input'];
};

export type MutationUpdateClientArgs = {
    clientData: UpdateClientInput;
    id: Scalars['ID']['input'];
};

export type MutationUpdateEmployeeArgs = {
    employeeData: UpdateEmployeeInput;
    id: Scalars['ID']['input'];
};

export type MutationUpdateLocalityArgs = {
    id: Scalars['ID']['input'];
    name: InputMaybe<Scalars['String']['input']>;
    postalCode: InputMaybe<Scalars['String']['input']>;
    state: InputMaybe<StateChoices>;
};

export type MutationUpdateProductArgs = {
    id: Scalars['ID']['input'];
    productData: ProductDataInput;
    services: Array<ProductServiceInput>;
    stockItems: Array<ProductStockItemInput>;
    suppliers: Array<ProductSupplierInput>;
};

export type MutationUpdateSupplierArgs = {
    id: Scalars['ID']['input'];
    input: UpdateSupplierInput;
};

export type MutationVerifyTokenArgs = {
    token: InputMaybe<Scalars['String']['input']>;
};

/** Obtain JSON Web Token mutation */
export type ObtainJsonWebToken = {
    __typename?: 'ObtainJSONWebToken';
    payload: Scalars['GenericScalar']['output'];
    refreshExpiresIn: Scalars['Int']['output'];
    token: Scalars['String']['output'];
};

export type Office = {
    __typename?: 'Office';
    contracts: Array<Contract>;
    createdOn: Scalars['DateTime']['output'];
    employees: Array<EmployeeOffice>;
    houseNumber: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    incomingInternalOrders: Array<InternalOrder>;
    incomingSupplierOrders: Array<OrderSupplier>;
    locality: Locality;
    modifiedOn: Scalars['DateTime']['output'];
    name: Scalars['String']['output'];
    note: Maybe<Scalars['String']['output']>;
    outgoingInternalOrders: Array<InternalOrder>;
    sales: Array<Sale>;
    stockItems: Array<ProductStockInOffice>;
    street: Scalars['String']['output'];
};

export type OrderSupplier = {
    __typename?: 'OrderSupplier';
    approximateDeliveryDate: Maybe<Scalars['Date']['output']>;
    createdOn: Scalars['DateTime']['output'];
    historyEntries: Array<SupplierOrderHistory>;
    id: Scalars['ID']['output'];
    latestHistoryEntry: Maybe<SupplierOrderHistory>;
    modifiedOn: Scalars['DateTime']['output'];
    orderItems: Array<SupplierOrderProduct>;
    requestedForDate: Maybe<Scalars['Date']['output']>;
    supplier: Supplier;
    targetOffice: Office;
    total: Scalars['BigInt']['output'];
};

export type PaginatedClientQueryResult = {
    __typename?: 'PaginatedClientQueryResult';
    count: Scalars['Int']['output'];
    numPages: Scalars['Int']['output'];
    results: Array<Client>;
};

export type PaginatedContractQueryResult = {
    __typename?: 'PaginatedContractQueryResult';
    count: Scalars['Int']['output'];
    numPages: Scalars['Int']['output'];
    results: Array<Contract>;
};

export type PaginatedEmployeeQueryResult = {
    __typename?: 'PaginatedEmployeeQueryResult';
    count: Scalars['Int']['output'];
    numPages: Scalars['Int']['output'];
    results: Array<Employee>;
};

export type PaginatedInternalOrderQueryResult = {
    __typename?: 'PaginatedInternalOrderQueryResult';
    count: Scalars['Int']['output'];
    numPages: Scalars['Int']['output'];
    results: Array<InternalOrder>;
};

export type PaginatedLocalityQueryResult = {
    __typename?: 'PaginatedLocalityQueryResult';
    count: Scalars['Int']['output'];
    numPages: Scalars['Int']['output'];
    results: Array<Locality>;
};

export type PaginatedOrderSupplierQueryResult = {
    __typename?: 'PaginatedOrderSupplierQueryResult';
    count: Scalars['Int']['output'];
    numPages: Scalars['Int']['output'];
    results: Array<OrderSupplier>;
};

export type PaginatedProductQueryResult = {
    __typename?: 'PaginatedProductQueryResult';
    count: Scalars['Int']['output'];
    numPages: Scalars['Int']['output'];
    results: Array<Product>;
};

export type PaginatedSaleQueryResult = {
    __typename?: 'PaginatedSaleQueryResult';
    count: Scalars['Int']['output'];
    numPages: Scalars['Int']['output'];
    results: Array<Sale>;
};

export type PaginatedSupplierQueryResult = {
    __typename?: 'PaginatedSupplierQueryResult';
    count: Scalars['Int']['output'];
    numPages: Scalars['Int']['output'];
    results: Array<Supplier>;
};

export type PayContractDeposit = {
    __typename?: 'PayContractDeposit';
    contract: Maybe<Contract>;
    error: Maybe<Scalars['String']['output']>;
};

export type PayTotalContract = {
    __typename?: 'PayTotalContract';
    contract: Maybe<Contract>;
    error: Maybe<Scalars['String']['output']>;
};

export type Product = {
    __typename?: 'Product';
    brand: Maybe<Brand>;
    contractItems: Array<ContractItem>;
    createdOn: Scalars['DateTime']['output'];
    description: Maybe<Scalars['String']['output']>;
    id: Scalars['ID']['output'];
    internalOrders: Array<InternalOrderItem>;
    modifiedOn: Scalars['DateTime']['output'];
    name: Scalars['String']['output'];
    price: Maybe<Scalars['Int']['output']>;
    relatedSupplierOrders: Array<SupplierOrderProduct>;
    saleItems: Array<SaleItem>;
    services: Array<ProductService>;
    sku: Maybe<Scalars['String']['output']>;
    stockItems: Array<ProductStockInOffice>;
    suppliers: Array<ProductSupplier>;
    type: ProductTypeChoices;
};

export type ProductDataInput = {
    brandId: InputMaybe<Scalars['ID']['input']>;
    description: InputMaybe<Scalars['String']['input']>;
    name: Scalars['String']['input'];
    price: InputMaybe<Scalars['Float']['input']>;
    sku: InputMaybe<Scalars['String']['input']>;
    type: Scalars['String']['input'];
};

export type ProductService = {
    __typename?: 'ProductService';
    /** Periodo de facturación en días */
    billingPeriod: Maybe<Scalars['Int']['output']>;
    billingType: CoreProductServiceBillingTypeChoices;
    contractItems: Array<ContractItemService>;
    createdOn: Scalars['DateTime']['output'];
    id: Scalars['ID']['output'];
    modifiedOn: Scalars['DateTime']['output'];
    name: Scalars['String']['output'];
    price: Scalars['Int']['output'];
    product: Product;
};

/** An enumeration. */
export enum ProductServiceBillingTypeChoices {
    Custom = 'CUSTOM',
    Monthly = 'MONTHLY',
    OneTime = 'ONE_TIME',
    Weekly = 'WEEKLY',
}

export type ProductServiceInput = {
    billingPeriod: InputMaybe<Scalars['Int']['input']>;
    billingType: ProductServiceBillingTypeChoices;
    name: Scalars['String']['input'];
    price: Scalars['Float']['input'];
    serviceId: InputMaybe<Scalars['ID']['input']>;
};

export type ProductStockInOffice = {
    __typename?: 'ProductStockInOffice';
    createdOn: Scalars['DateTime']['output'];
    id: Scalars['ID']['output'];
    modifiedOn: Scalars['DateTime']['output'];
    office: Office;
    product: Product;
    quantity: Scalars['Int']['output'];
};

export type ProductStockItemInput = {
    officeId: Scalars['ID']['input'];
    quantity: Scalars['Int']['input'];
};

export type ProductStocksInDateRange = {
    __typename?: 'ProductStocksInDateRange';
    office: Office;
    quantity: Scalars['Int']['output'];
};

export type ProductSupplier = {
    __typename?: 'ProductSupplier';
    createdOn: Scalars['DateTime']['output'];
    id: Scalars['ID']['output'];
    modifiedOn: Scalars['DateTime']['output'];
    price: Scalars['Int']['output'];
    product: Product;
    supplier: Supplier;
};

export type ProductSupplierInput = {
    price: Scalars['Float']['input'];
    supplierId: Scalars['ID']['input'];
};

/** An enumeration. */
export enum ProductTypeChoices {
    Alquilable = 'ALQUILABLE',
    Comerciable = 'COMERCIABLE',
}

export type Query = {
    __typename?: 'Query';
    allClients: Array<Client>;
    allLocalities: Array<Locality>;
    allProducts: Array<Product>;
    allSales: Array<Sale>;
    allSuppliers: Array<Supplier>;
    brands: Array<Brand>;
    clientById: Maybe<Client>;
    clientExists: Scalars['Boolean']['output'];
    clients: PaginatedClientQueryResult;
    clientsCsv: Scalars['String']['output'];
    contractById: Maybe<Contract>;
    contracts: PaginatedContractQueryResult;
    contractsByClientId: Array<Contract>;
    contractsCsv: Scalars['String']['output'];
    employeeById: Maybe<Employee>;
    employees: PaginatedEmployeeQueryResult;
    employeesCsv: Scalars['String']['output'];
    internalOrderById: Maybe<InternalOrder>;
    internalOrders: PaginatedInternalOrderQueryResult;
    internalOrdersCsv: Scalars['String']['output'];
    localities: PaginatedLocalityQueryResult;
    localitiesCsv: Scalars['String']['output'];
    officeById: Maybe<Office>;
    offices: Array<Office>;
    officesCsv: Scalars['String']['output'];
    productById: Maybe<Product>;
    productExists: Scalars['Boolean']['output'];
    productStocksInDateRange: Array<ProductStocksInDateRange>;
    products: PaginatedProductQueryResult;
    productsCsv: Scalars['String']['output'];
    productsStocksByOfficeId: Array<ProductStockInOffice>;
    productsSuppliedBySupplierId: Array<Product>;
    saleById: Maybe<Sale>;
    saleItems: Array<SaleItem>;
    sales: PaginatedSaleQueryResult;
    salesByClientId: Array<Sale>;
    salesCsv: Scalars['String']['output'];
    supplierById: Maybe<Supplier>;
    supplierOrderById: Maybe<OrderSupplier>;
    supplierOrders: PaginatedOrderSupplierQueryResult;
    supplierOrdersBySupplierId: Array<OrderSupplier>;
    suppliers: PaginatedSupplierQueryResult;
    suppliersCsv: Scalars['String']['output'];
    suppliersOrdersCsv: Scalars['String']['output'];
    user: Maybe<User>;
    users: Array<User>;
};

export type QueryAllClientsArgs = {
    query?: InputMaybe<Scalars['String']['input']>;
};

export type QueryClientByIdArgs = {
    id: Scalars['ID']['input'];
};

export type QueryClientExistsArgs = {
    dni: InputMaybe<Scalars['String']['input']>;
    email: InputMaybe<Scalars['String']['input']>;
};

export type QueryClientsArgs = {
    localities: InputMaybe<Array<Scalars['ID']['input']>>;
    page: InputMaybe<Scalars['Int']['input']>;
    query: InputMaybe<Scalars['String']['input']>;
};

export type QueryContractByIdArgs = {
    id: Scalars['ID']['input'];
};

export type QueryContractsArgs = {
    page: InputMaybe<Scalars['Int']['input']>;
};

export type QueryContractsByClientIdArgs = {
    id: Scalars['ID']['input'];
};

export type QueryEmployeeByIdArgs = {
    id: Scalars['ID']['input'];
};

export type QueryEmployeesArgs = {
    page: InputMaybe<Scalars['Int']['input']>;
    query: InputMaybe<Scalars['String']['input']>;
};

export type QueryInternalOrderByIdArgs = {
    id: Scalars['ID']['input'];
};

export type QueryInternalOrdersArgs = {
    page: InputMaybe<Scalars['Int']['input']>;
};

export type QueryLocalitiesArgs = {
    page: InputMaybe<Scalars['Int']['input']>;
};

export type QueryOfficeByIdArgs = {
    id: Scalars['ID']['input'];
};

export type QueryProductByIdArgs = {
    id: Scalars['ID']['input'];
};

export type QueryProductExistsArgs = {
    sku: Scalars['String']['input'];
};

export type QueryProductStocksInDateRangeArgs = {
    endDate: Scalars['Date']['input'];
    productId: Scalars['ID']['input'];
    startDate: Scalars['Date']['input'];
};

export type QueryProductsArgs = {
    page: InputMaybe<Scalars['Int']['input']>;
    query: InputMaybe<Scalars['String']['input']>;
};

export type QueryProductsStocksByOfficeIdArgs = {
    officeId: Scalars['ID']['input'];
};

export type QueryProductsSuppliedBySupplierIdArgs = {
    supplierId: Scalars['ID']['input'];
};

export type QuerySaleByIdArgs = {
    id: Scalars['ID']['input'];
};

export type QuerySalesArgs = {
    page: InputMaybe<Scalars['Int']['input']>;
};

export type QuerySalesByClientIdArgs = {
    id: Scalars['ID']['input'];
};

export type QuerySupplierByIdArgs = {
    id: Scalars['ID']['input'];
};

export type QuerySupplierOrderByIdArgs = {
    id: Scalars['ID']['input'];
};

export type QuerySupplierOrdersArgs = {
    page: InputMaybe<Scalars['Int']['input']>;
};

export type QuerySupplierOrdersBySupplierIdArgs = {
    id: Scalars['ID']['input'];
};

export type QuerySuppliersArgs = {
    page: InputMaybe<Scalars['Int']['input']>;
    query: InputMaybe<Scalars['String']['input']>;
};

export type ReceiveInternalOrder = {
    __typename?: 'ReceiveInternalOrder';
    error: Maybe<Scalars['String']['output']>;
    internalOrder: Maybe<InternalOrder>;
};

export type ReceiveOrderSupplier = {
    __typename?: 'ReceiveOrderSupplier';
    error: Maybe<Scalars['String']['output']>;
    orderSupplier: Scalars['ID']['output'];
};

export type Refresh = {
    __typename?: 'Refresh';
    payload: Scalars['GenericScalar']['output'];
    refreshExpiresIn: Scalars['Int']['output'];
    token: Scalars['String']['output'];
};

export type ResetEmployeePassword = {
    __typename?: 'ResetEmployeePassword';
    success: Scalars['Boolean']['output'];
};

export type Sale = {
    __typename?: 'Sale';
    client: Client;
    createdOn: Scalars['DateTime']['output'];
    discount: Scalars['BigInt']['output'];
    id: Scalars['ID']['output'];
    modifiedOn: Scalars['DateTime']['output'];
    office: Office;
    saleItems: Array<SaleItem>;
    subtotal: Scalars['BigInt']['output'];
    total: Scalars['BigInt']['output'];
};

export type SaleItem = {
    __typename?: 'SaleItem';
    createdOn: Scalars['DateTime']['output'];
    discount: Scalars['BigInt']['output'];
    id: Scalars['ID']['output'];
    modifiedOn: Scalars['DateTime']['output'];
    product: Product;
    productPrice: Scalars['BigInt']['output'];
    quantity: Scalars['Int']['output'];
    sale: Sale;
    subtotal: Scalars['BigInt']['output'];
    total: Scalars['BigInt']['output'];
};

export type SaleOrderItemInput = {
    discount: Scalars['Int']['input'];
    product: Scalars['String']['input'];
    quantity: Scalars['Int']['input'];
};

export type StartContract = {
    __typename?: 'StartContract';
    contract: Maybe<Contract>;
    error: Maybe<Scalars['String']['output']>;
};

/**
 *
 *     Enum-like class representing choices for states. Inherits from models.TextChoices.
 *
 *     It provides a set of predefined choices for Argentine states, each choice being a tuple where the first value is the internal identifier and the second value is the human-readable name.
 *
 */
export enum StateChoices {
    BuenosAires = 'BUENOS_AIRES',
    Catamarca = 'CATAMARCA',
    Chaco = 'CHACO',
    Chubut = 'CHUBUT',
    Cordoba = 'CORDOBA',
    Corrientes = 'CORRIENTES',
    EntreRios = 'ENTRE_RIOS',
    Formosa = 'FORMOSA',
    Jujuy = 'JUJUY',
    LaPampa = 'LA_PAMPA',
    LaRioja = 'LA_RIOJA',
    Mendoza = 'MENDOZA',
    Misiones = 'MISIONES',
    Neuquen = 'NEUQUEN',
    RioNegro = 'RIO_NEGRO',
    Salta = 'SALTA',
    SantaCruz = 'SANTA_CRUZ',
    SantaFe = 'SANTA_FE',
    SantiagoDelEstero = 'SANTIAGO_DEL_ESTERO',
    SanJuan = 'SAN_JUAN',
    SanLuis = 'SAN_LUIS',
    TierraDelFuego = 'TIERRA_DEL_FUEGO',
    Tucuman = 'TUCUMAN',
}

export type SuccessfulReturnContract = {
    __typename?: 'SuccessfulReturnContract';
    contract: Maybe<Contract>;
    error: Maybe<Scalars['String']['output']>;
};

export type Supplier = {
    __typename?: 'Supplier';
    createdOn: Scalars['DateTime']['output'];
    cuit: Scalars['String']['output'];
    email: Scalars['String']['output'];
    /** Número de la calle donde vive el proveedor */
    houseNumber: Scalars['String']['output'];
    /** Número de la casa o departamento */
    houseUnit: Maybe<Scalars['String']['output']>;
    id: Scalars['ID']['output'];
    locality: Locality;
    modifiedOn: Scalars['DateTime']['output'];
    name: Scalars['String']['output'];
    note: Maybe<Scalars['String']['output']>;
    outgoingSupplierOrders: Array<OrderSupplier>;
    /** Código de área del teléfono del proveedor */
    phoneCode: Scalars['String']['output'];
    /** Número de teléfono del proveedor */
    phoneNumber: Scalars['String']['output'];
    products: Array<ProductSupplier>;
    /** Nombre de la calle donde vive el proveedor */
    streetName: Scalars['String']['output'];
};

export type SupplierOrderHistory = {
    __typename?: 'SupplierOrderHistory';
    createdOn: Scalars['DateTime']['output'];
    currentOrder: Maybe<OrderSupplier>;
    id: Scalars['ID']['output'];
    modifiedOn: Scalars['DateTime']['output'];
    status: CoreSupplierOrderHistoryStatusChoices;
    supplierOrder: OrderSupplier;
    user: Maybe<User>;
};

export type SupplierOrderProduct = {
    __typename?: 'SupplierOrderProduct';
    createdOn: Scalars['DateTime']['output'];
    id: Scalars['ID']['output'];
    modifiedOn: Scalars['DateTime']['output'];
    product: Product;
    productPrice: Scalars['BigInt']['output'];
    quantityOrdered: Scalars['Int']['output'];
    quantityReceived: Scalars['Int']['output'];
    supplierOrder: OrderSupplier;
    total: Scalars['BigInt']['output'];
};

export type UpdateClient = {
    __typename?: 'UpdateClient';
    client: Maybe<Client>;
    error: Maybe<Scalars['String']['output']>;
};

export type UpdateClientInput = {
    dni: InputMaybe<Scalars['String']['input']>;
    email: InputMaybe<Scalars['String']['input']>;
    firstName: InputMaybe<Scalars['String']['input']>;
    houseNumber: InputMaybe<Scalars['String']['input']>;
    houseUnit: InputMaybe<Scalars['String']['input']>;
    lastName: InputMaybe<Scalars['String']['input']>;
    localityId: InputMaybe<Scalars['ID']['input']>;
    phoneCode: InputMaybe<Scalars['String']['input']>;
    phoneNumber: InputMaybe<Scalars['String']['input']>;
    streetName: InputMaybe<Scalars['String']['input']>;
};

export type UpdateEmployee = {
    __typename?: 'UpdateEmployee';
    employee: Maybe<Employee>;
    error: Maybe<Scalars['String']['output']>;
};

export type UpdateEmployeeInput = {
    email: Scalars['String']['input'];
    firstName: Scalars['String']['input'];
    lastName: Scalars['String']['input'];
    offices: Array<Scalars['ID']['input']>;
};

export type UpdateLocality = {
    __typename?: 'UpdateLocality';
    error: Maybe<Scalars['String']['output']>;
    locality: Maybe<Locality>;
};

export type UpdateProduct = {
    __typename?: 'UpdateProduct';
    error: Maybe<Scalars['String']['output']>;
    product: Maybe<Product>;
};

export type UpdateSupplier = {
    __typename?: 'UpdateSupplier';
    error: Maybe<Scalars['String']['output']>;
    supplier: Maybe<Supplier>;
};

export type UpdateSupplierInput = {
    cuit: InputMaybe<Scalars['String']['input']>;
    email: InputMaybe<Scalars['String']['input']>;
    houseNumber: InputMaybe<Scalars['String']['input']>;
    houseUnit: InputMaybe<Scalars['String']['input']>;
    locality: InputMaybe<Scalars['ID']['input']>;
    name: InputMaybe<Scalars['String']['input']>;
    note: InputMaybe<Scalars['String']['input']>;
    phoneCode: InputMaybe<Scalars['String']['input']>;
    phoneNumber: InputMaybe<Scalars['String']['input']>;
    streetName: InputMaybe<Scalars['String']['input']>;
};

export type User = {
    __typename?: 'User';
    admin: Maybe<Admin>;
    contractsCreated: Array<Contract>;
    dateJoined: Scalars['DateTime']['output'];
    email: Scalars['String']['output'];
    employee: Maybe<Employee>;
    firstName: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    internalOrderHistories: Array<InternalOrderHistory>;
    /** Indica si el usuario debe ser tratado como activo. Desmarque esta opción en lugar de borrar la cuenta. */
    isActive: Scalars['Boolean']['output'];
    /** Designates whether the user can log into the admin site. */
    isStaff: Scalars['Boolean']['output'];
    /** Indica que este usuario tiene todos los permisos sin asignárselos explícitamente. */
    isSuperuser: Scalars['Boolean']['output'];
    lastLogin: Maybe<Scalars['DateTime']['output']>;
    lastName: Scalars['String']['output'];
    supplierOrderHistories: Array<SupplierOrderHistory>;
};

export type Verify = {
    __typename?: 'Verify';
    payload: Scalars['GenericScalar']['output'];
};

export type CreateBrandMutationVariables = Exact<{
    name: Scalars['String']['input'];
}>;

export type CreateBrandMutation = {
    __typename?: 'Mutation';
    createBrand: {
        __typename?: 'CreateBrand';
        error: string | null;
        brand: { __typename?: 'Brand'; id: string; name: string } | null;
    } | null;
};

export type BrandsQueryVariables = Exact<{ [key: string]: never }>;

export type BrandsQuery = {
    __typename?: 'Query';
    brands: Array<{ __typename?: 'Brand'; id: string; name: string }>;
};

export type ClientsQueryVariables = Exact<{
    page: InputMaybe<Scalars['Int']['input']>;
    localities: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
    query: InputMaybe<Scalars['String']['input']>;
}>;

export type ClientsQuery = {
    __typename?: 'Query';
    clients: {
        __typename?: 'PaginatedClientQueryResult';
        count: number;
        numPages: number;
        results: Array<{
            __typename?: 'Client';
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phoneCode: string;
            phoneNumber: string;
            streetName: string;
            houseUnit: string | null;
            houseNumber: string;
            dni: string;
            note: string | null;
            locality: {
                __typename?: 'Locality';
                id: string;
                name: string;
                state: StateChoices;
                postalCode: string;
            };
        }>;
    };
};

export type ClientByIdQueryVariables = Exact<{
    id: Scalars['ID']['input'];
}>;

export type ClientByIdQuery = {
    __typename?: 'Query';
    clientById: {
        __typename?: 'Client';
        firstName: string;
        lastName: string;
        email: string;
        dni: string;
        phoneCode: string;
        phoneNumber: string;
        houseNumber: string;
        houseUnit: string | null;
        streetName: string;
        locality: {
            __typename?: 'Locality';
            id: string;
            name: string;
            state: StateChoices;
            postalCode: string;
        };
    } | null;
};

export type ContractsByClientIdQueryVariables = Exact<{
    id: Scalars['ID']['input'];
}>;

export type ContractsByClientIdQuery = {
    __typename?: 'Query';
    contractsByClientId: Array<{
        __typename?: 'Contract';
        id: string;
        createdOn: any;
        expirationDate: any;
        contractStartDatetime: any;
        contractEndDatetime: any;
        houseNumber: string;
        streetName: string;
        houseUnit: string | null;
        total: any;
        latestHistoryEntry: {
            __typename?: 'ContractHistory';
            status: ContractStatusChoices;
        } | null;
        locality: { __typename?: 'Locality'; name: string; state: StateChoices };
        contractItems: Array<{
            __typename?: 'ContractItem';
            id: string;
            quantity: number;
            product: {
                __typename?: 'Product';
                name: string;
                price: number | null;
                brand: { __typename?: 'Brand'; name: string } | null;
            };
        }>;
    }>;
};

export type SalesByClientIdQueryVariables = Exact<{
    id: Scalars['ID']['input'];
}>;

export type SalesByClientIdQuery = {
    __typename?: 'Query';
    salesByClientId: Array<{
        __typename?: 'Sale';
        id: string;
        createdOn: any;
        total: any;
        saleItems: Array<{
            __typename?: 'SaleItem';
            id: string;
            quantity: number;
            product: {
                __typename?: 'Product';
                name: string;
                price: number | null;
                brand: { __typename?: 'Brand'; name: string } | null;
            };
        }>;
    }>;
};

export type CreateClientMutationVariables = Exact<{
    clientData: CreateClientInput;
}>;

export type CreateClientMutation = {
    __typename?: 'Mutation';
    createClient: {
        __typename?: 'CreateClient';
        error: string | null;
        client: {
            __typename?: 'Client';
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            dni: string;
            phoneCode: string;
            phoneNumber: string;
            houseNumber: string;
            houseUnit: string | null;
            streetName: string;
            locality: {
                __typename?: 'Locality';
                id: string;
                name: string;
                state: StateChoices;
                postalCode: string;
            };
        } | null;
    } | null;
};

export type UpdateClientMutationVariables = Exact<{
    id: Scalars['ID']['input'];
    clientData: UpdateClientInput;
}>;

export type UpdateClientMutation = {
    __typename?: 'Mutation';
    updateClient: {
        __typename?: 'UpdateClient';
        error: string | null;
        client: { __typename?: 'Client'; id: string } | null;
    } | null;
};

export type DeleteClientMutationVariables = Exact<{
    id: Scalars['ID']['input'];
}>;

export type DeleteClientMutation = {
    __typename?: 'Mutation';
    deleteClient: { __typename?: 'DeleteClient'; success: boolean } | null;
};

export type AllClientsQueryVariables = Exact<{
    query: InputMaybe<Scalars['String']['input']>;
}>;

export type AllClientsQuery = {
    __typename?: 'Query';
    allClients: Array<{
        __typename?: 'Client';
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        dni: string;
        phoneCode: string;
        phoneNumber: string;
        houseNumber: string;
        houseUnit: string | null;
        streetName: string;
        locality: {
            __typename?: 'Locality';
            id: string;
            name: string;
            state: StateChoices;
            postalCode: string;
        };
    }>;
};

export type ClientExistsQueryVariables = Exact<{
    email: InputMaybe<Scalars['String']['input']>;
    dni: InputMaybe<Scalars['String']['input']>;
}>;

export type ClientExistsQuery = { __typename?: 'Query'; clientExists: boolean };

export type ContractsQueryVariables = Exact<{
    page: InputMaybe<Scalars['Int']['input']>;
}>;

export type ContractsQuery = {
    __typename?: 'Query';
    contracts: {
        __typename?: 'PaginatedContractQueryResult';
        count: number;
        numPages: number;
        results: Array<{
            __typename?: 'Contract';
            id: string;
            createdOn: any;
            contractStartDatetime: any;
            contractEndDatetime: any;
            client: { __typename?: 'Client'; firstName: string; lastName: string };
            office: { __typename?: 'Office'; name: string };
            latestHistoryEntry: {
                __typename?: 'ContractHistory';
                status: ContractStatusChoices;
            } | null;
        }>;
    };
};

export type ContractByIdQueryVariables = Exact<{
    id: Scalars['ID']['input'];
}>;

export type ContractByIdQuery = {
    __typename?: 'Query';
    contractById: {
        __typename?: 'Contract';
        contractEndDatetime: any;
        contractStartDatetime: any;
        expirationDate: any;
        houseNumber: string;
        houseUnit: string | null;
        streetName: string;
        total: any;
        numberOfRentalDays: number;
        client: {
            __typename?: 'Client';
            firstName: string;
            dni: string;
            email: string;
            houseNumber: string;
            houseUnit: string | null;
            lastName: string;
            phoneNumber: string;
            phoneCode: string;
            streetName: string;
            locality: {
                __typename?: 'Locality';
                name: string;
                state: StateChoices;
                postalCode: string;
            };
        };
        latestHistoryEntry: {
            __typename?: 'ContractHistory';
            status: ContractStatusChoices;
        } | null;
        office: {
            __typename?: 'Office';
            name: string;
            street: string;
            houseNumber: string;
        };
        contractItems: Array<{
            __typename?: 'ContractItem';
            id: string;
            productPrice: any;
            quantity: number;
            productSubtotal: any;
            servicesSubtotal: number;
            shippingSubtotal: number;
            productDiscount: any;
            servicesDiscount: any;
            shippingDiscount: any;
            total: any;
            product: {
                __typename?: 'Product';
                name: string;
                sku: string | null;
                brand: { __typename?: 'Brand'; name: string } | null;
            };
            serviceItems: Array<{
                __typename?: 'ContractItemService';
                price: any;
                discount: any;
                subtotal: any;
                total: any;
                billingType: CoreContractItemServiceBillingTypeChoices;
                billingPeriod: number | null;
                service: { __typename?: 'ProductService'; name: string };
            }>;
        }>;
    } | null;
};

export type CreateContractMutationVariables = Exact<{
    contractData: ContractInput;
    itemsData: Array<ContractItemInput> | ContractItemInput;
}>;

export type CreateContractMutation = {
    __typename?: 'Mutation';
    createContract: {
        __typename?: 'CreateContract';
        contractId: string | null;
        error: string | null;
    } | null;
};

export type DeleteContractMutationVariables = Exact<{
    id: Scalars['ID']['input'];
}>;

export type DeleteContractMutation = {
    __typename?: 'Mutation';
    deleteContract: { __typename?: 'DeleteContract'; success: boolean } | null;
};

export type PayContractDepositMutationVariables = Exact<{
    id: Scalars['ID']['input'];
}>;

export type PayContractDepositMutation = {
    __typename?: 'Mutation';
    payContractDeposit: {
        __typename?: 'PayContractDeposit';
        error: string | null;
        contract: {
            __typename?: 'Contract';
            id: string;
            latestHistoryEntry: {
                __typename?: 'ContractHistory';
                status: ContractStatusChoices;
            } | null;
        } | null;
    } | null;
};

export type PayTotalContractMutationVariables = Exact<{
    id: Scalars['ID']['input'];
}>;

export type PayTotalContractMutation = {
    __typename?: 'Mutation';
    payTotalContract: {
        __typename?: 'PayTotalContract';
        error: string | null;
        contract: {
            __typename?: 'Contract';
            id: string;
            latestHistoryEntry: {
                __typename?: 'ContractHistory';
                status: ContractStatusChoices;
            } | null;
        } | null;
    } | null;
};

export type CancelContractMutationVariables = Exact<{
    id: Scalars['ID']['input'];
}>;

export type CancelContractMutation = {
    __typename?: 'Mutation';
    cancelContract: {
        __typename?: 'CancelContract';
        error: string | null;
        contract: {
            __typename?: 'Contract';
            id: string;
            latestHistoryEntry: {
                __typename?: 'ContractHistory';
                status: ContractStatusChoices;
            } | null;
        } | null;
    } | null;
};

export type ClientsCsvQueryVariables = Exact<{ [key: string]: never }>;

export type ClientsCsvQuery = { __typename?: 'Query'; clientsCsv: string };

export type EmployeesCsvQueryVariables = Exact<{ [key: string]: never }>;

export type EmployeesCsvQuery = { __typename?: 'Query'; employeesCsv: string };

export type ContractsCsvQueryVariables = Exact<{ [key: string]: never }>;

export type ContractsCsvQuery = { __typename?: 'Query'; contractsCsv: string };

export type ProductsCsvQueryVariables = Exact<{ [key: string]: never }>;

export type ProductsCsvQuery = { __typename?: 'Query'; productsCsv: string };

export type LocalitiesCsvQueryVariables = Exact<{ [key: string]: never }>;

export type LocalitiesCsvQuery = { __typename?: 'Query'; localitiesCsv: string };

export type OfficesCsvQueryVariables = Exact<{ [key: string]: never }>;

export type OfficesCsvQuery = { __typename?: 'Query'; officesCsv: string };

export type SalesCsvQueryVariables = Exact<{ [key: string]: never }>;

export type SalesCsvQuery = { __typename?: 'Query'; salesCsv: string };

export type SuppliersCsvQueryVariables = Exact<{ [key: string]: never }>;

export type SuppliersCsvQuery = { __typename?: 'Query'; suppliersCsv: string };

export type InternalOrdersCsvQueryVariables = Exact<{ [key: string]: never }>;

export type InternalOrdersCsvQuery = { __typename?: 'Query'; internalOrdersCsv: string };

export type SuppliersOrdersCsvQueryVariables = Exact<{ [key: string]: never }>;

export type SuppliersOrdersCsvQuery = {
    __typename?: 'Query';
    suppliersOrdersCsv: string;
};

export type DashboardQueryVariables = Exact<{ [key: string]: never }>;

export type DashboardQuery = {
    __typename?: 'Query';
    allSales: Array<{
        __typename?: 'Sale';
        id: string;
        createdOn: any;
        total: any;
        client: { __typename?: 'Client'; firstName: string; lastName: string };
    }>;
    allClients: Array<{ __typename?: 'Client'; id: string }>;
    allProducts: Array<{
        __typename?: 'Product';
        id: string;
        name: string;
        saleItems: Array<{ __typename?: 'SaleItem'; quantity: number }>;
    }>;
};

export type EmployeesQueryVariables = Exact<{
    page: InputMaybe<Scalars['Int']['input']>;
    query: InputMaybe<Scalars['String']['input']>;
}>;

export type EmployeesQuery = {
    __typename?: 'Query';
    employees: {
        __typename?: 'PaginatedEmployeeQueryResult';
        count: number;
        numPages: number;
        results: Array<{
            __typename?: 'Employee';
            id: string;
            user: {
                __typename?: 'User';
                firstName: string;
                lastName: string;
                email: string;
                isActive: boolean;
            };
        }>;
    };
};

export type CreateEmployeeMutationVariables = Exact<{
    employeeData: CreateEmployeeInput;
}>;

export type CreateEmployeeMutation = {
    __typename?: 'Mutation';
    createEmployee: {
        __typename?: 'CreateEmployee';
        error: string | null;
        employee: { __typename?: 'Employee'; id: string } | null;
    } | null;
};

export type EmployeeByIdQueryVariables = Exact<{
    id: Scalars['ID']['input'];
}>;

export type EmployeeByIdQuery = {
    __typename?: 'Query';
    employeeById: {
        __typename?: 'Employee';
        id: string;
        offices: Array<{
            __typename?: 'Office';
            id: string;
            name: string;
            locality: {
                __typename?: 'Locality';
                id: string;
                name: string;
                state: StateChoices;
                postalCode: string;
            };
        }>;
        user: {
            __typename?: 'User';
            firstName: string;
            lastName: string;
            email: string;
            isActive: boolean;
            dateJoined: any;
            lastLogin: any | null;
        };
    } | null;
};

export type DeleteEmployeeMutationVariables = Exact<{
    id: Scalars['ID']['input'];
}>;

export type DeleteEmployeeMutation = {
    __typename?: 'Mutation';
    deleteEmployee: { __typename?: 'DeleteEmployee'; success: boolean } | null;
};

export type UpdateEmployeeMutationVariables = Exact<{
    id: Scalars['ID']['input'];
    employeeData: UpdateEmployeeInput;
}>;

export type UpdateEmployeeMutation = {
    __typename?: 'Mutation';
    updateEmployee: {
        __typename?: 'UpdateEmployee';
        error: string | null;
        employee: { __typename?: 'Employee'; id: string } | null;
    } | null;
};

export type LocalitiesQueryVariables = Exact<{
    page: InputMaybe<Scalars['Int']['input']>;
}>;

export type LocalitiesQuery = {
    __typename?: 'Query';
    localities: {
        __typename?: 'PaginatedLocalityQueryResult';
        count: number;
        numPages: number;
        results: Array<{
            __typename?: 'Locality';
            id: string;
            name: string;
            postalCode: string;
            state: StateChoices;
        }>;
    };
};

export type CreateLocalityMutationVariables = Exact<{
    name: Scalars['String']['input'];
    state: StateChoices;
    postalCode: Scalars['String']['input'];
}>;

export type CreateLocalityMutation = {
    __typename?: 'Mutation';
    createLocality: {
        __typename?: 'CreateLocality';
        error: string | null;
        locality: {
            __typename?: 'Locality';
            id: string;
            name: string;
            state: StateChoices;
            postalCode: string;
        } | null;
    } | null;
};

export type DeleteLocalityMutationVariables = Exact<{
    id: Scalars['ID']['input'];
}>;

export type DeleteLocalityMutation = {
    __typename?: 'Mutation';
    deleteLocality: { __typename?: 'DeleteLocality'; success: boolean } | null;
};

export type AllLocalitiesQueryVariables = Exact<{ [key: string]: never }>;

export type AllLocalitiesQuery = {
    __typename?: 'Query';
    allLocalities: Array<{
        __typename?: 'Locality';
        id: string;
        name: string;
        state: StateChoices;
        postalCode: string;
    }>;
};

export type UpdateLocalityMutationVariables = Exact<{
    id: Scalars['ID']['input'];
    name: InputMaybe<Scalars['String']['input']>;
    state: InputMaybe<StateChoices>;
    postalCode: InputMaybe<Scalars['String']['input']>;
}>;

export type UpdateLocalityMutation = {
    __typename?: 'Mutation';
    updateLocality: {
        __typename?: 'UpdateLocality';
        error: string | null;
        locality: {
            __typename?: 'Locality';
            id: string;
            name: string;
            state: StateChoices;
            postalCode: string;
        } | null;
    } | null;
};

export type OfficesQueryVariables = Exact<{ [key: string]: never }>;

export type OfficesQuery = {
    __typename?: 'Query';
    offices: Array<{
        __typename?: 'Office';
        id: string;
        name: string;
        street: string;
        houseNumber: string;
        locality: {
            __typename?: 'Locality';
            state: StateChoices;
            postalCode: string;
            name: string;
        };
        stockItems: Array<{ __typename?: 'ProductStockInOffice'; quantity: number }>;
    }>;
};

export type InternalOrdersQueryVariables = Exact<{
    page: InputMaybe<Scalars['Int']['input']>;
}>;

export type InternalOrdersQuery = {
    __typename?: 'Query';
    internalOrders: {
        __typename?: 'PaginatedInternalOrderQueryResult';
        count: number;
        numPages: number;
        results: Array<{
            __typename?: 'InternalOrder';
            id: string;
            createdOn: any;
            sourceOffice: { __typename?: 'Office'; id: string; name: string };
            targetOffice: { __typename?: 'Office'; id: string; name: string };
            latestHistoryEntry: {
                __typename?: 'InternalOrderHistory';
                status: InternalOrderHistoryStatusChoices;
            } | null;
        }>;
    };
};

export type InternalOrderByIdQueryVariables = Exact<{
    id: Scalars['ID']['input'];
}>;

export type InternalOrderByIdQuery = {
    __typename?: 'Query';
    internalOrderById: {
        __typename?: 'InternalOrder';
        id: string;
        createdOn: any;
        historyEntries: Array<{
            __typename?: 'InternalOrderHistory';
            id: string;
            createdOn: any;
            status: InternalOrderHistoryStatusChoices;
        }>;
        sourceOffice: {
            __typename?: 'Office';
            id: string;
            houseNumber: string;
            name: string;
            street: string;
            locality: { __typename?: 'Locality'; name: string; postalCode: string };
        };
        targetOffice: {
            __typename?: 'Office';
            id: string;
            houseNumber: string;
            name: string;
            street: string;
            locality: { __typename?: 'Locality'; name: string; postalCode: string };
        };
        latestHistoryEntry: {
            __typename?: 'InternalOrderHistory';
            status: InternalOrderHistoryStatusChoices;
        } | null;
        orderItems: Array<{
            __typename?: 'InternalOrderItem';
            quantityOrdered: number;
            quantityReceived: number;
            product: {
                __typename?: 'Product';
                name: string;
                type: ProductTypeChoices;
                brand: { __typename?: 'Brand'; name: string } | null;
            };
        }>;
    } | null;
};

export type CreateInternalOrderMutationVariables = Exact<{
    data: CreateInternalOrderInput;
}>;

export type CreateInternalOrderMutation = {
    __typename?: 'Mutation';
    createInternalOrder: {
        __typename?: 'CreateInternalOrder';
        error: string | null;
        internalOrder: { __typename?: 'InternalOrder'; id: string } | null;
    } | null;
};

export type CreateSupplierOrderMutationVariables = Exact<{
    data: CreateSupplierOrderInput;
}>;

export type CreateSupplierOrderMutation = {
    __typename?: 'Mutation';
    createSupplierOrder: {
        __typename?: 'CreateSupplierOrder';
        error: string | null;
        supplierOrder: { __typename?: 'OrderSupplier'; id: string } | null;
    } | null;
};

export type SupplierOrdersQueryVariables = Exact<{
    page: InputMaybe<Scalars['Int']['input']>;
}>;

export type SupplierOrdersQuery = {
    __typename?: 'Query';
    supplierOrders: {
        __typename?: 'PaginatedOrderSupplierQueryResult';
        count: number;
        numPages: number;
        results: Array<{
            __typename?: 'OrderSupplier';
            id: string;
            createdOn: any;
            supplier: { __typename?: 'Supplier'; name: string };
            targetOffice: { __typename?: 'Office'; name: string };
            latestHistoryEntry: {
                __typename?: 'SupplierOrderHistory';
                status: CoreSupplierOrderHistoryStatusChoices;
            } | null;
        }>;
    };
};

export type SupplierOrderByIdQueryVariables = Exact<{
    id: Scalars['ID']['input'];
}>;

export type SupplierOrderByIdQuery = {
    __typename?: 'Query';
    supplierOrderById: {
        __typename?: 'OrderSupplier';
        id: string;
        supplier: {
            __typename?: 'Supplier';
            cuit: string;
            name: string;
            email: string;
            houseNumber: string;
            streetName: string;
            phoneCode: string;
            phoneNumber: string;
            locality: {
                __typename?: 'Locality';
                name: string;
                postalCode: string;
                state: StateChoices;
            };
        };
        targetOffice: {
            __typename?: 'Office';
            id: string;
            name: string;
            street: string;
            houseNumber: string;
            locality: { __typename?: 'Locality'; name: string };
        };
        latestHistoryEntry: {
            __typename?: 'SupplierOrderHistory';
            status: CoreSupplierOrderHistoryStatusChoices;
            user: {
                __typename?: 'User';
                firstName: string;
                lastName: string;
                email: string;
            } | null;
        } | null;
        orderItems: Array<{
            __typename?: 'SupplierOrderProduct';
            id: string;
            quantityOrdered: number;
            quantityReceived: number;
            product: {
                __typename?: 'Product';
                id: string;
                name: string;
                type: ProductTypeChoices;
                brand: { __typename?: 'Brand'; name: string } | null;
            };
        }>;
    } | null;
};

export type SupplierOrdersBySupplierIdQueryVariables = Exact<{
    id: Scalars['ID']['input'];
}>;

export type SupplierOrdersBySupplierIdQuery = {
    __typename?: 'Query';
    supplierOrdersBySupplierId: Array<{
        __typename?: 'OrderSupplier';
        id: string;
        createdOn: any;
        targetOffice: {
            __typename?: 'Office';
            name: string;
            street: string;
            houseNumber: string;
        };
        latestHistoryEntry: {
            __typename?: 'SupplierOrderHistory';
            status: CoreSupplierOrderHistoryStatusChoices;
            createdOn: any;
            user: {
                __typename?: 'User';
                email: string;
                firstName: string;
                lastName: string;
            } | null;
        } | null;
        orderItems: Array<{
            __typename?: 'SupplierOrderProduct';
            id: string;
            quantityOrdered: number;
            quantityReceived: number;
            product: {
                __typename?: 'Product';
                id: string;
                name: string;
                price: number | null;
                type: ProductTypeChoices;
                brand: { __typename?: 'Brand'; name: string } | null;
            };
        }>;
    }>;
};

export type CreateSupplierMutationVariables = Exact<{
    data: CreateSupplierInput;
}>;

export type CreateSupplierMutation = {
    __typename?: 'Mutation';
    createSupplier: {
        __typename?: 'CreateSupplier';
        error: string | null;
        supplier: {
            __typename?: 'Supplier';
            id: string;
            cuit: string;
            email: string;
            houseNumber: string;
            houseUnit: string | null;
            name: string;
            note: string | null;
            phoneCode: string;
            phoneNumber: string;
            streetName: string;
            locality: {
                __typename?: 'Locality';
                name: string;
                postalCode: string;
                state: StateChoices;
            };
        } | null;
    } | null;
};

export type DeleteSupplierOrderMutationVariables = Exact<{
    id: Scalars['ID']['input'];
}>;

export type DeleteSupplierOrderMutation = {
    __typename?: 'Mutation';
    deleteSupplierOrder: { __typename?: 'DeleteSupplierOrder'; success: boolean } | null;
};

export type DeleteInternalOrderMutationVariables = Exact<{
    id: Scalars['ID']['input'];
}>;

export type DeleteInternalOrderMutation = {
    __typename?: 'Mutation';
    deleteInternalOrder: { __typename?: 'DeleteInternalOrder'; success: boolean } | null;
};

export type InProgressInternalOrderMutationVariables = Exact<{
    id: Scalars['ID']['input'];
}>;

export type InProgressInternalOrderMutation = {
    __typename?: 'Mutation';
    inProgressInternalOrder: {
        __typename?: 'InProgressInternalOrder';
        error: string | null;
        internalOrder: {
            __typename?: 'InternalOrder';
            id: string;
            latestHistoryEntry: {
                __typename?: 'InternalOrderHistory';
                status: InternalOrderHistoryStatusChoices;
            } | null;
            historyEntries: Array<{
                __typename?: 'InternalOrderHistory';
                id: string;
                createdOn: any;
                status: InternalOrderHistoryStatusChoices;
            }>;
        } | null;
    } | null;
};

export type ReceiveInternalOrderMutationVariables = Exact<{
    id: Scalars['ID']['input'];
}>;

export type ReceiveInternalOrderMutation = {
    __typename?: 'Mutation';
    receiveInternalOrder: {
        __typename?: 'ReceiveInternalOrder';
        error: string | null;
        internalOrder: {
            __typename?: 'InternalOrder';
            id: string;
            latestHistoryEntry: {
                __typename?: 'InternalOrderHistory';
                status: InternalOrderHistoryStatusChoices;
            } | null;
            historyEntries: Array<{
                __typename?: 'InternalOrderHistory';
                id: string;
                createdOn: any;
                status: InternalOrderHistoryStatusChoices;
            }>;
        } | null;
    } | null;
};

export type ReceiveOrderSupplierMutationVariables = Exact<{
    orderSupplierId: Scalars['ID']['input'];
}>;

export type ReceiveOrderSupplierMutation = {
    __typename?: 'Mutation';
    receiveOrderSupplier: {
        __typename?: 'ReceiveOrderSupplier';
        orderSupplier: string;
        error: string | null;
    } | null;
};

export type ProductListItemFragment = {
    __typename?: 'Product';
    id: string;
    name: string;
    price: number | null;
    type: ProductTypeChoices;
    sku: string | null;
    brand: { __typename?: 'Brand'; name: string } | null;
    services: Array<{
        __typename?: 'ProductService';
        id: string;
        name: string;
        price: number;
        billingType: CoreProductServiceBillingTypeChoices;
        billingPeriod: number | null;
    }>;
};

export type ProductsQueryVariables = Exact<{
    page: InputMaybe<Scalars['Int']['input']>;
    query: InputMaybe<Scalars['String']['input']>;
}>;

export type ProductsQuery = {
    __typename?: 'Query';
    products: {
        __typename?: 'PaginatedProductQueryResult';
        count: number;
        numPages: number;
        results: Array<{
            __typename?: 'Product';
            id: string;
            name: string;
            price: number | null;
            type: ProductTypeChoices;
            sku: string | null;
            brand: { __typename?: 'Brand'; name: string } | null;
            services: Array<{
                __typename?: 'ProductService';
                id: string;
                name: string;
                price: number;
                billingType: CoreProductServiceBillingTypeChoices;
                billingPeriod: number | null;
            }>;
        }>;
    };
};

export type ProductByIdQueryVariables = Exact<{
    id: Scalars['ID']['input'];
}>;

export type ProductByIdQuery = {
    __typename?: 'Query';
    productById: {
        __typename?: 'Product';
        sku: string | null;
        name: string;
        description: string | null;
        type: ProductTypeChoices;
        price: number | null;
        brand: { __typename?: 'Brand'; id: string; name: string } | null;
        stockItems: Array<{
            __typename?: 'ProductStockInOffice';
            quantity: number;
            office: {
                __typename?: 'Office';
                id: string;
                name: string;
                locality: { __typename?: 'Locality'; name: string };
            };
        }>;
        services: Array<{
            __typename?: 'ProductService';
            id: string;
            name: string;
            price: number;
        }>;
        suppliers: Array<{
            __typename?: 'ProductSupplier';
            price: number;
            supplier: { __typename?: 'Supplier'; id: string; name: string };
        }>;
    } | null;
};

export type CreateProductMutationVariables = Exact<{
    productData: ProductDataInput;
    stockItems: Array<ProductStockItemInput> | ProductStockItemInput;
    suppliers: Array<ProductSupplierInput> | ProductSupplierInput;
    services: Array<ProductServiceInput> | ProductServiceInput;
}>;

export type CreateProductMutation = {
    __typename?: 'Mutation';
    createProduct: {
        __typename?: 'CreateProduct';
        error: string | null;
        product: {
            __typename?: 'Product';
            id: string;
            name: string;
            price: number | null;
            type: ProductTypeChoices;
            sku: string | null;
            brand: { __typename?: 'Brand'; name: string } | null;
            services: Array<{
                __typename?: 'ProductService';
                id: string;
                name: string;
                price: number;
                billingType: CoreProductServiceBillingTypeChoices;
                billingPeriod: number | null;
            }>;
        } | null;
    } | null;
};

export type UpdateProductMutationVariables = Exact<{
    id: Scalars['ID']['input'];
    productData: ProductDataInput;
    stockItems: Array<ProductStockItemInput> | ProductStockItemInput;
    suppliers: Array<ProductSupplierInput> | ProductSupplierInput;
    services: Array<ProductServiceInput> | ProductServiceInput;
}>;

export type UpdateProductMutation = {
    __typename?: 'Mutation';
    updateProduct: {
        __typename?: 'UpdateProduct';
        error: string | null;
        product: {
            __typename?: 'Product';
            id: string;
            name: string;
            price: number | null;
            type: ProductTypeChoices;
            sku: string | null;
            brand: { __typename?: 'Brand'; name: string } | null;
            services: Array<{
                __typename?: 'ProductService';
                id: string;
                name: string;
                price: number;
                billingType: CoreProductServiceBillingTypeChoices;
                billingPeriod: number | null;
            }>;
        } | null;
    } | null;
};

export type ProductsStocksByOfficeIdQueryVariables = Exact<{
    officeId: Scalars['ID']['input'];
}>;

export type ProductsStocksByOfficeIdQuery = {
    __typename?: 'Query';
    productsStocksByOfficeId: Array<{
        __typename?: 'ProductStockInOffice';
        id: string;
        quantity: number;
        product: { __typename?: 'Product'; id: string; name: string };
    }>;
};

export type ProductsSuppliedBySupplierIdQueryVariables = Exact<{
    supplierId: Scalars['ID']['input'];
}>;

export type ProductsSuppliedBySupplierIdQuery = {
    __typename?: 'Query';
    productsSuppliedBySupplierId: Array<{
        __typename?: 'Product';
        id: string;
        name: string;
        price: number | null;
    }>;
};

export type DeleteProductMutationVariables = Exact<{
    id: Scalars['ID']['input'];
}>;

export type DeleteProductMutation = {
    __typename?: 'Mutation';
    deleteProduct: { __typename?: 'DeleteProduct'; success: boolean } | null;
};

export type AllProductsQueryVariables = Exact<{ [key: string]: never }>;

export type AllProductsQuery = {
    __typename?: 'Query';
    allProducts: Array<{
        __typename?: 'Product';
        id: string;
        name: string;
        price: number | null;
        type: ProductTypeChoices;
        sku: string | null;
        brand: { __typename?: 'Brand'; name: string } | null;
        services: Array<{
            __typename?: 'ProductService';
            id: string;
            name: string;
            price: number;
            billingType: CoreProductServiceBillingTypeChoices;
            billingPeriod: number | null;
        }>;
    }>;
};

export type ProductExistsQueryVariables = Exact<{
    sku: Scalars['String']['input'];
}>;

export type ProductExistsQuery = { __typename?: 'Query'; productExists: boolean };

export type ProductStocksInDateRangeQueryVariables = Exact<{
    productId: Scalars['ID']['input'];
    startDate: Scalars['Date']['input'];
    endDate: Scalars['Date']['input'];
}>;

export type ProductStocksInDateRangeQuery = {
    __typename?: 'Query';
    productStocksInDateRange: Array<{
        __typename?: 'ProductStocksInDateRange';
        quantity: number;
        office: { __typename?: 'Office'; id: string; name: string };
    }>;
};

export type SalesQueryVariables = Exact<{
    page: InputMaybe<Scalars['Int']['input']>;
}>;

export type SalesQuery = {
    __typename?: 'Query';
    sales: {
        __typename?: 'PaginatedSaleQueryResult';
        count: number;
        numPages: number;
        results: Array<{
            __typename?: 'Sale';
            id: string;
            createdOn: any;
            total: any;
            client: {
                __typename?: 'Client';
                firstName: string;
                lastName: string;
                email: string;
            };
        }>;
    };
};

export type SaleByIdQueryVariables = Exact<{
    id: Scalars['ID']['input'];
}>;

export type SaleByIdQuery = {
    __typename?: 'Query';
    saleById: {
        __typename?: 'Sale';
        id: string;
        createdOn: any;
        total: any;
        saleItems: Array<{
            __typename?: 'SaleItem';
            quantity: number;
            total: any;
            subtotal: any;
            discount: any;
            product: {
                __typename?: 'Product';
                name: string;
                price: number | null;
                brand: { __typename?: 'Brand'; name: string } | null;
            };
        }>;
        client: {
            __typename?: 'Client';
            firstName: string;
            lastName: string;
            email: string;
            phoneCode: string;
            phoneNumber: string;
        };
    } | null;
};

export type CreateSaleMutationVariables = Exact<{
    saleData: CreateSaleInput;
}>;

export type CreateSaleMutation = {
    __typename?: 'Mutation';
    createSale: {
        __typename?: 'CreateSale';
        error: string | null;
        sale: {
            __typename?: 'Sale';
            id: string;
            createdOn: any;
            total: any;
            client: {
                __typename?: 'Client';
                firstName: string;
                lastName: string;
                email: string;
            };
        } | null;
    } | null;
};

export type SaleListItemFragment = {
    __typename?: 'Sale';
    id: string;
    createdOn: any;
    total: any;
    client: { __typename?: 'Client'; firstName: string; lastName: string; email: string };
};

export type DeleteSaleMutationVariables = Exact<{
    id: Scalars['ID']['input'];
}>;

export type DeleteSaleMutation = {
    __typename?: 'Mutation';
    deleteSale: { __typename?: 'DeleteSale'; success: boolean } | null;
};

export type AllSuppliersQueryVariables = Exact<{ [key: string]: never }>;

export type AllSuppliersQuery = {
    __typename?: 'Query';
    allSuppliers: Array<{ __typename?: 'Supplier'; id: string; name: string }>;
};

export type SuppliersQueryVariables = Exact<{
    page: InputMaybe<Scalars['Int']['input']>;
    query: InputMaybe<Scalars['String']['input']>;
}>;

export type SuppliersQuery = {
    __typename?: 'Query';
    suppliers: {
        __typename?: 'PaginatedSupplierQueryResult';
        count: number;
        numPages: number;
        results: Array<{
            __typename?: 'Supplier';
            id: string;
            cuit: string;
            name: string;
            phoneCode: string;
            phoneNumber: string;
            email: string;
            streetName: string;
            houseNumber: string;
            houseUnit: string | null;
            note: string | null;
            locality: { __typename?: 'Locality'; name: string };
        }>;
    };
};

export type SupplierByIdQueryVariables = Exact<{
    id: Scalars['ID']['input'];
}>;

export type SupplierByIdQuery = {
    __typename?: 'Query';
    supplierById: {
        __typename?: 'Supplier';
        name: string;
        email: string;
        cuit: string;
        phoneCode: string;
        phoneNumber: string;
        houseNumber: string;
        houseUnit: string | null;
        streetName: string;
        note: string | null;
        locality: {
            __typename?: 'Locality';
            id: string;
            name: string;
            state: StateChoices;
            postalCode: string;
        };
    } | null;
};

export type DeleteSupplierMutationVariables = Exact<{
    id: Scalars['ID']['input'];
}>;

export type DeleteSupplierMutation = {
    __typename?: 'Mutation';
    deleteSupplier: { __typename?: 'DeleteSupplier'; success: boolean } | null;
};

export type UpdateSupplierMutationVariables = Exact<{
    id: Scalars['ID']['input'];
    input: UpdateSupplierInput;
}>;

export type UpdateSupplierMutation = {
    __typename?: 'Mutation';
    updateSupplier: {
        __typename?: 'UpdateSupplier';
        error: string | null;
        supplier: { __typename?: 'Supplier'; id: string } | null;
    } | null;
};

export type CurrentUserQueryVariables = Exact<{ [key: string]: never }>;

export type CurrentUserQuery = {
    __typename?: 'Query';
    user: {
        __typename?: 'User';
        firstName: string;
        lastName: string;
        email: string;
        admin: {
            __typename?: 'Admin';
            offices: Array<{ __typename?: 'Office'; id: string; name: string }>;
        } | null;
        employee: {
            __typename?: 'Employee';
            offices: Array<{ __typename?: 'Office'; id: string; name: string }>;
        } | null;
    } | null;
};

export type LoginMutationVariables = Exact<{
    email: Scalars['String']['input'];
    password: Scalars['String']['input'];
}>;

export type LoginMutation = {
    __typename?: 'Mutation';
    login: {
        __typename?: 'Login';
        token: string;
        user: {
            __typename?: 'User';
            firstName: string;
            lastName: string;
            email: string;
            admin: {
                __typename?: 'Admin';
                offices: Array<{ __typename?: 'Office'; id: string; name: string }>;
            } | null;
            employee: {
                __typename?: 'Employee';
                offices: Array<{ __typename?: 'Office'; id: string; name: string }>;
            } | null;
        };
    } | null;
};

export type CurrentUserFragment = {
    __typename?: 'User';
    firstName: string;
    lastName: string;
    email: string;
    admin: {
        __typename?: 'Admin';
        offices: Array<{ __typename?: 'Office'; id: string; name: string }>;
    } | null;
    employee: {
        __typename?: 'Employee';
        offices: Array<{ __typename?: 'Office'; id: string; name: string }>;
    } | null;
};

export type RefreshTokenMutationVariables = Exact<{
    token: Scalars['String']['input'];
}>;

export type RefreshTokenMutation = {
    __typename?: 'Mutation';
    refreshToken: { __typename?: 'Refresh'; token: string } | null;
};

export type TokenAuthMutationVariables = Exact<{
    email: Scalars['String']['input'];
    password: Scalars['String']['input'];
}>;

export type TokenAuthMutation = {
    __typename?: 'Mutation';
    tokenAuth: {
        __typename?: 'ObtainJSONWebToken';
        payload: any;
        refreshExpiresIn: number;
        token: string;
    } | null;
};

export type UsersQueryVariables = Exact<{ [key: string]: never }>;

export type UsersQuery = {
    __typename?: 'Query';
    users: Array<{
        __typename?: 'User';
        firstName: string;
        lastName: string;
        email: string;
    }>;
};

export const ProductListItemFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'ProductListItem' },
            typeCondition: {
                kind: 'NamedType',
                name: { kind: 'Name', value: 'Product' },
            },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'sku' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'brand' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'services' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'billingType' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'billingPeriod' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<ProductListItemFragment, unknown>;
export const SaleListItemFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'SaleListItem' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Sale' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'createdOn' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'client' },
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
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<SaleListItemFragment, unknown>;
export const CurrentUserFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'CurrentUser' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'User' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'admin' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'offices' },
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
                        name: { kind: 'Name', value: 'employee' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'offices' },
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
} as unknown as DocumentNode<CurrentUserFragment, unknown>;
export const CreateBrandDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'createBrand' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
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
                        name: { kind: 'Name', value: 'createBrand' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'name' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'name' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'brand' },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'error' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<CreateBrandMutation, CreateBrandMutationVariables>;
export const BrandsDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'brands' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'brands' },
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
} as unknown as DocumentNode<BrandsQuery, BrandsQueryVariables>;
export const ClientsDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'clients' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'page' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'localities' },
                    },
                    type: {
                        kind: 'ListType',
                        type: {
                            kind: 'NonNullType',
                            type: {
                                kind: 'NamedType',
                                name: { kind: 'Name', value: 'ID' },
                            },
                        },
                    },
                },
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
                        name: { kind: 'Name', value: 'clients' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'page' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'page' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'localities' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'localities' },
                                },
                            },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'count' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'numPages' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'results' },
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
                                                name: {
                                                    kind: 'Name',
                                                    value: 'phoneCode',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'phoneNumber',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'locality' },
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
                                                                value: 'state',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'postalCode',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'streetName',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'houseUnit',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'houseNumber',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'dni' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'note' },
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
} as unknown as DocumentNode<ClientsQuery, ClientsQueryVariables>;
export const ClientByIdDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'clientById' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'clientById' },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'dni' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'phoneCode' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'phoneNumber' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'houseNumber' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'houseUnit' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'streetName' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'locality' },
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
                                                name: { kind: 'Name', value: 'state' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'postalCode',
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
} as unknown as DocumentNode<ClientByIdQuery, ClientByIdQueryVariables>;
export const ContractsByClientIdDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'contractsByClientId' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'contractsByClientId' },
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
                                    name: { kind: 'Name', value: 'createdOn' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'latestHistoryEntry' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'status' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'expirationDate' },
                                },
                                {
                                    kind: 'Field',
                                    name: {
                                        kind: 'Name',
                                        value: 'contractStartDatetime',
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'contractEndDatetime' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'locality' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'name' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'state' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'houseNumber' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'streetName' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'houseUnit' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'contractItems' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'product' },
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
                                                                value: 'brand',
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
                                                                value: 'price',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'quantity' },
                                            },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<ContractsByClientIdQuery, ContractsByClientIdQueryVariables>;
export const SalesByClientIdDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'salesByClientId' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'salesByClientId' },
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
                                    name: { kind: 'Name', value: 'createdOn' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'saleItems' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'product' },
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
                                                                value: 'brand',
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
                                                                value: 'price',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'quantity' },
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
} as unknown as DocumentNode<SalesByClientIdQuery, SalesByClientIdQueryVariables>;
export const CreateClientDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'createClient' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'clientData' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'CreateClientInput' },
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
                                name: { kind: 'Name', value: 'clientData' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'clientData' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
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
                                                name: { kind: 'Name', value: 'email' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'dni' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'phoneCode',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'phoneNumber',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'houseNumber',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'houseUnit',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'streetName',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'locality' },
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
                                                                value: 'state',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'postalCode',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'error' } },
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
            name: { kind: 'Name', value: 'updateClient' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'clientData' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'UpdateClientInput' },
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
                                name: { kind: 'Name', value: 'clientData' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'clientData' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
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
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'error' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<UpdateClientMutation, UpdateClientMutationVariables>;
export const DeleteClientDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'deleteClient' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
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
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<DeleteClientMutation, DeleteClientMutationVariables>;
export const AllClientsDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'allClients' },
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
                        name: { kind: 'Name', value: 'allClients' },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'firstName' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'lastName' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'dni' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'phoneCode' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'phoneNumber' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'houseNumber' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'houseUnit' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'streetName' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'locality' },
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
                                                name: { kind: 'Name', value: 'state' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'postalCode',
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
} as unknown as DocumentNode<AllClientsQuery, AllClientsQueryVariables>;
export const ClientExistsDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'clientExists' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'email' },
                    },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'dni' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'clientExists' },
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
                                name: { kind: 'Name', value: 'dni' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'dni' },
                                },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<ClientExistsQuery, ClientExistsQueryVariables>;
export const ContractsDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'contracts' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'page' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'contracts' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'page' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'page' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'count' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'numPages' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'results' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
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
                                                                value: 'firstName',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'lastName',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'office' },
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
                                                    value: 'createdOn',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'contractStartDatetime',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'contractEndDatetime',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'latestHistoryEntry',
                                                },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
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
                ],
            },
        },
    ],
} as unknown as DocumentNode<ContractsQuery, ContractsQueryVariables>;
export const ContractByIdDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'contractById' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'contractById' },
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
                                    name: { kind: 'Name', value: 'client' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'firstName',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'dni' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'email' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'houseNumber',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'houseUnit',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'lastName' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'locality' },
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
                                                                value: 'state',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'postalCode',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'phoneNumber',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'phoneCode',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'streetName',
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'contractEndDatetime' },
                                },
                                {
                                    kind: 'Field',
                                    name: {
                                        kind: 'Name',
                                        value: 'contractStartDatetime',
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'latestHistoryEntry' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'status' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'expirationDate' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'houseNumber' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'houseUnit' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'office' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'name' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'street' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'houseNumber',
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'streetName' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'numberOfRentalDays' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'contractItems' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'product' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'brand',
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
                                                                value: 'name',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'sku',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'productPrice',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'serviceItems',
                                                },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'service',
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
                                                                value: 'price',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'discount',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'subtotal',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'total',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'billingType',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'billingPeriod',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'quantity' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'productSubtotal',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'servicesSubtotal',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'shippingSubtotal',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'productDiscount',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'servicesDiscount',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'shippingDiscount',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'total' },
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
} as unknown as DocumentNode<ContractByIdQuery, ContractByIdQueryVariables>;
export const CreateContractDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'CreateContract' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'contractData' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'ContractInput' },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'itemsData' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'ListType',
                            type: {
                                kind: 'NonNullType',
                                type: {
                                    kind: 'NamedType',
                                    name: { kind: 'Name', value: 'ContractItemInput' },
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
                        name: { kind: 'Name', value: 'createContract' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'contractData' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'contractData' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'itemsData' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'itemsData' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'contractId' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'error' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<CreateContractMutation, CreateContractMutationVariables>;
export const DeleteContractDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'deleteContract' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'deleteContract' },
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
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<DeleteContractMutation, DeleteContractMutationVariables>;
export const PayContractDepositDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'payContractDeposit' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'payContractDeposit' },
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
                                    name: { kind: 'Name', value: 'contract' },
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
                                                    value: 'latestHistoryEntry',
                                                },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
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
                                { kind: 'Field', name: { kind: 'Name', value: 'error' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    PayContractDepositMutation,
    PayContractDepositMutationVariables
>;
export const PayTotalContractDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'payTotalContract' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'payTotalContract' },
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
                                    name: { kind: 'Name', value: 'contract' },
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
                                                    value: 'latestHistoryEntry',
                                                },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
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
                                { kind: 'Field', name: { kind: 'Name', value: 'error' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<PayTotalContractMutation, PayTotalContractMutationVariables>;
export const CancelContractDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'cancelContract' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'cancelContract' },
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
                                    name: { kind: 'Name', value: 'contract' },
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
                                                    value: 'latestHistoryEntry',
                                                },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
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
                                { kind: 'Field', name: { kind: 'Name', value: 'error' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<CancelContractMutation, CancelContractMutationVariables>;
export const ClientsCsvDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'clientsCsv' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'clientsCsv' } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<ClientsCsvQuery, ClientsCsvQueryVariables>;
export const EmployeesCsvDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'employeesCsv' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'employeesCsv' } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<EmployeesCsvQuery, EmployeesCsvQueryVariables>;
export const ContractsCsvDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'contractsCsv' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'contractsCsv' } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<ContractsCsvQuery, ContractsCsvQueryVariables>;
export const ProductsCsvDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'productsCsv' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'productsCsv' } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<ProductsCsvQuery, ProductsCsvQueryVariables>;
export const LocalitiesCsvDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'localitiesCsv' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'localitiesCsv' } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<LocalitiesCsvQuery, LocalitiesCsvQueryVariables>;
export const OfficesCsvDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'officesCsv' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'officesCsv' } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<OfficesCsvQuery, OfficesCsvQueryVariables>;
export const SalesCsvDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'salesCsv' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'salesCsv' } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<SalesCsvQuery, SalesCsvQueryVariables>;
export const SuppliersCsvDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'suppliersCsv' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'suppliersCsv' } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<SuppliersCsvQuery, SuppliersCsvQueryVariables>;
export const InternalOrdersCsvDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'internalOrdersCsv' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'internalOrdersCsv' } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<InternalOrdersCsvQuery, InternalOrdersCsvQueryVariables>;
export const SuppliersOrdersCsvDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'suppliersOrdersCsv' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'suppliersOrdersCsv' },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<SuppliersOrdersCsvQuery, SuppliersOrdersCsvQueryVariables>;
export const DashboardDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'dashboard' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'allSales' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'createdOn' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'total' } },
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
                                                    value: 'firstName',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'lastName' },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'allClients' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'allProducts' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'saleItems' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'quantity' },
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
} as unknown as DocumentNode<DashboardQuery, DashboardQueryVariables>;
export const EmployeesDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'employees' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'page' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                },
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
                        name: { kind: 'Name', value: 'employees' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'page' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'page' },
                                },
                            },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'count' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'numPages' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'results' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'user' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'firstName',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'lastName',
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
                                                                value: 'isActive',
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
} as unknown as DocumentNode<EmployeesQuery, EmployeesQueryVariables>;
export const CreateEmployeeDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'createEmployee' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'employeeData' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'CreateEmployeeInput' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createEmployee' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'employeeData' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'employeeData' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'employee' },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'error' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<CreateEmployeeMutation, CreateEmployeeMutationVariables>;
export const EmployeeByIdDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'employeeById' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'employeeById' },
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
                                    name: { kind: 'Name', value: 'offices' },
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
                                                name: { kind: 'Name', value: 'locality' },
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
                                                                value: 'state',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'postalCode',
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
                                    name: { kind: 'Name', value: 'user' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
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
                                                name: { kind: 'Name', value: 'email' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'isActive' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'dateJoined',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'lastLogin',
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
} as unknown as DocumentNode<EmployeeByIdQuery, EmployeeByIdQueryVariables>;
export const DeleteEmployeeDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'deleteEmployee' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'deleteEmployee' },
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
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<DeleteEmployeeMutation, DeleteEmployeeMutationVariables>;
export const UpdateEmployeeDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'updateEmployee' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'employeeData' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'UpdateEmployeeInput' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updateEmployee' },
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
                                name: { kind: 'Name', value: 'employeeData' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'employeeData' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'employee' },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'error' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<UpdateEmployeeMutation, UpdateEmployeeMutationVariables>;
export const LocalitiesDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'localities' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'page' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'localities' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'page' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'page' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'count' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'numPages' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'results' },
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
                                                name: {
                                                    kind: 'Name',
                                                    value: 'postalCode',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'state' },
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
} as unknown as DocumentNode<LocalitiesQuery, LocalitiesQueryVariables>;
export const CreateLocalityDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'createLocality' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
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
                        name: { kind: 'Name', value: 'state' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'StateChoices' },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'postalCode' },
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
                        name: { kind: 'Name', value: 'createLocality' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'name' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'name' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'state' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'state' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'postalCode' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'postalCode' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'locality' },
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
                                                name: { kind: 'Name', value: 'state' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'postalCode',
                                                },
                                            },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'error' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<CreateLocalityMutation, CreateLocalityMutationVariables>;
export const DeleteLocalityDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'deleteLocality' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'deleteLocality' },
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
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<DeleteLocalityMutation, DeleteLocalityMutationVariables>;
export const AllLocalitiesDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'allLocalities' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'allLocalities' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'state' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'postalCode' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<AllLocalitiesQuery, AllLocalitiesQueryVariables>;
export const UpdateLocalityDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'updateLocality' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'state' },
                    },
                    type: {
                        kind: 'NamedType',
                        name: { kind: 'Name', value: 'StateChoices' },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'postalCode' },
                    },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updateLocality' },
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
                                name: { kind: 'Name', value: 'name' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'name' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'state' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'state' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'postalCode' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'postalCode' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'locality' },
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
                                                name: { kind: 'Name', value: 'state' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'postalCode',
                                                },
                                            },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'error' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<UpdateLocalityMutation, UpdateLocalityMutationVariables>;
export const OfficesDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'offices' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'offices' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'street' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'houseNumber' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'locality' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'state' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'postalCode',
                                                },
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
                                    name: { kind: 'Name', value: 'stockItems' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'quantity' },
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
} as unknown as DocumentNode<OfficesQuery, OfficesQueryVariables>;
export const InternalOrdersDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'internalOrders' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'page' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'internalOrders' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'page' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'page' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'count' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'numPages' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'results' },
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
                                                    value: 'sourceOffice',
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
                                                name: {
                                                    kind: 'Name',
                                                    value: 'targetOffice',
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
                                                name: {
                                                    kind: 'Name',
                                                    value: 'createdOn',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'latestHistoryEntry',
                                                },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
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
                ],
            },
        },
    ],
} as unknown as DocumentNode<InternalOrdersQuery, InternalOrdersQueryVariables>;
export const InternalOrderByIdDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'internalOrderById' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'internalOrderById' },
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
                                    name: { kind: 'Name', value: 'createdOn' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'historyEntries' },
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
                                                    value: 'createdOn',
                                                },
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
                                    name: { kind: 'Name', value: 'sourceOffice' },
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
                                                    value: 'houseNumber',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'name' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'street' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'locality' },
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
                                                                value: 'postalCode',
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
                                    name: { kind: 'Name', value: 'targetOffice' },
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
                                                    value: 'houseNumber',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'name' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'street' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'locality' },
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
                                                                value: 'postalCode',
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
                                    name: { kind: 'Name', value: 'latestHistoryEntry' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'status' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'orderItems' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'quantityOrdered',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'quantityReceived',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'product' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'brand',
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
                                                                value: 'name',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'type',
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
} as unknown as DocumentNode<InternalOrderByIdQuery, InternalOrderByIdQueryVariables>;
export const CreateInternalOrderDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'createInternalOrder' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'data' } },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'CreateInternalOrderInput' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createInternalOrder' },
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
                                    name: { kind: 'Name', value: 'internalOrder' },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'error' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    CreateInternalOrderMutation,
    CreateInternalOrderMutationVariables
>;
export const CreateSupplierOrderDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'createSupplierOrder' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'data' } },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'CreateSupplierOrderInput' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createSupplierOrder' },
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
                                    name: { kind: 'Name', value: 'supplierOrder' },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'error' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    CreateSupplierOrderMutation,
    CreateSupplierOrderMutationVariables
>;
export const SupplierOrdersDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'supplierOrders' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'page' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'supplierOrders' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'page' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'page' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'count' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'numPages' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'results' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'supplier' },
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
                                                    value: 'targetOffice',
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
                                                    value: 'createdOn',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'latestHistoryEntry',
                                                },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
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
                ],
            },
        },
    ],
} as unknown as DocumentNode<SupplierOrdersQuery, SupplierOrdersQueryVariables>;
export const SupplierOrderByIdDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'supplierOrderById' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'supplierOrderById' },
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
                                    name: { kind: 'Name', value: 'supplier' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'cuit' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'name' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'email' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'locality' },
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
                                                                value: 'postalCode',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'state',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'houseNumber',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'streetName',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'phoneCode',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'phoneNumber',
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'targetOffice' },
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
                                                name: { kind: 'Name', value: 'street' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'houseNumber',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'locality' },
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
                                    name: { kind: 'Name', value: 'latestHistoryEntry' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'status' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'user' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'firstName',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'lastName',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'email',
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
                                    name: { kind: 'Name', value: 'orderItems' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'product' },
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
                                                                value: 'brand',
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
                                                                value: 'type',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'quantityOrdered',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'quantityReceived',
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
} as unknown as DocumentNode<SupplierOrderByIdQuery, SupplierOrderByIdQueryVariables>;
export const SupplierOrdersBySupplierIdDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'supplierOrdersBySupplierId' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'supplierOrdersBySupplierId' },
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
                                    name: { kind: 'Name', value: 'createdOn' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'targetOffice' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'name' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'street' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'houseNumber',
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'latestHistoryEntry' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'status' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'user' },
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
                                                                value: 'firstName',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'lastName',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'createdOn',
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'orderItems' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'product' },
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
                                                                value: 'brand',
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
                                                                value: 'name',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'price',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'type',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'quantityOrdered',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'quantityReceived',
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
    SupplierOrdersBySupplierIdQuery,
    SupplierOrdersBySupplierIdQueryVariables
>;
export const CreateSupplierDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'CreateSupplier' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'data' } },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'CreateSupplierInput' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createSupplier' },
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
                                    name: { kind: 'Name', value: 'supplier' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'cuit' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'email' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'houseNumber',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'houseUnit',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'name' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'note' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'phoneCode',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'phoneNumber',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'streetName',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'locality' },
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
                                                                value: 'postalCode',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'state',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'error' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<CreateSupplierMutation, CreateSupplierMutationVariables>;
export const DeleteSupplierOrderDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'deleteSupplierOrder' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'deleteSupplierOrder' },
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
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    DeleteSupplierOrderMutation,
    DeleteSupplierOrderMutationVariables
>;
export const DeleteInternalOrderDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'deleteInternalOrder' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'deleteInternalOrder' },
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
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    DeleteInternalOrderMutation,
    DeleteInternalOrderMutationVariables
>;
export const InProgressInternalOrderDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'InProgressInternalOrder' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'inProgressInternalOrder' },
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
                                    name: { kind: 'Name', value: 'internalOrder' },
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
                                                    value: 'latestHistoryEntry',
                                                },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
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
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'historyEntries',
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
                                                                value: 'createdOn',
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
                                { kind: 'Field', name: { kind: 'Name', value: 'error' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    InProgressInternalOrderMutation,
    InProgressInternalOrderMutationVariables
>;
export const ReceiveInternalOrderDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'receiveInternalOrder' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'receiveInternalOrder' },
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
                                    name: { kind: 'Name', value: 'internalOrder' },
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
                                                    value: 'latestHistoryEntry',
                                                },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
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
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'historyEntries',
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
                                                                value: 'createdOn',
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
                                { kind: 'Field', name: { kind: 'Name', value: 'error' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    ReceiveInternalOrderMutation,
    ReceiveInternalOrderMutationVariables
>;
export const ReceiveOrderSupplierDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'receiveOrderSupplier' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'orderSupplierId' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'receiveOrderSupplier' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'orderSupplierId' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'orderSupplierId' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'orderSupplier' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'error' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    ReceiveOrderSupplierMutation,
    ReceiveOrderSupplierMutationVariables
>;
export const ProductsDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'products' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'page' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                },
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
                        name: { kind: 'Name', value: 'products' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'page' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'page' },
                                },
                            },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'count' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'numPages' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'results' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'FragmentSpread',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'ProductListItem',
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
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'ProductListItem' },
            typeCondition: {
                kind: 'NamedType',
                name: { kind: 'Name', value: 'Product' },
            },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'sku' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'brand' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'services' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'billingType' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'billingPeriod' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<ProductsQuery, ProductsQueryVariables>;
export const ProductByIdDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'productById' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'productById' },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'sku' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'description' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'brand' },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'stockItems' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'office' },
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
                                                                value: 'locality',
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
                                                name: { kind: 'Name', value: 'quantity' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'services' },
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
                                                name: { kind: 'Name', value: 'price' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'suppliers' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'supplier' },
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
                                                name: { kind: 'Name', value: 'price' },
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
} as unknown as DocumentNode<ProductByIdQuery, ProductByIdQueryVariables>;
export const CreateProductDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'createProduct' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'productData' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'ProductDataInput' },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'stockItems' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'ListType',
                            type: {
                                kind: 'NonNullType',
                                type: {
                                    kind: 'NamedType',
                                    name: {
                                        kind: 'Name',
                                        value: 'ProductStockItemInput',
                                    },
                                },
                            },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'suppliers' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'ListType',
                            type: {
                                kind: 'NonNullType',
                                type: {
                                    kind: 'NamedType',
                                    name: { kind: 'Name', value: 'ProductSupplierInput' },
                                },
                            },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'services' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'ListType',
                            type: {
                                kind: 'NonNullType',
                                type: {
                                    kind: 'NamedType',
                                    name: { kind: 'Name', value: 'ProductServiceInput' },
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
                        name: { kind: 'Name', value: 'createProduct' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'productData' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'productData' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'stockItems' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'stockItems' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'suppliers' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'suppliers' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'services' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'services' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'product' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'FragmentSpread',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'ProductListItem',
                                                },
                                            },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'error' } },
                            ],
                        },
                    },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'ProductListItem' },
            typeCondition: {
                kind: 'NamedType',
                name: { kind: 'Name', value: 'Product' },
            },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'sku' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'brand' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'services' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'billingType' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'billingPeriod' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<CreateProductMutation, CreateProductMutationVariables>;
export const UpdateProductDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'updateProduct' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'productData' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'ProductDataInput' },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'stockItems' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'ListType',
                            type: {
                                kind: 'NonNullType',
                                type: {
                                    kind: 'NamedType',
                                    name: {
                                        kind: 'Name',
                                        value: 'ProductStockItemInput',
                                    },
                                },
                            },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'suppliers' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'ListType',
                            type: {
                                kind: 'NonNullType',
                                type: {
                                    kind: 'NamedType',
                                    name: { kind: 'Name', value: 'ProductSupplierInput' },
                                },
                            },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'services' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'ListType',
                            type: {
                                kind: 'NonNullType',
                                type: {
                                    kind: 'NamedType',
                                    name: { kind: 'Name', value: 'ProductServiceInput' },
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
                        name: { kind: 'Name', value: 'updateProduct' },
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
                                name: { kind: 'Name', value: 'productData' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'productData' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'stockItems' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'stockItems' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'suppliers' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'suppliers' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'services' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'services' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'product' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'FragmentSpread',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'ProductListItem',
                                                },
                                            },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'error' } },
                            ],
                        },
                    },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'ProductListItem' },
            typeCondition: {
                kind: 'NamedType',
                name: { kind: 'Name', value: 'Product' },
            },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'sku' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'brand' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'services' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'billingType' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'billingPeriod' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<UpdateProductMutation, UpdateProductMutationVariables>;
export const ProductsStocksByOfficeIdDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'productsStocksByOfficeId' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'officeId' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'productsStocksByOfficeId' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'officeId' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'officeId' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'product' },
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
                                    name: { kind: 'Name', value: 'quantity' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    ProductsStocksByOfficeIdQuery,
    ProductsStocksByOfficeIdQueryVariables
>;
export const ProductsSuppliedBySupplierIdDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'productsSuppliedBySupplierId' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'supplierId' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'productsSuppliedBySupplierId' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'supplierId' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'supplierId' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    ProductsSuppliedBySupplierIdQuery,
    ProductsSuppliedBySupplierIdQueryVariables
>;
export const DeleteProductDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'deleteProduct' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'deleteProduct' },
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
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<DeleteProductMutation, DeleteProductMutationVariables>;
export const AllProductsDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'allProducts' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'allProducts' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'FragmentSpread',
                                    name: { kind: 'Name', value: 'ProductListItem' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'ProductListItem' },
            typeCondition: {
                kind: 'NamedType',
                name: { kind: 'Name', value: 'Product' },
            },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'sku' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'brand' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'services' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'billingType' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'billingPeriod' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<AllProductsQuery, AllProductsQueryVariables>;
export const ProductExistsDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'productExists' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'sku' } },
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
                        name: { kind: 'Name', value: 'productExists' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'sku' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'sku' },
                                },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<ProductExistsQuery, ProductExistsQueryVariables>;
export const ProductStocksInDateRangeDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'productStocksInDateRange' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'productId' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
                    },
                },
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
                            name: { kind: 'Name', value: 'Date' },
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
                            name: { kind: 'Name', value: 'Date' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'productStocksInDateRange' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'productId' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'productId' },
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
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'office' },
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
                                    name: { kind: 'Name', value: 'quantity' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    ProductStocksInDateRangeQuery,
    ProductStocksInDateRangeQueryVariables
>;
export const SalesDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'sales' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'page' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'sales' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'page' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'page' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'count' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'numPages' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'results' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'FragmentSpread',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'SaleListItem',
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
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'SaleListItem' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Sale' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'createdOn' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'client' },
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
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<SalesQuery, SalesQueryVariables>;
export const SaleByIdDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'saleById' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'saleById' },
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
                                    name: { kind: 'Name', value: 'createdOn' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'saleItems' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'product' },
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
                                                                value: 'brand',
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
                                                                value: 'price',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'quantity' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'total' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'subtotal' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'discount' },
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
                                                    value: 'firstName',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'lastName' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'email' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'phoneCode',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'phoneNumber',
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
} as unknown as DocumentNode<SaleByIdQuery, SaleByIdQueryVariables>;
export const CreateSaleDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'createSale' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'saleData' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'CreateSaleInput' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createSale' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'data' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'saleData' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'sale' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'FragmentSpread',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'SaleListItem',
                                                },
                                            },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'error' } },
                            ],
                        },
                    },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'SaleListItem' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Sale' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'createdOn' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'client' },
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
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<CreateSaleMutation, CreateSaleMutationVariables>;
export const DeleteSaleDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'deleteSale' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'deleteSale' },
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
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<DeleteSaleMutation, DeleteSaleMutationVariables>;
export const AllSuppliersDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'allSuppliers' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'allSuppliers' },
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
} as unknown as DocumentNode<AllSuppliersQuery, AllSuppliersQueryVariables>;
export const SuppliersDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'suppliers' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'page' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                },
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
                        name: { kind: 'Name', value: 'suppliers' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'page' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'page' },
                                },
                            },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'count' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'numPages' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'results' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'cuit' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'name' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'phoneCode',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'phoneNumber',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'email' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'locality' },
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
                                                    value: 'streetName',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'houseNumber',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'houseUnit',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'note' },
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
} as unknown as DocumentNode<SuppliersQuery, SuppliersQueryVariables>;
export const SupplierByIdDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'supplierById' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'supplierById' },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'cuit' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'phoneCode' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'phoneNumber' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'houseNumber' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'houseUnit' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'streetName' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'locality' },
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
                                                name: { kind: 'Name', value: 'state' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'postalCode',
                                                },
                                            },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'note' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<SupplierByIdQuery, SupplierByIdQueryVariables>;
export const DeleteSupplierDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'deleteSupplier' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'deleteSupplier' },
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
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<DeleteSupplierMutation, DeleteSupplierMutationVariables>;
export const UpdateSupplierDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'updateSupplier' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
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
                            name: { kind: 'Name', value: 'UpdateSupplierInput' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updateSupplier' },
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
                                    name: { kind: 'Name', value: 'supplier' },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'error' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<UpdateSupplierMutation, UpdateSupplierMutationVariables>;
export const CurrentUserDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'currentUser' },
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
                                    kind: 'FragmentSpread',
                                    name: { kind: 'Name', value: 'CurrentUser' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'CurrentUser' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'User' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'admin' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'offices' },
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
                        name: { kind: 'Name', value: 'employee' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'offices' },
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
} as unknown as DocumentNode<CurrentUserQuery, CurrentUserQueryVariables>;
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
                                { kind: 'Field', name: { kind: 'Name', value: 'token' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'user' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'FragmentSpread',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'CurrentUser',
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
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'CurrentUser' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'User' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'admin' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'offices' },
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
                        name: { kind: 'Name', value: 'employee' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'offices' },
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
} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const RefreshTokenDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'refreshToken' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'token' },
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
                        name: { kind: 'Name', value: 'refreshToken' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'token' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'token' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'token' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<RefreshTokenMutation, RefreshTokenMutationVariables>;
export const TokenAuthDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'tokenAuth' },
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
                        name: { kind: 'Name', value: 'tokenAuth' },
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
                                    name: { kind: 'Name', value: 'payload' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'refreshExpiresIn' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'token' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<TokenAuthMutation, TokenAuthMutationVariables>;
export const UsersDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'users' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'users' },
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
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<UsersQuery, UsersQueryVariables>;
