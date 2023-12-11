export const queryDomains = {
    clients: 'clients',
    employees: 'employees',
    brands: 'brands',
    contracts: 'contracts',
    localities: 'localities',
    purchases: 'purchases',
    suppliers: 'suppliers',
    supplierOrders: 'supplier-orders',
    internalOrders: 'internal-orders',
    offices: 'offices',
    products: 'products',
};

const buildPaginatedListkey = (domain: string) => (filters?: any) =>
    typeof filters !== 'undefined'
        ? [domain, 'list', 'paginated', filters]
        : [domain, 'list', 'paginated'];

const buildDetailKey = (domain: string) => (key?: any) =>
    typeof key !== 'undefined' ? [domain, 'detail', key] : [domain, 'detail'];

export const queryKeys = {
    clientsNonPaginated: [queryDomains.clients, 'list', 'non-paginated'],
    clientsPaginatedList: buildPaginatedListkey(queryDomains.clients),
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

    purchasesPaginatedList: buildPaginatedListkey(queryDomains.purchases),
    purchaseDetailsById: buildDetailKey(queryDomains.purchases),
    purchasesListByClientId: (id: string | undefined) => [
        queryDomains.purchases,
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
    productsStocksByOfficeInDateRange: (options: {
        startDate: string | undefined;
        endDate: string | undefined;
    }) => [
        queryDomains.products,
        'list',
        'with-number-of-available-stocks-between-dates',
        options,
    ],
    productsStocksByOfficeId: (id: string) => ['products-stocks-by-office-id', id],
};
