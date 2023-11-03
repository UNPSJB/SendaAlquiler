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
    id: Scalars['ID']['output'];
    name: Scalars['String']['output'];
    products: Array<Product>;
};

export type Client = {
    __typename?: 'Client';
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
export enum CorePurchaseHistoryModelStatusChoices {
    /** Cancelado */
    Canceled = 'CANCELED',
    /** Pagado */
    Paid = 'PAID',
    /** Pendiente */
    Pending = 'PENDING',
}

/** An enumeration. */
export enum CoreRentalContractHistoryModelStatusChoices {
    /** ACTIVO */
    Activo = 'ACTIVO',
    /** CANCELADO */
    Cancelado = 'CANCELADO',
    /** SEÑADO */
    ConDeposito = 'CON_DEPOSITO',
    /** DEVOLUCION EXITOSA */
    DevolucionExitosa = 'DEVOLUCION_EXITOSA',
    /** DEVOLUCION FALLIDA */
    DevolucionFallida = 'DEVOLUCION_FALLIDA',
    /** FINALIZADO */
    Finalizado = 'FINALIZADO',
    /** PAGADO */
    Pagado = 'PAGADO',
    /** PRESUPUESTADO */
    Presupuestado = 'PRESUPUESTADO',
    /** VENCIDO */
    Vencido = 'VENCIDO',
}

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

export type Employee = {
    __typename?: 'Employee';
    id: Scalars['ID']['output'];
    user: User;
};

export type InternalOrder = {
    __typename?: 'InternalOrder';
    currentHistory: Maybe<InternalOrderHistory>;
    dateCreated: Scalars['DateTime']['output'];
    history: Array<InternalOrderHistory>;
    id: Scalars['ID']['output'];
    officeBranch: Office;
    officeDestination: Office;
};

export type InternalOrderHistory = {
    __typename?: 'InternalOrderHistory';
    currentOrder: Maybe<InternalOrder>;
    date: Scalars['DateTime']['output'];
    id: Scalars['ID']['output'];
    internalOrder: InternalOrder;
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
    id: Scalars['ID']['output'];
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
    createClient: Maybe<CreateClient>;
    createInternalOrder: Maybe<CreateInternalOrder>;
    createLocality: Maybe<CreateLocality>;
    createProduct: Maybe<CreateProduct>;
    login: Maybe<Login>;
    refreshToken: Maybe<Refresh>;
    /** Obtain JSON Web Token mutation */
    tokenAuth: Maybe<ObtainJsonWebToken>;
    updateClient: Maybe<UpdateClient>;
    verifyToken: Maybe<Verify>;
};

export type MutationCreateClientArgs = {
    clientData: CreateClientInput;
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

export type MutationLoginArgs = {
    email: Scalars['String']['input'];
    password: Scalars['String']['input'];
};

export type MutationRefreshTokenArgs = {
    token: InputMaybe<Scalars['String']['input']>;
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
    houseNumber: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    internalOrdersBranch: Array<InternalOrder>;
    internalOrdersDestination: Array<InternalOrder>;
    locality: Locality;
    name: Scalars['String']['output'];
    note: Maybe<Scalars['String']['output']>;
    rentalContracts: Array<RentalContract>;
    stock: Array<ProductStockInOffice>;
    street: Scalars['String']['output'];
    supplierOrdersDestination: Array<OrderSupplier>;
};

export type OrderSupplier = {
    __typename?: 'OrderSupplier';
    dateCreated: Scalars['DateTime']['output'];
    id: Scalars['ID']['output'];
    officeDestination: Office;
    supplier: Supplier;
    total: Scalars['Decimal']['output'];
};

export type Product = {
    __typename?: 'Product';
    brand: Maybe<Brand>;
    description: Maybe<Scalars['String']['output']>;
    id: Scalars['ID']['output'];
    name: Scalars['String']['output'];
    price: Maybe<Scalars['Decimal']['output']>;
    purchaseItems: Array<PurchaseItem>;
    rentalContractItems: Array<RentalContractItem>;
    services: Array<Service>;
    sku: Maybe<Scalars['String']['output']>;
    stock: Array<ProductStockInOffice>;
    type: ProductTypeChoices;
};

export type ProductStockInOffice = {
    __typename?: 'ProductStockInOffice';
    id: Scalars['ID']['output'];
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
    currentHistory: Maybe<PurchaseHistory>;
    date: Scalars['DateTime']['output'];
    id: Scalars['ID']['output'];
    purchaseItems: Array<PurchaseItem>;
    purchasehistorymodelSet: Array<PurchaseHistory>;
    total: Scalars['Decimal']['output'];
};

export type PurchaseHistory = {
    __typename?: 'PurchaseHistory';
    createdAt: Scalars['DateTime']['output'];
    currentPurchase: Maybe<Purchase>;
    id: Scalars['ID']['output'];
    purchase: Purchase;
    status: CorePurchaseHistoryModelStatusChoices;
};

export type PurchaseItem = {
    __typename?: 'PurchaseItem';
    id: Scalars['ID']['output'];
    price: Scalars['Decimal']['output'];
    product: Product;
    purchase: Purchase;
    quantity: Scalars['Int']['output'];
};

export type Query = {
    __typename?: 'Query';
    clientById: Maybe<Client>;
    clients: Array<Client>;
    internalOrders: Array<InternalOrder>;
    localities: Array<Locality>;
    officeById: Maybe<Office>;
    offices: Array<Office>;
    productById: Maybe<Product>;
    products: Array<Product>;
    productsStocksByOfficeId: Array<ProductStockInOffice>;
    supplierById: Maybe<Supplier>;
    suppliers: Array<Supplier>;
    users: Array<User>;
};

export type QueryClientByIdArgs = {
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

export type QuerySupplierByIdArgs = {
    id: Scalars['ID']['input'];
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
    currentHistory: Maybe<RentalContractHistory>;
    dateCreated: Scalars['DateTime']['output'];
    expirationDate: Maybe<Scalars['DateTime']['output']>;
    hasPayedDeposit: Scalars['Boolean']['output'];
    hasPayedRemainingAmount: Scalars['Boolean']['output'];
    /** Número de la calle donde vive el cliente */
    houseNumber: Scalars['String']['output'];
    /** Número de la casa o departamento */
    houseUnit: Maybe<Scalars['String']['output']>;
    id: Scalars['ID']['output'];
    locality: Locality;
    office: Office;
    rentalContractHistory: Array<RentalContractHistory>;
    rentalContractItems: Array<RentalContractItem>;
    /** Nombre de la calle donde vive el cliente */
    streetName: Scalars['String']['output'];
    total: Scalars['Decimal']['output'];
};

export type RentalContractHistory = {
    __typename?: 'RentalContractHistory';
    currentRentalContract: Maybe<RentalContract>;
    id: Scalars['ID']['output'];
    rentalContract: RentalContract;
    status: CoreRentalContractHistoryModelStatusChoices;
};

export type RentalContractItem = {
    __typename?: 'RentalContractItem';
    id: Scalars['ID']['output'];
    price: Scalars['Decimal']['output'];
    product: Product;
    quantity: Scalars['Int']['output'];
    quantityReturned: Maybe<Scalars['Int']['output']>;
    rentalContract: RentalContract;
    service: Maybe<Service>;
    servicePrice: Maybe<Scalars['Decimal']['output']>;
    serviceTotal: Maybe<Scalars['Decimal']['output']>;
    total: Scalars['Decimal']['output'];
};

export type Service = {
    __typename?: 'Service';
    id: Scalars['ID']['output'];
    name: Scalars['String']['output'];
    price: Scalars['Decimal']['output'];
    product: Product;
    rentalContractItems: Array<RentalContractItem>;
};

export type ServiceInput = {
    name: Scalars['String']['input'];
    price: Scalars['String']['input'];
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

export type Supplier = {
    __typename?: 'Supplier';
    cuit: Scalars['String']['output'];
    email: Scalars['String']['output'];
    /** Número de la calle donde vive el proveedor */
    houseNumber: Scalars['String']['output'];
    /** Número de la casa o departamento */
    houseUnit: Maybe<Scalars['String']['output']>;
    id: Scalars['ID']['output'];
    locality: Locality;
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
        locality: { __typename?: 'Locality'; name: string };
    }>;
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
        locality: { __typename?: 'Locality'; id: string; name: string } | null;
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
        services: Array<{ __typename?: 'Service'; name: string }>;
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
        product: { __typename?: 'Product'; id: string } | null;
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
} as unknown as DocumentNode<CreateProductMutation, CreateProductMutationVariables>;
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
