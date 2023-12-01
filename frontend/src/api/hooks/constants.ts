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
        ? [domain, 'paginated-list', filters]
        : [domain, 'paginated-list'];

const buildDetailKey = (domain: string) => (key?: any) =>
    typeof key !== 'undefined' ? [domain, 'detail', key] : [domain, 'detail'];

export const queryKeys = {
    clientsNonPaginated: [queryDomains.clients, 'non-paginated'],
    clientsPaginatedList: buildPaginatedListkey(queryDomains.clients),
    clientDetailsById: buildDetailKey(queryDomains.clients),

    employeesPaginatedList: buildPaginatedListkey(queryDomains.employees),
    employeeDetailsById: buildDetailKey(queryDomains.employees),

    brandsNonPaginated: [queryDomains.brands, 'non-paginated'],

    contractsPaginatedList: buildPaginatedListkey(queryDomains.contracts),
    contractDetailsById: buildDetailKey(queryDomains.contracts),

    localitiesPaginatedList: buildPaginatedListkey(queryDomains.localities),
    localitiesNonPaginated: [queryDomains.localities, 'non-paginated'],

    purchasesPaginatedList: buildPaginatedListkey(queryDomains.purchases),
    purchaseDetailsById: buildDetailKey(queryDomains.purchases),

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

    officesNonPaginated: [queryDomains.offices, 'non-paginated'],

    productsNonPaginated: [queryDomains.products, 'non-paginated'],
    productsPaginatedList: buildPaginatedListkey(queryDomains.products),
    productDetailsById: buildDetailKey(queryDomains.products),

    productsStocksByOfficeId: (id: string) => ['products-stocks-by-office-id', id],
};
