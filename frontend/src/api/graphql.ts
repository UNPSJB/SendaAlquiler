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
    description: Scalars['String']['input'];
    name: Scalars['String']['input'];
    price: Scalars['String']['input'];
    services: Array<ServiceInput>;
    sku: Scalars['String']['input'];
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
    officeId: Scalars['ID']['input'];
    products: Array<RentalContractProductsItemInput>;
    streetName: Scalars['String']['input'];
};

export type Employee = {
    __typename?: 'Employee';
    createdOn: Scalars['DateTime']['output'];
    id: Scalars['ID']['output'];
    modifiedOn: Scalars['DateTime']['output'];
    user: User;
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
    dateCreated: Scalars['DateTime']['output'];
    history: Array<InternalOrderHistory>;
    id: Scalars['ID']['output'];
    modifiedOn: Scalars['DateTime']['output'];
    officeBranch: Office;
    officeDestination: Office;
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

/** An enumeration. */
export enum InternalOrderHistoryStatusChoices {
    Canceled = 'CANCELED',
    Completed = 'COMPLETED',
    InProgress = 'IN_PROGRESS',
    Pending = 'PENDING',
}

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
    createBrand: Maybe<CreateBrand>;
    createClient: Maybe<CreateClient>;
    createEmployee: Maybe<CreateEmployee>;
    createInternalOrder: Maybe<CreateInternalOrder>;
    createLocality: Maybe<CreateLocality>;
    createProduct: Maybe<CreateProduct>;
    createPurchase: Maybe<CreatePurchase>;
    createRentalContract: Maybe<CreateRentalContract>;
    expiredContract: Maybe<ExpiredContract>;
    failedReturnContract: Maybe<FailedReturnContract>;
    finishContract: Maybe<FinishContract>;
    inProgressInternalOrder: Maybe<InProgressInternalOrder>;
    login: Maybe<Login>;
    payContractDeposit: Maybe<PayContractDeposit>;
    payTotalContract: Maybe<PayTotalContract>;
    receiveInternalOrder: Maybe<ReceiveInternalOrder>;
    refreshToken: Maybe<Refresh>;
    startContract: Maybe<StartContract>;
    successfulReturnContract: Maybe<SuccessfulReturnContract>;
    /** Obtain JSON Web Token mutation */
    tokenAuth: Maybe<ObtainJsonWebToken>;
    updateClient: Maybe<UpdateClient>;
    verifyToken: Maybe<Verify>;
};

export type MutationCancelContractArgs = {
    rentalContractId: Scalars['ID']['input'];
};

