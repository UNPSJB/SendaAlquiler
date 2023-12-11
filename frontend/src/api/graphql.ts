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
    Date: { input: string; output: string };
    DateTime: { input: any; output: any };
    Decimal: { input: any; output: any };
    GenericScalar: { input: any; output: any };
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
    error: Maybe<Scalars['String']['output']>;
    rentalContract: Maybe<RentalContract>;
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
    /** Código de área del teléfono del cliente */
    phoneCode: Scalars['String']['output'];
    /** Número de teléfono del cliente */
    phoneNumber: Scalars['String']['output'];
    purchases: Array<Purchase>;
    rentalContracts: Array<RentalContract>;
    /** Nombre de la calle donde vive el cliente */
    streetName: Scalars['String']['output'];
};

/** An enumeration. */
export enum CoreSupplierOrderHistoryModelStatusChoices {
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
    password: Scalars['String']['input'];
};

export type CreateInternalOrder = {
    __typename?: 'CreateInternalOrder';
    error: Maybe<Scalars['String']['output']>;
    internalOrder: Maybe<InternalOrder>;
};

export type CreateInternalOrderInput = {
    officeBranchId: Scalars['ID']['input'];
    officeDestinationId: Scalars['ID']['input'];
    products: Array<CreateInternalOrderProductInput>;
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

export type CreateProductInput = {
    brandId: Scalars['ID']['input'];
    description: InputMaybe<Scalars['String']['input']>;
    name: Scalars['String']['input'];
    price: Scalars['String']['input'];
    services: Array<ServiceInput>;
    sku: InputMaybe<Scalars['String']['input']>;
    stock: Array<StockInput>;
    suppliers: Array<ProductSupplierInput>;
    type: ProductTypeChoices;
};

export type CreatePurchase = {
    __typename?: 'CreatePurchase';
    error: Maybe<Scalars['String']['output']>;
    purchase: Maybe<Purchase>;
};

export type CreatePurchaseInput = {
    client: Scalars['ID']['input'];
    products: Array<PurchaseItemsInput>;
};

export type CreateRentalContract = {
    __typename?: 'CreateRentalContract';
    error: Maybe<Scalars['String']['output']>;
    rentalContract: Maybe<RentalContract>;
};

export type CreateRentalContractInput = {
    clientId: Scalars['ID']['input'];
    contractEndDatetime: Scalars['DateTime']['input'];
    contractStartDatetime: Scalars['DateTime']['input'];
    houseNumber: Scalars['String']['input'];
    houseUnit: InputMaybe<Scalars['String']['input']>;
    localityId: Scalars['ID']['input'];
    products: Array<RentalContractProductsItemInput>;
    streetName: Scalars['String']['input'];
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

export type DeletePurchase = {
    __typename?: 'DeletePurchase';
    success: Scalars['Boolean']['output'];
};

export type DeleteRentalContract = {
    __typename?: 'DeleteRentalContract';
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
    offices: Array<EmployeeOffice>;
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
    error: Maybe<Scalars['String']['output']>;
    rentalContract: Maybe<RentalContract>;
};

export type FailedReturnContract = {
    __typename?: 'FailedReturnContract';
    error: Maybe<Scalars['String']['output']>;
    rentalContract: Maybe<RentalContract>;
};

export type FinishContract = {
    __typename?: 'FinishContract';
    error: Maybe<Scalars['String']['output']>;
    rentalContract: Maybe<RentalContract>;
};

export type InProgressInternalOrder = {
    __typename?: 'InProgressInternalOrder';
    error: Maybe<Scalars['String']['output']>;
    internalOrder: Maybe<InternalOrder>;
};

export type InternalOrder = {
    __typename?: 'InternalOrder';
    createdOn: Scalars['DateTime']['output'];
    currentHistory: Maybe<InternalOrderHistory>;
    history: Array<InternalOrderHistory>;
    id: Scalars['ID']['output'];
    modifiedOn: Scalars['DateTime']['output'];
    officeBranch: Office;
    officeDestination: Office;
    orders: Array<InternalOrderProduct>;
};

export type InternalOrderHistory = {
    __typename?: 'InternalOrderHistory';
    createdOn: Scalars['DateTime']['output'];
    currentOrder: Maybe<InternalOrder>;
    date: Scalars['DateTime']['output'];
    id: Scalars['ID']['output'];
    internalOrder: InternalOrder;
    modifiedOn: Scalars['DateTime']['output'];
    status: InternalOrderHistoryStatusChoices;
    user: Maybe<User>;
};

/**
 *
 *     Enum-like class representing status choices for internal order history. Inherits from models.TextChoices.
 *
 *     It provides a set of predefined status choices such as PENDING, IN_PROGRESS, COMPLETED, and CANCELED.
 *
 */
export enum InternalOrderHistoryStatusChoices {
    Canceled = 'CANCELED',
    Completed = 'COMPLETED',
    InProgress = 'IN_PROGRESS',
    Pending = 'PENDING',
}

export type InternalOrderProduct = {
    __typename?: 'InternalOrderProduct';
    createdOn: Scalars['DateTime']['output'];
    id: Scalars['ID']['output'];
    internalOrder: InternalOrder;
    modifiedOn: Scalars['DateTime']['output'];
    product: Product;
    quantity: Scalars['Int']['output'];
    quantityReceived: Scalars['Int']['output'];
};

export type Locality = {
    __typename?: 'Locality';
    clients: Array<Client>;
    createdOn: Scalars['DateTime']['output'];
    id: Scalars['ID']['output'];
    modifiedOn: Scalars['DateTime']['output'];
    name: Scalars['String']['output'];
    officemodelSet: Array<Office>;
    postalCode: Scalars['String']['output'];
    rentalContracts: Array<RentalContract>;
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
    createEmployee: Maybe<CreateEmployee>;
    createInternalOrder: Maybe<CreateInternalOrder>;
    createLocality: Maybe<CreateLocality>;
    createProduct: Maybe<CreateProduct>;
    createPurchase: Maybe<CreatePurchase>;
    createRentalContract: Maybe<CreateRentalContract>;
    createSupplier: Maybe<CreateSupplier>;
    createSupplierOrder: Maybe<CreateSupplierOrder>;
    deleteClient: Maybe<DeleteClient>;
    deleteEmployee: Maybe<DeleteEmployee>;
    deleteInternalOrder: Maybe<DeleteInternalOrder>;
    deleteLocality: Maybe<DeleteLocality>;
    deleteProduct: Maybe<DeleteProduct>;
    deletePurchase: Maybe<DeletePurchase>;
    deleteRentalContract: Maybe<DeleteRentalContract>;
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
    startContract: Maybe<StartContract>;
    successfulReturnContract: Maybe<SuccessfulReturnContract>;
    /** Obtain JSON Web Token mutation */
    tokenAuth: Maybe<ObtainJsonWebToken>;
    updateClient: Maybe<UpdateClient>;
    updateEmployee: Maybe<UpdateEmployee>;
    updateProduct: Maybe<UpdateProduct>;
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
    productData: CreateProductInput;
};

export type MutationCreatePurchaseArgs = {
    data: CreatePurchaseInput;
};

export type MutationCreateRentalContractArgs = {
    data: CreateRentalContractInput;
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

export type MutationDeletePurchaseArgs = {
    id: Scalars['ID']['input'];
};

export type MutationDeleteRentalContractArgs = {
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

export type MutationUpdateProductArgs = {
    id: Scalars['ID']['input'];
    productData: UpdateProductInput;
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
    createdOn: Scalars['DateTime']['output'];
    employees: Array<EmployeeOffice>;
    houseNumber: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    internalOrdersBranch: Array<InternalOrder>;
    internalOrdersDestination: Array<InternalOrder>;
    locality: Locality;
    modifiedOn: Scalars['DateTime']['output'];
    name: Scalars['String']['output'];
    note: Maybe<Scalars['String']['output']>;
    purchases: Array<Purchase>;
    rentalContracts: Array<RentalContract>;
    stock: Array<ProductStockInOffice>;
    street: Scalars['String']['output'];
    supplierOrdersDestination: Array<OrderSupplier>;
};

export type OrderSupplier = {
    __typename?: 'OrderSupplier';
    createdOn: Scalars['DateTime']['output'];
    currentHistory: Maybe<SupplierOrderHistory>;
    history: Array<SupplierOrderHistory>;
    id: Scalars['ID']['output'];
    modifiedOn: Scalars['DateTime']['output'];
    officeDestination: Office;
    orders: Array<SupplierOrderProduct>;
    supplier: Supplier;
    total: Maybe<Scalars['Decimal']['output']>;
};

export type PaginatedClientQueryResult = {
    __typename?: 'PaginatedClientQueryResult';
    count: Scalars['Int']['output'];
    numPages: Scalars['Int']['output'];
    results: Array<Client>;
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

export type PaginatedPurchaseQueryResult = {
    __typename?: 'PaginatedPurchaseQueryResult';
    count: Scalars['Int']['output'];
    numPages: Scalars['Int']['output'];
    results: Array<Purchase>;
};

export type PaginatedRentalContractQueryResult = {
    __typename?: 'PaginatedRentalContractQueryResult';
    count: Scalars['Int']['output'];
    numPages: Scalars['Int']['output'];
    results: Array<RentalContract>;
};

export type PaginatedSupplierQueryResult = {
    __typename?: 'PaginatedSupplierQueryResult';
    count: Scalars['Int']['output'];
    numPages: Scalars['Int']['output'];
    results: Array<Supplier>;
};

export type PayContractDeposit = {
    __typename?: 'PayContractDeposit';
    error: Maybe<Scalars['String']['output']>;
    rentalContract: Maybe<RentalContract>;
};

export type PayTotalContract = {
    __typename?: 'PayTotalContract';
    error: Maybe<Scalars['String']['output']>;
    rentalContract: Maybe<RentalContract>;
};

export type Product = {
    __typename?: 'Product';
    brand: Maybe<Brand>;
    createdOn: Scalars['DateTime']['output'];
    description: Maybe<Scalars['String']['output']>;
    id: Scalars['ID']['output'];
    modifiedOn: Scalars['DateTime']['output'];
    name: Scalars['String']['output'];
    price: Maybe<Scalars['Decimal']['output']>;
    purchaseItems: Array<PurchaseItem>;
    relatedOrders: Array<InternalOrderProduct>;
    relatedSupplierOrders: Array<SupplierOrderProduct>;
    rentalContractItems: Array<RentalContractItem>;
    services: Array<ProductService>;
    sku: Maybe<Scalars['String']['output']>;
    stock: Array<ProductStockInOffice>;
    suppliers: Array<ProductSupplier>;
    type: ProductTypeChoices;
};

export type ProductService = {
    __typename?: 'ProductService';
    createdOn: Scalars['DateTime']['output'];
    id: Scalars['ID']['output'];
    modifiedOn: Scalars['DateTime']['output'];
    name: Scalars['String']['output'];
    price: Scalars['Decimal']['output'];
    product: Product;
    rentalContractItems: Array<RentalContractItem>;
};

export type ProductStockInOffice = {
    __typename?: 'ProductStockInOffice';
    createdOn: Scalars['DateTime']['output'];
    id: Scalars['ID']['output'];
    modifiedOn: Scalars['DateTime']['output'];
    office: Office;
    product: Product;
    stock: Scalars['Int']['output'];
};

export type ProductStocksInDateRange = {
    __typename?: 'ProductStocksInDateRange';
    id: Scalars['ID']['output'];
    name: Scalars['String']['output'];
    price: Scalars['Decimal']['output'];
    services: Array<ProductService>;
    stocksByOffice: Array<ProductsStocksInDateRangeStockByOffice>;
};

export type ProductSupplier = {
    __typename?: 'ProductSupplier';
    createdOn: Scalars['DateTime']['output'];
    id: Scalars['ID']['output'];
    modifiedOn: Scalars['DateTime']['output'];
    price: Scalars['Decimal']['output'];
    product: Product;
    supplier: Supplier;
};

export type ProductSupplierInput = {
    price: Scalars['String']['input'];
    supplierId: Scalars['ID']['input'];
};

/**
 *
 *     Enum-like class representing choices for product types. Inherits from models.TextChoices.
 *
 *     Provides predefined choices like ALQUILABLE and COMERCIABLE, each being a tuple with the internal identifier and the human-readable name.
 *
 */
export enum ProductTypeChoices {
    Alquilable = 'ALQUILABLE',
    Comerciable = 'COMERCIABLE',
}

export type ProductsStocksInDateRangeStockByOffice = {
    __typename?: 'ProductsStocksInDateRangeStockByOffice';
    office: Maybe<Office>;
    stock: Maybe<Scalars['Int']['output']>;
};

export type Purchase = {
    __typename?: 'Purchase';
    client: Client;
    createdOn: Scalars['DateTime']['output'];
    id: Scalars['ID']['output'];
    modifiedOn: Scalars['DateTime']['output'];
    office: Office;
    purchaseItems: Array<PurchaseItem>;
    total: Maybe<Scalars['Decimal']['output']>;
};

export type PurchaseItem = {
    __typename?: 'PurchaseItem';
    createdOn: Scalars['DateTime']['output'];
    id: Scalars['ID']['output'];
    modifiedOn: Scalars['DateTime']['output'];
    price: Scalars['Decimal']['output'];
    product: Product;
    purchase: Purchase;
    quantity: Scalars['Int']['output'];
    total: Maybe<Scalars['Decimal']['output']>;
};

export type PurchaseItemsInput = {
    product: Scalars['String']['input'];
    quantity: Scalars['Int']['input'];
};

export type Query = {
    __typename?: 'Query';
    allClients: Array<Client>;
    allLocalities: Array<Locality>;
    allProducts: Array<Product>;
    allPurchases: Array<Purchase>;
    allSuppliers: Array<Supplier>;
    brands: Array<Brand>;
    clientById: Maybe<Client>;
    clientExists: Scalars['Boolean']['output'];
    clients: PaginatedClientQueryResult;
    clientsCsv: Scalars['String']['output'];
    contractById: Maybe<RentalContract>;
    employeeById: Maybe<Employee>;
    employeeExists: Scalars['Boolean']['output'];
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
    products: PaginatedProductQueryResult;
    productsCsv: Scalars['String']['output'];
    productsStocksByOfficeId: Array<ProductStockInOffice>;
    productsStocksByOfficeInDateRange: Array<ProductStocksInDateRange>;
    productsSuppliedBySupplierId: Array<Product>;
    purchaseById: Maybe<Purchase>;
    purchaseItems: Array<PurchaseItem>;
    purchases: PaginatedPurchaseQueryResult;
    purchasesByClientId: Array<Purchase>;
    purchasesCsv: Scalars['String']['output'];
    rentalContracts: PaginatedRentalContractQueryResult;
    rentalContractsByClientId: Array<RentalContract>;
    rentalContractsCsv: Scalars['String']['output'];
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

export type QueryClientByIdArgs = {
    id: Scalars['ID']['input'];
};

export type QueryClientExistsArgs = {
    dni: InputMaybe<Scalars['String']['input']>;
    email: InputMaybe<Scalars['String']['input']>;
};

export type QueryClientsArgs = {
    page: InputMaybe<Scalars['Int']['input']>;
};

export type QueryContractByIdArgs = {
    id: Scalars['ID']['input'];
};

export type QueryEmployeeByIdArgs = {
    id: Scalars['ID']['input'];
};

export type QueryEmployeeExistsArgs = {
    email: Scalars['String']['input'];
};

export type QueryEmployeesArgs = {
    page: InputMaybe<Scalars['Int']['input']>;
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

export type QueryProductsArgs = {
    page: InputMaybe<Scalars['Int']['input']>;
    query: InputMaybe<Scalars['String']['input']>;
};

export type QueryProductsStocksByOfficeIdArgs = {
    officeId: Scalars['ID']['input'];
};

export type QueryProductsStocksByOfficeInDateRangeArgs = {
    endDate: Scalars['Date']['input'];
    startDate: Scalars['Date']['input'];
};

export type QueryProductsSuppliedBySupplierIdArgs = {
    supplierId: Scalars['ID']['input'];
};

export type QueryPurchaseByIdArgs = {
    id: Scalars['ID']['input'];
};

export type QueryPurchasesArgs = {
    page: InputMaybe<Scalars['Int']['input']>;
};

export type QueryPurchasesByClientIdArgs = {
    id: Scalars['ID']['input'];
};

export type QueryRentalContractsArgs = {
    page: InputMaybe<Scalars['Int']['input']>;
};

export type QueryRentalContractsByClientIdArgs = {
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

export type RentalContract = {
    __typename?: 'RentalContract';
    client: Client;
    contractEndDatetime: Scalars['DateTime']['output'];
    contractStartDatetime: Scalars['DateTime']['output'];
    createdOn: Scalars['DateTime']['output'];
    currentHistory: Maybe<RentalContractHistory>;
    expirationDate: Maybe<Scalars['DateTime']['output']>;
    /** Número de la calle donde vive el cliente */
    houseNumber: Scalars['String']['output'];
    /** Número de la casa o departamento */
    houseUnit: Maybe<Scalars['String']['output']>;
    id: Scalars['ID']['output'];
    locality: Locality;
    modifiedOn: Scalars['DateTime']['output'];
    office: Office;
    rentalContractHistory: Array<RentalContractHistory>;
    rentalContractItems: Array<RentalContractItem>;
    /** Nombre de la calle donde vive el cliente */
    streetName: Scalars['String']['output'];
    total: Maybe<Scalars['Decimal']['output']>;
};

export type RentalContractHistory = {
    __typename?: 'RentalContractHistory';
    createdOn: Scalars['DateTime']['output'];
    currentRentalContract: Maybe<RentalContract>;
    id: Scalars['ID']['output'];
    modifiedOn: Scalars['DateTime']['output'];
    rentalContract: RentalContract;
    status: RentalContractStatusChoices;
};

export type RentalContractItem = {
    __typename?: 'RentalContractItem';
    createdOn: Scalars['DateTime']['output'];
    id: Scalars['ID']['output'];
    modifiedOn: Scalars['DateTime']['output'];
    price: Maybe<Scalars['Decimal']['output']>;
    product: Product;
    quantity: Scalars['Int']['output'];
    quantityReturned: Maybe<Scalars['Int']['output']>;
    rentalContract: RentalContract;
    service: Maybe<ProductService>;
    servicePrice: Maybe<Scalars['Decimal']['output']>;
    serviceTotal: Maybe<Scalars['Decimal']['output']>;
    total: Maybe<Scalars['Decimal']['output']>;
};

export type RentalContractProductsItemInput = {
    id: Scalars['ID']['input'];
    quantity: Scalars['Int']['input'];
    service: InputMaybe<Scalars['String']['input']>;
};

/**
 *
 *     Enum-like class representing status choices for rental contract history. Inherits from models.TextChoices.
 *
 *     Provides predefined status choices like PRESUPUESTADO, CON_DEPOSITO, PAGADO, CANCELADO, etc.
 *
 */
export enum RentalContractStatusChoices {
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

export type ServiceInput = {
    id: InputMaybe<Scalars['ID']['input']>;
    name: Scalars['String']['input'];
    price: Scalars['String']['input'];
};

export type StartContract = {
    __typename?: 'StartContract';
    error: Maybe<Scalars['String']['output']>;
    rentalContract: Maybe<RentalContract>;
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

export type StockInput = {
    officeId: Scalars['ID']['input'];
    stock: Scalars['Int']['input'];
};

export type SuccessfulReturnContract = {
    __typename?: 'SuccessfulReturnContract';
    error: Maybe<Scalars['String']['output']>;
    rentalContract: Maybe<RentalContract>;
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
    /** Código de área del teléfono del proveedor */
    phoneCode: Scalars['String']['output'];
    /** Número de teléfono del proveedor */
    phoneNumber: Scalars['String']['output'];
    products: Array<ProductSupplier>;
    /** Nombre de la calle donde vive el proveedor */
    streetName: Scalars['String']['output'];
    supplierOrdersBranch: Array<OrderSupplier>;
};

export type SupplierOrderHistory = {
    __typename?: 'SupplierOrderHistory';
    createdOn: Scalars['DateTime']['output'];
    currentOrder: Maybe<OrderSupplier>;
    id: Scalars['ID']['output'];
    modifiedOn: Scalars['DateTime']['output'];
    status: CoreSupplierOrderHistoryModelStatusChoices;
    supplierOrder: OrderSupplier;
    user: Maybe<User>;
};

export type SupplierOrderProduct = {
    __typename?: 'SupplierOrderProduct';
    createdOn: Scalars['DateTime']['output'];
    id: Scalars['ID']['output'];
    modifiedOn: Scalars['DateTime']['output'];
    price: Scalars['Decimal']['output'];
    product: Product;
    quantity: Scalars['Int']['output'];
    quantityReceived: Scalars['Int']['output'];
    supplierOrder: OrderSupplier;
    total: Scalars['Decimal']['output'];
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
    email: InputMaybe<Scalars['String']['input']>;
    firstName: InputMaybe<Scalars['String']['input']>;
    lastName: InputMaybe<Scalars['String']['input']>;
    offices: Array<Scalars['ID']['input']>;
};

export type UpdateProduct = {
    __typename?: 'UpdateProduct';
    error: Maybe<Scalars['String']['output']>;
    product: Maybe<Product>;
};

export type UpdateProductInput = {
    brandId: InputMaybe<Scalars['ID']['input']>;
    description: InputMaybe<Scalars['String']['input']>;
    name: InputMaybe<Scalars['ID']['input']>;
    price: InputMaybe<Scalars['String']['input']>;
    services: Array<ServiceInput>;
    sku: InputMaybe<Scalars['String']['input']>;
    stock: Array<StockInput>;
    suppliers: Array<ProductSupplierInput>;
    type: InputMaybe<ProductTypeChoices>;
};

export type User = {
    __typename?: 'User';
    dateJoined: Scalars['DateTime']['output'];
    email: Scalars['String']['output'];
    employee: Maybe<Employee>;
    firstName: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    internalorderhistorymodelSet: Array<InternalOrderHistory>;
    /** Indica si el usuario debe ser tratado como activo. Desmarque esta opción en lugar de borrar la cuenta. */
    isActive: Scalars['Boolean']['output'];
    /** Designates whether the user can log into the admin site. */
    isStaff: Scalars['Boolean']['output'];
    /** Indica que este usuario tiene todos los permisos sin asignárselos explícitamente. */
    isSuperuser: Scalars['Boolean']['output'];
    lastLogin: Maybe<Scalars['DateTime']['output']>;
    lastName: Scalars['String']['output'];
    supplierorderhistorymodelSet: Array<SupplierOrderHistory>;
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

export type RentalContractsByClientIdQueryVariables = Exact<{
    id: Scalars['ID']['input'];
}>;

export type RentalContractsByClientIdQuery = {
    __typename?: 'Query';
    rentalContractsByClientId: Array<{
        __typename?: 'RentalContract';
        id: string;
        createdOn: any;
        expirationDate: any | null;
        contractStartDatetime: any;
        contractEndDatetime: any;
        houseNumber: string;
        streetName: string;
        houseUnit: string | null;
        total: any | null;
        currentHistory: {
            __typename?: 'RentalContractHistory';
            status: RentalContractStatusChoices;
        } | null;
        locality: { __typename?: 'Locality'; name: string; state: StateChoices };
        rentalContractItems: Array<{
            __typename?: 'RentalContractItem';
            id: string;
            quantity: number;
            product: {
                __typename?: 'Product';
                name: string;
                price: any | null;
                brand: { __typename?: 'Brand'; name: string } | null;
            };
        }>;
    }>;
};

export type PurchasesByClientIdQueryVariables = Exact<{
    id: Scalars['ID']['input'];
}>;

export type PurchasesByClientIdQuery = {
    __typename?: 'Query';
    purchasesByClientId: Array<{
        __typename?: 'Purchase';
        id: string;
        createdOn: any;
        total: any | null;
        purchaseItems: Array<{
            __typename?: 'PurchaseItem';
            id: string;
            quantity: number;
            product: {
                __typename?: 'Product';
                name: string;
                price: any | null;
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

export type AllClientsQueryVariables = Exact<{ [key: string]: never }>;

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
    rentalContracts: {
        __typename?: 'PaginatedRentalContractQueryResult';
        count: number;
        numPages: number;
        results: Array<{
            __typename?: 'RentalContract';
            id: string;
            createdOn: any;
            contractStartDatetime: any;
            contractEndDatetime: any;
            client: { __typename?: 'Client'; firstName: string; lastName: string };
            office: { __typename?: 'Office'; name: string };
            currentHistory: {
                __typename?: 'RentalContractHistory';
                status: RentalContractStatusChoices;
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
        __typename?: 'RentalContract';
        contractEndDatetime: any;
        contractStartDatetime: any;
        expirationDate: any | null;
        houseNumber: string;
        houseUnit: string | null;
        streetName: string;
        total: any | null;
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
        currentHistory: {
            __typename?: 'RentalContractHistory';
            status: RentalContractStatusChoices;
        } | null;
        office: {
            __typename?: 'Office';
            name: string;
            street: string;
            houseNumber: string;
        };
        rentalContractItems: Array<{
            __typename?: 'RentalContractItem';
            id: string;
            serviceTotal: any | null;
            servicePrice: any | null;
            total: any | null;
            price: any | null;
            quantity: number;
            product: {
                __typename?: 'Product';
                name: string;
                price: any | null;
                sku: string | null;
                brand: { __typename?: 'Brand'; name: string } | null;
            };
            service: { __typename?: 'ProductService'; name: string } | null;
        }>;
    } | null;
};

export type CreateRentalContractMutationVariables = Exact<{
    data: CreateRentalContractInput;
}>;

export type CreateRentalContractMutation = {
    __typename?: 'Mutation';
    createRentalContract: {
        __typename?: 'CreateRentalContract';
        error: string | null;
        rentalContract: {
            __typename?: 'RentalContract';
            id: string;
            createdOn: any;
            contractStartDatetime: any;
            contractEndDatetime: any;
            client: { __typename?: 'Client'; firstName: string; lastName: string };
            office: { __typename?: 'Office'; name: string };
            currentHistory: {
                __typename?: 'RentalContractHistory';
                status: RentalContractStatusChoices;
            } | null;
        } | null;
    } | null;
};

export type DeleteRentalContractMutationVariables = Exact<{
    id: Scalars['ID']['input'];
}>;

export type DeleteRentalContractMutation = {
    __typename?: 'Mutation';
    deleteRentalContract: {
        __typename?: 'DeleteRentalContract';
        success: boolean;
    } | null;
};

export type PayContractDepositMutationVariables = Exact<{
    id: Scalars['ID']['input'];
}>;

export type PayContractDepositMutation = {
    __typename?: 'Mutation';
    payContractDeposit: {
        __typename?: 'PayContractDeposit';
        error: string | null;
        rentalContract: {
            __typename?: 'RentalContract';
            id: string;
            currentHistory: {
                __typename?: 'RentalContractHistory';
                status: RentalContractStatusChoices;
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
        rentalContract: {
            __typename?: 'RentalContract';
            id: string;
            currentHistory: {
                __typename?: 'RentalContractHistory';
                status: RentalContractStatusChoices;
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
        rentalContract: {
            __typename?: 'RentalContract';
            id: string;
            currentHistory: {
                __typename?: 'RentalContractHistory';
                status: RentalContractStatusChoices;
            } | null;
        } | null;
    } | null;
};

export type ClientsCsvQueryVariables = Exact<{ [key: string]: never }>;

export type ClientsCsvQuery = { __typename?: 'Query'; clientsCsv: string };

export type EmployeesCsvQueryVariables = Exact<{ [key: string]: never }>;

export type EmployeesCsvQuery = { __typename?: 'Query'; employeesCsv: string };

export type RentalContractsCsvQueryVariables = Exact<{ [key: string]: never }>;

export type RentalContractsCsvQuery = {
    __typename?: 'Query';
    rentalContractsCsv: string;
};

export type ProductsCsvQueryVariables = Exact<{ [key: string]: never }>;

export type ProductsCsvQuery = { __typename?: 'Query'; productsCsv: string };

export type LocalitiesCsvQueryVariables = Exact<{ [key: string]: never }>;

export type LocalitiesCsvQuery = { __typename?: 'Query'; localitiesCsv: string };

export type OfficesCsvQueryVariables = Exact<{ [key: string]: never }>;

export type OfficesCsvQuery = { __typename?: 'Query'; officesCsv: string };

export type PurchasesCsvQueryVariables = Exact<{ [key: string]: never }>;

export type PurchasesCsvQuery = { __typename?: 'Query'; purchasesCsv: string };

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
    allPurchases: Array<{
        __typename?: 'Purchase';
        id: string;
        createdOn: any;
        total: any | null;
        client: { __typename?: 'Client'; firstName: string; lastName: string };
    }>;
    allClients: Array<{ __typename?: 'Client'; id: string }>;
    allProducts: Array<{
        __typename?: 'Product';
        id: string;
        name: string;
        purchaseItems: Array<{ __typename?: 'PurchaseItem'; quantity: number }>;
    }>;
};

export type EmployeesQueryVariables = Exact<{
    page: InputMaybe<Scalars['Int']['input']>;
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
        user: {
            __typename?: 'User';
            firstName: string;
            lastName: string;
            email: string;
            isActive: boolean;
            dateJoined: any;
            lastLogin: any | null;
        };
        offices: Array<{
            __typename?: 'EmployeeOffice';
            id: string;
            office: {
                __typename?: 'Office';
                id: string;
                name: string;
                locality: {
                    __typename?: 'Locality';
                    state: StateChoices;
                    postalCode: string;
                    name: string;
                };
            };
        }>;
    } | null;
};

export type DeleteEmployeeMutationVariables = Exact<{
    id: Scalars['ID']['input'];
}>;

export type DeleteEmployeeMutation = {
    __typename?: 'Mutation';
    deleteEmployee: { __typename?: 'DeleteEmployee'; success: boolean } | null;
};

export type EmployeeExistsQueryVariables = Exact<{
    email: Scalars['String']['input'];
}>;

export type EmployeeExistsQuery = { __typename?: 'Query'; employeeExists: boolean };

export type UpdateEmployeeMutationVariables = Exact<{
    id: Scalars['ID']['input'];
    employeeData: UpdateEmployeeInput;
}>;

export type UpdateEmployeeMutation = {
    __typename?: 'Mutation';
    updateEmployee: {
        __typename?: 'UpdateEmployee';
        error: string | null;
        employee: {
            __typename?: 'Employee';
            id: string;
            user: {
                __typename?: 'User';
                firstName: string;
                lastName: string;
                email: string;
                isActive: boolean;
                dateJoined: any;
                lastLogin: any | null;
            };
            offices: Array<{
                __typename?: 'EmployeeOffice';
                id: string;
                office: {
                    __typename?: 'Office';
                    id: string;
                    name: string;
                    locality: {
                        __typename?: 'Locality';
                        state: StateChoices;
                        postalCode: string;
                        name: string;
                    };
                };
            }>;
        } | null;
    } | null;
};

export type SingleEmployeeDataFragment = {
    __typename?: 'Employee';
    id: string;
    user: {
        __typename?: 'User';
        firstName: string;
        lastName: string;
        email: string;
        isActive: boolean;
        dateJoined: any;
        lastLogin: any | null;
    };
    offices: Array<{
        __typename?: 'EmployeeOffice';
        id: string;
        office: {
            __typename?: 'Office';
            id: string;
            name: string;
            locality: {
                __typename?: 'Locality';
                state: StateChoices;
                postalCode: string;
                name: string;
            };
        };
    }>;
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
        stock: Array<{ __typename?: 'ProductStockInOffice'; stock: number }>;
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
            officeBranch: { __typename?: 'Office'; name: string };
            officeDestination: { __typename?: 'Office'; name: string };
            currentHistory: {
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
        officeBranch: {
            __typename?: 'Office';
            id: string;
            houseNumber: string;
            name: string;
            street: string;
            locality: { __typename?: 'Locality'; name: string; postalCode: string };
        };
        officeDestination: {
            __typename?: 'Office';
            id: string;
            houseNumber: string;
            name: string;
            street: string;
            locality: { __typename?: 'Locality'; name: string; postalCode: string };
        };
        currentHistory: {
            __typename?: 'InternalOrderHistory';
            status: InternalOrderHistoryStatusChoices;
        } | null;
        orders: Array<{
            __typename?: 'InternalOrderProduct';
            quantity: number;
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
            officeDestination: { __typename?: 'Office'; name: string };
            currentHistory: {
                __typename?: 'SupplierOrderHistory';
                status: CoreSupplierOrderHistoryModelStatusChoices;
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
        officeDestination: {
            __typename?: 'Office';
            id: string;
            name: string;
            street: string;
            houseNumber: string;
            locality: { __typename?: 'Locality'; name: string };
        };
        currentHistory: {
            __typename?: 'SupplierOrderHistory';
            status: CoreSupplierOrderHistoryModelStatusChoices;
            user: {
                __typename?: 'User';
                firstName: string;
                lastName: string;
                email: string;
            } | null;
        } | null;
        orders: Array<{
            __typename?: 'SupplierOrderProduct';
            id: string;
            quantity: number;
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
        officeDestination: {
            __typename?: 'Office';
            name: string;
            street: string;
            houseNumber: string;
        };
        currentHistory: {
            __typename?: 'SupplierOrderHistory';
            status: CoreSupplierOrderHistoryModelStatusChoices;
            createdOn: any;
            user: {
                __typename?: 'User';
                email: string;
                firstName: string;
                lastName: string;
            } | null;
        } | null;
        orders: Array<{
            __typename?: 'SupplierOrderProduct';
            id: string;
            quantity: number;
            quantityReceived: number;
            product: {
                __typename?: 'Product';
                id: string;
                name: string;
                price: any | null;
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
        internalOrder: { __typename?: 'InternalOrder'; id: string } | null;
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
        internalOrder: { __typename?: 'InternalOrder'; id: string } | null;
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
    price: any | null;
    type: ProductTypeChoices;
    brand: { __typename?: 'Brand'; name: string } | null;
    services: Array<{
        __typename?: 'ProductService';
        id: string;
        name: string;
        price: any;
    }>;
    stock: Array<{
        __typename?: 'ProductStockInOffice';
        stock: number;
        office: { __typename?: 'Office'; id: string };
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
            price: any | null;
            type: ProductTypeChoices;
            brand: { __typename?: 'Brand'; name: string } | null;
            services: Array<{
                __typename?: 'ProductService';
                id: string;
                name: string;
                price: any;
            }>;
            stock: Array<{
                __typename?: 'ProductStockInOffice';
                stock: number;
                office: { __typename?: 'Office'; id: string };
            }>;
        }>;
    };
};

export type CreateProductMutationVariables = Exact<{
    productData: CreateProductInput;
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
            price: any | null;
            type: ProductTypeChoices;
            brand: { __typename?: 'Brand'; name: string } | null;
            services: Array<{
                __typename?: 'ProductService';
                id: string;
                name: string;
                price: any;
            }>;
            stock: Array<{
                __typename?: 'ProductStockInOffice';
                stock: number;
                office: { __typename?: 'Office'; id: string };
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
        stock: number;
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
        price: any | null;
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
        price: any | null;
        type: ProductTypeChoices;
        brand: { __typename?: 'Brand'; name: string } | null;
        services: Array<{
            __typename?: 'ProductService';
            id: string;
            name: string;
            price: any;
        }>;
        stock: Array<{
            __typename?: 'ProductStockInOffice';
            stock: number;
            office: { __typename?: 'Office'; id: string };
        }>;
    }>;
};

export type ProductExistsQueryVariables = Exact<{
    sku: Scalars['String']['input'];
}>;

export type ProductExistsQuery = { __typename?: 'Query'; productExists: boolean };

export type UpdateProductMutationVariables = Exact<{
    id: Scalars['ID']['input'];
    productData: UpdateProductInput;
}>;

export type UpdateProductMutation = {
    __typename?: 'Mutation';
    updateProduct: {
        __typename?: 'UpdateProduct';
        error: string | null;
        product: {
            __typename?: 'Product';
            id: string;
            sku: string | null;
            name: string;
            description: string | null;
            type: ProductTypeChoices;
            price: any | null;
            brand: { __typename?: 'Brand'; id: string; name: string } | null;
            stock: Array<{
                __typename?: 'ProductStockInOffice';
                stock: number;
                office: {
                    __typename?: 'Office';
                    id: string;
                    name: string;
                    locality: {
                        __typename?: 'Locality';
                        state: StateChoices;
                        postalCode: string;
                        name: string;
                    };
                };
            }>;
            services: Array<{
                __typename?: 'ProductService';
                id: string;
                name: string;
                price: any;
            }>;
            suppliers: Array<{
                __typename?: 'ProductSupplier';
                id: string;
                price: any;
                supplier: { __typename?: 'Supplier'; id: string; name: string };
            }>;
        } | null;
    } | null;
};

export type ProductByIdQueryVariables = Exact<{
    id: Scalars['ID']['input'];
}>;

export type ProductByIdQuery = {
    __typename?: 'Query';
    productById: {
        __typename?: 'Product';
        id: string;
        sku: string | null;
        name: string;
        description: string | null;
        type: ProductTypeChoices;
        price: any | null;
        brand: { __typename?: 'Brand'; id: string; name: string } | null;
        stock: Array<{
            __typename?: 'ProductStockInOffice';
            stock: number;
            office: {
                __typename?: 'Office';
                id: string;
                name: string;
                locality: {
                    __typename?: 'Locality';
                    state: StateChoices;
                    postalCode: string;
                    name: string;
                };
            };
        }>;
        services: Array<{
            __typename?: 'ProductService';
            id: string;
            name: string;
            price: any;
        }>;
        suppliers: Array<{
            __typename?: 'ProductSupplier';
            id: string;
            price: any;
            supplier: { __typename?: 'Supplier'; id: string; name: string };
        }>;
    } | null;
};

export type SingleProductFragment = {
    __typename?: 'Product';
    id: string;
    sku: string | null;
    name: string;
    description: string | null;
    type: ProductTypeChoices;
    price: any | null;
    brand: { __typename?: 'Brand'; id: string; name: string } | null;
    stock: Array<{
        __typename?: 'ProductStockInOffice';
        stock: number;
        office: {
            __typename?: 'Office';
            id: string;
            name: string;
            locality: {
                __typename?: 'Locality';
                state: StateChoices;
                postalCode: string;
                name: string;
            };
        };
    }>;
    services: Array<{
        __typename?: 'ProductService';
        id: string;
        name: string;
        price: any;
    }>;
    suppliers: Array<{
        __typename?: 'ProductSupplier';
        id: string;
        price: any;
        supplier: { __typename?: 'Supplier'; id: string; name: string };
    }>;
};

export type PurchasesQueryVariables = Exact<{
    page: InputMaybe<Scalars['Int']['input']>;
}>;

export type PurchasesQuery = {
    __typename?: 'Query';
    purchases: {
        __typename?: 'PaginatedPurchaseQueryResult';
        count: number;
        numPages: number;
        results: Array<{
            __typename?: 'Purchase';
            id: string;
            createdOn: any;
            total: any | null;
            client: { __typename?: 'Client'; firstName: string; lastName: string };
        }>;
    };
};

export type PurchaseByIdQueryVariables = Exact<{
    id: Scalars['ID']['input'];
}>;

export type PurchaseByIdQuery = {
    __typename?: 'Query';
    purchaseById: {
        __typename?: 'Purchase';
        id: string;
        createdOn: any;
        total: any | null;
        purchaseItems: Array<{
            __typename?: 'PurchaseItem';
            quantity: number;
            total: any | null;
            product: {
                __typename?: 'Product';
                name: string;
                price: any | null;
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

export type CreatePurchaseMutationVariables = Exact<{
    purchaseData: CreatePurchaseInput;
}>;

export type CreatePurchaseMutation = {
    __typename?: 'Mutation';
    createPurchase: {
        __typename?: 'CreatePurchase';
        error: string | null;
        purchase: {
            __typename?: 'Purchase';
            id: string;
            createdOn: any;
            total: any | null;
            client: { __typename?: 'Client'; firstName: string; lastName: string };
        } | null;
    } | null;
};

export type PurchaseListItemFragment = {
    __typename?: 'Purchase';
    id: string;
    createdOn: any;
    total: any | null;
    client: { __typename?: 'Client'; firstName: string; lastName: string };
};

export type DeletePurchaseMutationVariables = Exact<{
    id: Scalars['ID']['input'];
}>;

export type DeletePurchaseMutation = {
    __typename?: 'Mutation';
    deletePurchase: { __typename?: 'DeletePurchase'; success: boolean } | null;
};

export type AllSuppliersQueryVariables = Exact<{ [key: string]: never }>;

export type AllSuppliersQuery = {
    __typename?: 'Query';
    allSuppliers: Array<{ __typename?: 'Supplier'; id: string; name: string }>;
};

export type SuppliersQueryVariables = Exact<{
    page: InputMaybe<Scalars['Int']['input']>;
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
        locality: {
            __typename?: 'Locality';
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

export type CurrentUserQueryVariables = Exact<{ [key: string]: never }>;

export type CurrentUserQuery = {
    __typename?: 'Query';
    user: {
        __typename?: 'User';
        firstName: string;
        lastName: string;
        email: string;
        employee: {
            __typename?: 'Employee';
            offices: Array<{
                __typename?: 'EmployeeOffice';
                id: string;
                office: { __typename?: 'Office'; id: string; name: string };
            }>;
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
            employee: {
                __typename?: 'Employee';
                offices: Array<{
                    __typename?: 'EmployeeOffice';
                    id: string;
                    office: { __typename?: 'Office'; id: string; name: string };
                }>;
            } | null;
        };
    } | null;
};

export type CurrentUserFragment = {
    __typename?: 'User';
    firstName: string;
    lastName: string;
    email: string;
    employee: {
        __typename?: 'Employee';
        offices: Array<{
            __typename?: 'EmployeeOffice';
            id: string;
            office: { __typename?: 'Office'; id: string; name: string };
        }>;
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

export const SingleEmployeeDataFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'SingleEmployeeData' },
            typeCondition: {
                kind: 'NamedType',
                name: { kind: 'Name', value: 'Employee' },
            },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'user' },
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
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'isActive' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'dateJoined' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'lastLogin' },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'offices' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
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
} as unknown as DocumentNode<SingleEmployeeDataFragment, unknown>;
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
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'stock' },
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
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'stock' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<ProductListItemFragment, unknown>;
export const SingleProductFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'SingleProduct' },
            typeCondition: {
                kind: 'NamedType',
                name: { kind: 'Name', value: 'Product' },
            },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'sku' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'brand' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'stock' },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'stock' } },
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
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'suppliers' },
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
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'name' },
                                            },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<SingleProductFragment, unknown>;
export const PurchaseListItemFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'PurchaseListItem' },
            typeCondition: {
                kind: 'NamedType',
                name: { kind: 'Name', value: 'Purchase' },
            },
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
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<PurchaseListItemFragment, unknown>;
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
export const RentalContractsByClientIdDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'rentalContractsByClientId' },
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
                        name: { kind: 'Name', value: 'rentalContractsByClientId' },
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
                                    name: { kind: 'Name', value: 'currentHistory' },
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
                                    name: { kind: 'Name', value: 'rentalContractItems' },
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
} as unknown as DocumentNode<
    RentalContractsByClientIdQuery,
    RentalContractsByClientIdQueryVariables
>;
export const PurchasesByClientIdDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'purchasesByClientId' },
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
                        name: { kind: 'Name', value: 'purchasesByClientId' },
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
                                    name: { kind: 'Name', value: 'purchaseItems' },
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
} as unknown as DocumentNode<PurchasesByClientIdQuery, PurchasesByClientIdQueryVariables>;
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
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'allClients' },
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
                        name: { kind: 'Name', value: 'rentalContracts' },
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
                                                    value: 'currentHistory',
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
                                    name: { kind: 'Name', value: 'currentHistory' },
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
                                    name: { kind: 'Name', value: 'rentalContractItems' },
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
                                                    value: 'serviceTotal',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'servicePrice',
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'total' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'price' },
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
                                                                value: 'price',
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
                                                name: { kind: 'Name', value: 'service' },
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
                                                    value: 'servicePrice',
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
} as unknown as DocumentNode<ContractByIdQuery, ContractByIdQueryVariables>;
export const CreateRentalContractDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'CreateRentalContract' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'data' } },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'CreateRentalContractInput' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createRentalContract' },
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
                                    name: { kind: 'Name', value: 'rentalContract' },
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
                                                    value: 'currentHistory',
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
    CreateRentalContractMutation,
    CreateRentalContractMutationVariables
>;
export const DeleteRentalContractDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'deleteRentalContract' },
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
                        name: { kind: 'Name', value: 'deleteRentalContract' },
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
    DeleteRentalContractMutation,
    DeleteRentalContractMutationVariables
>;
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
                                    name: { kind: 'Name', value: 'rentalContract' },
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
                                                    value: 'currentHistory',
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
                                    name: { kind: 'Name', value: 'rentalContract' },
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
                                                    value: 'currentHistory',
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
                                    name: { kind: 'Name', value: 'rentalContract' },
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
                                                    value: 'currentHistory',
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
export const RentalContractsCsvDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'rentalContractsCsv' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'rentalContractsCsv' },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<RentalContractsCsvQuery, RentalContractsCsvQueryVariables>;
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
export const PurchasesCsvDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'purchasesCsv' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'purchasesCsv' } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<PurchasesCsvQuery, PurchasesCsvQueryVariables>;
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
                        name: { kind: 'Name', value: 'allPurchases' },
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
                                    name: { kind: 'Name', value: 'purchaseItems' },
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
                                {
                                    kind: 'FragmentSpread',
                                    name: { kind: 'Name', value: 'SingleEmployeeData' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'SingleEmployeeData' },
            typeCondition: {
                kind: 'NamedType',
                name: { kind: 'Name', value: 'Employee' },
            },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'user' },
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
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'isActive' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'dateJoined' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'lastLogin' },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'offices' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
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
export const EmployeeExistsDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'employeeExists' },
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
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'employeeExists' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'email' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'email' },
                                },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<EmployeeExistsQuery, EmployeeExistsQueryVariables>;
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
                                                kind: 'FragmentSpread',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'SingleEmployeeData',
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
            name: { kind: 'Name', value: 'SingleEmployeeData' },
            typeCondition: {
                kind: 'NamedType',
                name: { kind: 'Name', value: 'Employee' },
            },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'user' },
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
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'isActive' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'dateJoined' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'lastLogin' },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'offices' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
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
                                    name: { kind: 'Name', value: 'stock' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'stock' },
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
                                                    value: 'officeBranch',
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
                                                    value: 'officeDestination',
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
                                                    value: 'currentHistory',
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
                                    name: { kind: 'Name', value: 'officeBranch' },
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
                                    name: { kind: 'Name', value: 'officeDestination' },
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
                                    name: { kind: 'Name', value: 'currentHistory' },
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
                                    name: { kind: 'Name', value: 'orders' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'quantity' },
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
                                                    value: 'officeDestination',
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
                                                    value: 'currentHistory',
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
                                    name: { kind: 'Name', value: 'officeDestination' },
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
                                    name: { kind: 'Name', value: 'currentHistory' },
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
                                    name: { kind: 'Name', value: 'orders' },
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
                                                name: { kind: 'Name', value: 'quantity' },
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
                                    name: { kind: 'Name', value: 'officeDestination' },
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
                                    name: { kind: 'Name', value: 'currentHistory' },
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
                                    name: { kind: 'Name', value: 'orders' },
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
                                                name: { kind: 'Name', value: 'quantity' },
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
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'stock' },
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
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'stock' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<ProductsQuery, ProductsQueryVariables>;
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
                            name: { kind: 'Name', value: 'CreateProductInput' },
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
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'stock' },
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
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'stock' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<CreateProductMutation, CreateProductMutationVariables>;
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
                                { kind: 'Field', name: { kind: 'Name', value: 'stock' } },
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
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'stock' },
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
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'stock' } },
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
                            name: { kind: 'Name', value: 'UpdateProductInput' },
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
                                                    value: 'SingleProduct',
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
            name: { kind: 'Name', value: 'SingleProduct' },
            typeCondition: {
                kind: 'NamedType',
                name: { kind: 'Name', value: 'Product' },
            },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'sku' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'brand' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'stock' },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'stock' } },
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
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'suppliers' },
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
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'name' },
                                            },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<UpdateProductMutation, UpdateProductMutationVariables>;
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
                                {
                                    kind: 'FragmentSpread',
                                    name: { kind: 'Name', value: 'SingleProduct' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'SingleProduct' },
            typeCondition: {
                kind: 'NamedType',
                name: { kind: 'Name', value: 'Product' },
            },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'sku' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'brand' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'stock' },
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
                                { kind: 'Field', name: { kind: 'Name', value: 'stock' } },
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
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'suppliers' },
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
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'name' },
                                            },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<ProductByIdQuery, ProductByIdQueryVariables>;
