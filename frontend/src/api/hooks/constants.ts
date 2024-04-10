import { AdminReportMostSoldProductsQueryVariables } from '../graphql';

export const queryDomains = {
    clients: 'clients',
    employees: 'employees',
    brands: 'brands',
    contracts: 'contracts',
    localities: 'localities',
    sales: 'sales',
    suppliers: 'suppliers',
    supplierOrders: 'supplier-orders',
    internalOrders: 'internal-orders',
    offices: 'offices',
    products: 'products',
    reports: 'reports',
};

const buildPaginatedListkey = (domain: string) => (filters?: any) => {
    return typeof filters !== 'undefined'
        ? [domain, 'list', 'paginated', filters]
        : [domain, 'list', 'paginated'];
};

const buildInfiniteListKey = (domain: string) => (filters?: any) => {
    return typeof filters !== 'undefined'
        ? [domain, 'infinite-list', filters]
        : [domain, 'infinite-list'];
};

const buildDetailKey = (domain: string) => (key?: any) =>
    typeof key !== 'undefined' ? [domain, 'detail', key] : [domain, 'detail'];

export const queryKeys = {
    clientsPaginatedList: buildPaginatedListkey(queryDomains.clients),
    clientsInfiniteList: buildInfiniteListKey(queryDomains.clients),
    clientDetailsById: buildDetailKey(queryDomains.clients),

    employeesPaginatedList: buildPaginatedListkey(queryDomains.employees),
    employeeDetailsById: buildDetailKey(queryDomains.employees),

    brandsNonPaginated: [queryDomains.brands, 'list', 'non-paginated'],

    contractsPaginatedList: buildPaginatedListkey(queryDomains.contracts),
    contractDetailsById: buildDetailKey(queryDomains.contracts),
    contractsListByClientId: (id: string | undefined) => [
        queryDomains.contracts,
        'list',
        'by-client-id',
        id,
    ],

    localitiesPaginatedList: buildPaginatedListkey(queryDomains.localities),
    localitiesNonPaginated: [queryDomains.localities, 'list', 'non-paginated'],

    reportMostSoldProducts: (variables: AdminReportMostSoldProductsQueryVariables) => [
        queryDomains.reports,
        'most-sold-products',
        variables,
    ],

    salesPaginatedList: buildPaginatedListkey(queryDomains.sales),
    saleDetailsById: buildDetailKey(queryDomains.sales),
    salesListByClientId: (id: string | undefined) => [
        queryDomains.sales,
        'list',
        'by-client-id',
        id,
    ],

    suppliersPaginatedList: buildPaginatedListkey(queryDomains.suppliers),
    supplierDetailsById: buildDetailKey(queryDomains.suppliers),

    supplierOrdersPaginatedList: buildPaginatedListkey(queryDomains.supplierOrders),
    supplierOrderDetailsById: buildDetailKey(queryDomains.supplierOrders),
    supplierOrderDetailsBySupplierId: (id: string | undefined) => [
        queryDomains.supplierOrders,
        'details',
        'by-supplier-id',
        id,
    ],

    internalOrdersPaginatedList: buildPaginatedListkey(queryDomains.internalOrders),
    internalOrdersDetailsById: buildDetailKey(queryDomains.internalOrders),

    officesNonPaginated: [queryDomains.offices, 'list', 'non-paginated'],

    productsNonPaginated: [queryDomains.products, 'list', 'non-paginated'],
    productsPaginatedList: buildPaginatedListkey(queryDomains.products),
    productDetailsById: buildDetailKey(queryDomains.products),
    productStocksInDateRange: (options: {
        productId: string | undefined | null;
        startDate: string | undefined | null;
        endDate: string | undefined | null;
    }) => [
        queryDomains.products,
        'list',
        'with-number-of-available-stocks-between-dates',
        options,
    ],
    productsStocksByOfficeId: (id: string | undefined) => [
        'products-stocks-by-office-id',
        id,
    ],
} as const;