export type MutationCancelInternalOrderArgs = {
    internalOrderId: Scalars['ID']['input'];
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

export type MutationExpiredContractArgs = {
    rentalContractId: Scalars['ID']['input'];
};

export type MutationFailedReturnContractArgs = {
    rentalContractId: Scalars['ID']['input'];
};

export type MutationFinishContractArgs = {
    rentalContractId: Scalars['ID']['input'];
};

export type MutationInProgressInternalOrderArgs = {
    internalOrderId: Scalars['ID']['input'];
};

export type MutationLoginArgs = {
    email: Scalars['String']['input'];
    password: Scalars['String']['input'];
};

export type MutationPayContractDepositArgs = {
    rentalContractId: Scalars['ID']['input'];
};

export type MutationPayTotalContractArgs = {
    rentalContractId: Scalars['ID']['input'];
};

export type MutationReceiveInternalOrderArgs = {
    internalOrderId: Scalars['ID']['input'];
};

export type MutationRefreshTokenArgs = {
    token: InputMaybe<Scalars['String']['input']>;
};

export type MutationStartContractArgs = {
    rentalContractId: Scalars['ID']['input'];
};

export type MutationSuccessfulReturnContractArgs = {
    rentalContractId: Scalars['ID']['input'];
};

export type MutationTokenAuthArgs = {
    email: Scalars['String']['input'];
    password: Scalars['String']['input'];
};

export type MutationUpdateClientArgs = {
    clientData: UpdateClientInput;
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
    houseNumber: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    internalOrdersBranch: Array<InternalOrder>;
    internalOrdersDestination: Array<InternalOrder>;
    locality: Locality;
    modifiedOn: Scalars['DateTime']['output'];
    name: Scalars['String']['output'];
    note: Maybe<Scalars['String']['output']>;
    rentalContracts: Array<RentalContract>;
    stock: Array<ProductStockInOffice>;
    street: Scalars['String']['output'];
    supplierOrdersDestination: Array<OrderSupplier>;
};

export type OrderSupplier = {
    __typename?: 'OrderSupplier';
    createdOn: Scalars['DateTime']['output'];
    dateCreated: Scalars['DateTime']['output'];
    id: Scalars['ID']['output'];
    modifiedOn: Scalars['DateTime']['output'];
    officeDestination: Office;
    supplier: Supplier;
    total: Scalars['Decimal']['output'];
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
    rentalContractItems: Array<RentalContractItem>;
    services: Array<ProductService>;
    sku: Maybe<Scalars['String']['output']>;
    stock: Array<ProductStockInOffice>;
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

export type ProductSupplierInput = {
    price: Scalars['String']['input'];
    supplierId: Scalars['ID']['input'];
};

/** An enumeration. */
export enum ProductTypeChoices {
    Alquilable = 'ALQUILABLE',
    Comerciable = 'COMERCIABLE',
}

export type Purchase = {
    __typename?: 'Purchase';
    client: Client;
    createdOn: Scalars['DateTime']['output'];
    date: Scalars['DateTime']['output'];
    id: Scalars['ID']['output'];
    modifiedOn: Scalars['DateTime']['output'];
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
    brands: Array<Brand>;
    clientById: Maybe<Client>;
    clients: Array<Client>;
    employeeById: Maybe<Employee>;
    employees: Array<Employee>;
    internalOrders: Array<InternalOrder>;
    localities: Array<Locality>;
    officeById: Maybe<Office>;
    offices: Array<Office>;
    productById: Maybe<Product>;
    products: Array<Product>;
    productsStocksByOfficeId: Array<ProductStockInOffice>;
    purchaseById: Maybe<Purchase>;
    purchaseItems: Array<PurchaseItem>;
    purchases: Array<Purchase>;
    rentalContracts: Array<RentalContract>;
    supplierById: Maybe<Supplier>;
    suppliers: Array<Supplier>;
    users: Array<User>;
};

export type QueryClientByIdArgs = {
    id: Scalars['ID']['input'];
};

export type QueryEmployeeByIdArgs = {
    id: Scalars['ID']['input'];
};

export type QueryOfficeByIdArgs = {
    id: Scalars['ID']['input'];
};

export type QueryProductByIdArgs = {
    id: Scalars['ID']['input'];
};

export type QueryProductsStocksByOfficeIdArgs = {
    officeId: Scalars['ID']['input'];
};

export type QueryPurchaseByIdArgs = {
    id: Scalars['ID']['input'];
};

export type QuerySupplierByIdArgs = {
    id: Scalars['ID']['input'];
};

export type ReceiveInternalOrder = {
    __typename?: 'ReceiveInternalOrder';
    error: Maybe<Scalars['String']['output']>;
    internalOrder: Maybe<InternalOrder>;
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
    hasPayedDeposit: Scalars['Boolean']['output'];
    hasPayedRemainingAmount: Scalars['Boolean']['output'];
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
    price: Scalars['Decimal']['output'];
    product: Product;
    quantity: Scalars['Int']['output'];
    quantityReturned: Maybe<Scalars['Int']['output']>;
    rentalContract: RentalContract;
    service: Maybe<ProductService>;
    servicePrice: Maybe<Scalars['Decimal']['output']>;
    serviceTotal: Maybe<Scalars['Decimal']['output']>;
    total: Scalars['Decimal']['output'];
};

export type RentalContractProductsItemInput = {
    id: Scalars['ID']['input'];
    quantity: Scalars['Int']['input'];
    service: InputMaybe<Scalars['String']['input']>;
};

/** An enumeration. */
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
    name: Scalars['String']['input'];
    price: Scalars['String']['input'];
};

export type StartContract = {
    __typename?: 'StartContract';
    error: Maybe<Scalars['String']['output']>;
    rentalContract: Maybe<RentalContract>;
};

/** An enumeration. */
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
    /** Nombre de la calle donde vive el proveedor */
    streetName: Scalars['String']['output'];
    supplierOrdersBranch: Array<OrderSupplier>;
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
    id: Scalars['ID']['input'];
    lastName: InputMaybe<Scalars['String']['input']>;
    localityId: InputMaybe<Scalars['ID']['input']>;
    phoneCode: InputMaybe<Scalars['String']['input']>;
    phoneNumber: InputMaybe<Scalars['String']['input']>;
    streetName: InputMaybe<Scalars['String']['input']>;
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
};