export const PurchasesDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'purchases' },
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
                        name: { kind: 'Name', value: 'purchases' },
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
                                                    value: 'PurchaseListItem',
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
            name: { kind: 'Name', value: 'PurchaseListItem' },
            typeCondition: {
                kind: 'NamedType',
                name: { kind: 'Name', value: 'Purchase' },
            },
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
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<PurchasesQuery, PurchasesQueryVariables>;
export const PurchaseByIdDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'purchaseById' },
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
                        name: { kind: 'Name', value: 'purchaseById' },
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
                                    name: { kind: 'Name', value: 'purchaseItems' },
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
} as unknown as DocumentNode<PurchaseByIdQuery, PurchaseByIdQueryVariables>;
export const CreatePurchaseDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'createPurchase' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'purchaseData' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'CreatePurchaseInput' },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createPurchase' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'data' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'purchaseData' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'purchase' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'FragmentSpread',
                                                name: {
                                                    kind: 'Name',
                                                    value: 'PurchaseListItem',
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
            name: { kind: 'Name', value: 'PurchaseListItem' },
            typeCondition: {
                kind: 'NamedType',
                name: { kind: 'Name', value: 'Purchase' },
            },
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
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<CreatePurchaseMutation, CreatePurchaseMutationVariables>;
export const DeletePurchaseDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'deletePurchase' },
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
                        name: { kind: 'Name', value: 'deletePurchase' },
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
} as unknown as DocumentNode<DeletePurchaseMutation, DeletePurchaseMutationVariables>;
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
