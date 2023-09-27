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
    GenericScalar: { input: any; output: any };
};

export type Client = {
    __typename?: 'Client';
    /** Número de documento de identidad del cliente */
    dni: Scalars['String']['output'];
    /** Número de la calle donde vive el cliente */
    houseNumber: Scalars['String']['output'];
    /** Número de la casa o departamento */
    houseUnit: Maybe<Scalars['String']['output']>;
    id: Scalars['ID']['output'];
    locality: Locality;
    /** Código de área del teléfono del cliente */
    phoneCode: Scalars['String']['output'];
    /** Número de teléfono del cliente */
    phoneNumber: Scalars['String']['output'];
    /** Nombre de la calle donde vive el cliente */
    streetName: Scalars['String']['output'];
    user: User;
};

export type Locality = {
    __typename?: 'Locality';
    clients: Array<Client>;
    id: Scalars['ID']['output'];
    name: Scalars['String']['output'];
    officemodelSet: Array<Office>;
    postalCode: Scalars['Int']['output'];
    state: LocalityLocalityModelStateChoices;
};

/** An enumeration. */
export enum LocalityLocalityModelStateChoices {
    /** BUENOS_AIRES */
    BuenosAires = 'BUENOS_AIRES',
    /** CATAMARCA */
    Catamarca = 'CATAMARCA',
    /** CHACO */
    Chaco = 'CHACO',
    /** CHUBUT */
    Chubut = 'CHUBUT',
    /** CORDOBA */
    Cordoba = 'CORDOBA',
    /** CORRIENTES */
    Corrientes = 'CORRIENTES',
    /** ENTRE_RIOS */
    EntreRios = 'ENTRE_RIOS',
    /** FORMOSA */
    Formosa = 'FORMOSA',
    /** JUJUY */
    Jujuy = 'JUJUY',
    /** LA_PAMPA */
    LaPampa = 'LA_PAMPA',
    /** LA_RIOJA */
    LaRioja = 'LA_RIOJA',
    /** MENDOZA */
    Mendoza = 'MENDOZA',
    /** MISIONES */
    Misiones = 'MISIONES',
    /** NEUQUEN */
    Neuquen = 'NEUQUEN',
    /** RIO_NEGRO */
    RioNegro = 'RIO_NEGRO',
    /** SALTA */
    Salta = 'SALTA',
    /** SANTA_CRUZ */
    SantaCruz = 'SANTA_CRUZ',
    /** SANTA_FE */
    SantaFe = 'SANTA_FE',
    /** SANTIAGO_DEL_ESTERO */
    SantiagoDelEstero = 'SANTIAGO_DEL_ESTERO',
    /** SAN_JUAN */
    SanJuan = 'SAN_JUAN',
    /** SAN_LUIS */
    SanLuis = 'SAN_LUIS',
    /** TIERRA_DEL_FUEGO */
    TierraDelFuego = 'TIERRA_DEL_FUEGO',
    /** TUCUMAN */
    Tucuman = 'TUCUMAN',
}

export type Login = {
    __typename?: 'Login';
    token: Scalars['String']['output'];
    user: User;
};

export type Mutation = {
    __typename?: 'Mutation';
    login: Maybe<Login>;
    refreshToken: Maybe<Refresh>;
    /** Obtain JSON Web Token mutation */
    tokenAuth: Maybe<ObtainJsonWebToken>;
    verifyToken: Maybe<Verify>;
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
    locality: Locality;
    name: Scalars['String']['output'];
    note: Scalars['String']['output'];
    street: Scalars['String']['output'];
};

export type Product = {
    __typename?: 'Product';
    id: Scalars['ID']['output'];
    title: Scalars['String']['output'];
};

export type Query = {
    __typename?: 'Query';
    clients: Array<Client>;
    localities: Array<Locality>;
    offices: Array<Office>;
    products: Array<Product>;
    users: Array<User>;
};

export type Refresh = {
    __typename?: 'Refresh';
    payload: Scalars['GenericScalar']['output'];
    refreshExpiresIn: Scalars['Int']['output'];
    token: Scalars['String']['output'];
};

export type User = {
    __typename?: 'User';
    client: Maybe<Client>;
    dateJoined: Scalars['DateTime']['output'];
    email: Scalars['String']['output'];
    firstName: Scalars['String']['output'];
    id: Scalars['ID']['output'];
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
        phoneCode: string;
        phoneNumber: string;
        streetName: string;
        houseUnit: string | null;
        houseNumber: string;
        dni: string;
        user: { __typename?: 'User'; email: string; firstName: string; lastName: string };
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
        postalCode: number;
        state: LocalityLocalityModelStateChoices;
    }>;
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
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'user' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
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
                                        ],
                                    },
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