export type Verify = {
    __typename?: 'Verify';
    payload: Scalars['GenericScalar']['output'];
};

export type ClientsQueryVariables = Exact<{ [key: string]: never }>;

export type ClientsQuery = {
    __typename?: 'Query';
    clients: Array<{
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

export type EmployeesQueryVariables = Exact<{ [key: string]: never }>;

export type EmployeesQuery = {
    __typename?: 'Query';
    employees: Array<{
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

export type PurchasesQueryVariables = Exact<{ [key: string]: never }>;

export type PurchasesQuery = {
    __typename?: 'Query';
    purchases: Array<{
        __typename?: 'Purchase';
        id: string;
        date: any;
        total: any | null;
        client: { __typename?: 'Client'; firstName: string; lastName: string };
    }>;
};

export type PurchaseByIdQueryVariables = Exact<{
    id: Scalars['ID']['input'];
}>;

export type PurchaseByIdQuery = {
    __typename?: 'Query';
    purchaseById: {
        __typename?: 'Purchase';
        id: string;
        date: any;
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
            date: any;
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
    } | null;
};

export type PurchaseListItemFragment = {
    __typename?: 'Purchase';
    id: string;
    date: any;
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
};

export type LocalitiesQueryVariables = Exact<{ [key: string]: never }>;

export type LocalitiesQuery = {
    __typename?: 'Query';
    localities: Array<{
        __typename?: 'Locality';
        id: string;
        name: string;
        postalCode: string;
        state: StateChoices;
    }>;
};

export type ProductsQueryVariables = Exact<{ [key: string]: never }>;

export type ProductsQuery = {
    __typename?: 'Query';
    products: Array<{
        __typename?: 'Product';
        id: string;
        name: string;
        price: any | null;
        type: ProductTypeChoices;
        brand: { __typename?: 'Brand'; name: string } | null;
        services: Array<{ __typename?: 'ProductService'; id: string; name: string }>;
    }>;
};

export type SuppliersQueryVariables = Exact<{ [key: string]: never }>;

export type SuppliersQuery = {
    __typename?: 'Query';
    suppliers: Array<{
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

export type CreateClientMutationVariables = Exact<{
    clientData: CreateClientInput;
}>;

export type CreateClientMutation = {
    __typename?: 'Mutation';
    createClient: {
        __typename?: 'CreateClient';
        error: string | null;
        client: { __typename?: 'Client'; id: string } | null;
    } | null;
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
            name: string;
            state: StateChoices;
            postalCode: string;
        };
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
    } | null;
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
        price: any | null;
        brand: { __typename?: 'Brand'; name: string } | null;
        stock: Array<{
            __typename?: 'ProductStockInOffice';
            stock: number;
            office: {
                __typename?: 'Office';
                locality: { __typename?: 'Locality'; name: string };
            };
        }>;
        services: Array<{ __typename?: 'ProductService'; name: string }>;
    } | null;
};

export type InternalOrdersQueryVariables = Exact<{ [key: string]: never }>;

export type InternalOrdersQuery = {
    __typename?: 'Query';
    internalOrders: Array<{
        __typename?: 'InternalOrder';
        id: string;
        dateCreated: any;
        officeBranch: { __typename?: 'Office'; name: string };
        officeDestination: { __typename?: 'Office'; name: string };
        currentHistory: {
            __typename?: 'InternalOrderHistory';
            status: InternalOrderHistoryStatusChoices;
        } | null;
    }>;
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
            services: Array<{ __typename?: 'ProductService'; id: string; name: string }>;
        } | null;
    } | null;
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

export type ProductListItemFragment = {
    __typename?: 'Product';
    id: string;
    name: string;
    price: any | null;
    type: ProductTypeChoices;
    brand: { __typename?: 'Brand'; name: string } | null;
    services: Array<{ __typename?: 'ProductService'; id: string; name: string }>;
};

export type ContractsQueryVariables = Exact<{ [key: string]: never }>;

export type ContractsQuery = {
    __typename?: 'Query';
    rentalContracts: Array<{
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

export type LoginMutationVariables = Exact<{
    email: Scalars['String']['input'];
    password: Scalars['String']['input'];
}>;

export type LoginMutation = {
    __typename?: 'Mutation';
    login: {
        __typename?: 'Login';
        token: string;
        user: { __typename?: 'User'; firstName: string; lastName: string; email: string };
    } | null;
};

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
                    { kind: 'Field', name: { kind: 'Name', value: 'date' } },
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
                                                name: { kind: 'Name', value: 'name' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'brand' },
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
                                                name: { kind: 'Name', value: 'price' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'quantity' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'total' } },
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
                                    name: { kind: 'Name', value: 'firstName' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'lastName' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'phoneCode' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'phoneNumber' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<PurchaseListItemFragment, unknown>;
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
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<ProductListItemFragment, unknown>;
export const ClientsDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'clients' },
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
                                    name: { kind: 'Name', value: 'phoneCode' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'phoneNumber' },
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
                                    name: { kind: 'Name', value: 'houseNumber' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'dni' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<ClientsQuery, ClientsQueryVariables>;
export const EmployeesDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'employees' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'employees' },
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
export const PurchasesDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'purchases' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'purchases' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'date' } },
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
                                {
                                    kind: 'FragmentSpread',
                                    name: { kind: 'Name', value: 'PurchaseListItem' },
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
                    { kind: 'Field', name: { kind: 'Name', value: 'date' } },
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
                                                name: { kind: 'Name', value: 'name' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'brand' },
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
                                                name: { kind: 'Name', value: 'price' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'quantity' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'total' } },
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
                                    name: { kind: 'Name', value: 'firstName' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'lastName' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'phoneCode' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'phoneNumber' },
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
                    { kind: 'Field', name: { kind: 'Name', value: 'date' } },
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
                                                name: { kind: 'Name', value: 'name' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'brand' },
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
                                                name: { kind: 'Name', value: 'price' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'quantity' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'total' } },
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
                                    name: { kind: 'Name', value: 'firstName' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'lastName' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'phoneCode' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'phoneNumber' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<CreatePurchaseMutation, CreatePurchaseMutationVariables>;
export const LocalitiesDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'localities' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'localities' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'postalCode' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'state' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<LocalitiesQuery, LocalitiesQueryVariables>;
export const ProductsDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'products' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'products' },
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
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<ProductsQuery, ProductsQueryVariables>;
export const SuppliersDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'suppliers' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'suppliers' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'cuit' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'phoneCode' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'phoneNumber' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
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
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'streetName' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'houseNumber' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'houseUnit' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'note' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<SuppliersQuery, SuppliersQueryVariables>;
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
                                                name: { kind: 'Name', value: 'name' },
                                            },
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
                                                name: { kind: 'Name', value: 'stock' },
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
} as unknown as DocumentNode<ProductByIdQuery, ProductByIdQueryVariables>;
export const InternalOrdersDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'internalOrders' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'internalOrders' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'officeBranch' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'name' },
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
                                                name: { kind: 'Name', value: 'name' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'dateCreated' },
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
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<InternalOrdersQuery, InternalOrdersQueryVariables>;
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
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<CreateProductMutation, CreateProductMutationVariables>;
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
export const ContractsDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'contracts' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'rentalContracts' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
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
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'createdOn' },
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
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<ContractsQuery, ContractsQueryVariables>;
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
