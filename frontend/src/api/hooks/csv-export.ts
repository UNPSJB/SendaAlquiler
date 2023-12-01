import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import {
    ClientsCsvDocument,
    EmployeesCsvDocument,
    SuppliersCsvDocument,
    SuppliersOrdersCsvDocument,
    InternalOrdersCsvDocument,
    LocalitiesCsvDocument,
    ProductsCsvDocument,
    OfficesCsvDocument,
    PurchasesCsvDocument,
    RentalContractsCsvDocument,
} from '../graphql';
import { clientGraphqlQuery } from '../graphqlclient';

type UseCsvExporterOptions<TData extends Record<string, string>, TVariables> = {
    query: DocumentNode<TData, TVariables>;
    csvKey: keyof TData;
    variables: TVariables;
    filename: string;
};

const useCsvExporter = <TData extends Record<string, string>, TVariables>(
    options: UseCsvExporterOptions<TData, TVariables>,
) => {
    const { query, csvKey, variables, filename } = options;
    const { mutate, isLoading } = useMutation<TData, Error, TVariables>({
        mutationFn: () => {
            return clientGraphqlQuery(query, variables);
        },
        onSuccess: (data) => {
            const csv = data[csvKey];
            if (!csv) {
                toast.error('No se pudo exportar el CSV');
            }

            console.log(csv);
            const csvContent = `data:text/csv;charset=utf-8,${csv}`;
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', `${filename}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            toast.success('Se exportó el CSV correctamente');
        },
    });

    return {
        exportCsv: mutate,
        isExporting: isLoading,
    };
};

export const useExportClientsCsv = () => {
    return useCsvExporter({
        query: ClientsCsvDocument,
        csvKey: 'clientsCsv',
        variables: {},
        filename: 'clientes',
    });
};

export const useExportEmployeesCsv = () => {
    return useCsvExporter({
        query: EmployeesCsvDocument,
        csvKey: 'employeesCsv',
        variables: {},
        filename: 'empleados',
    });
};

export const useExportSuppliersCsv = () => {
    return useCsvExporter({
        query: SuppliersCsvDocument,
        csvKey: 'suppliersCsv',
        variables: {},
        filename: 'proveedores',
    });
};

export const useExportSupplierOrdersCsv = () => {
    return useCsvExporter({
        query: SuppliersOrdersCsvDocument,
        csvKey: 'suppliersOrdersCsv',
        variables: {},
        filename: 'ordenes-a-proveedores',
    });
};

export const useExportInternalOrdersCsv = () => {
    return useCsvExporter({
        query: InternalOrdersCsvDocument,
        csvKey: 'internalOrdersCsv',
        variables: {},
        filename: 'ordenes-internas',
    });
};

export const useExportLocalitiesCsv = () => {
    return useCsvExporter({
        query: LocalitiesCsvDocument,
        csvKey: 'localitiesCsv',
        variables: {},
        filename: 'localidades',
    });
};

export const useExportProductsCsv = () => {
    return useCsvExporter({
        query: ProductsCsvDocument,
        csvKey: 'productsCsv',
        variables: {},
        filename: 'productos',
    });
};

export const useExportOfficesCsv = () => {
    return useCsvExporter({
        query: OfficesCsvDocument,
        csvKey: 'officesCsv',
        variables: {},
        filename: 'sucursales',
    });
};

export const useExportPurchasesCsv = () => {
    return useCsvExporter({
        query: PurchasesCsvDocument,
        csvKey: 'purchasesCsv',
        variables: {},
        filename: 'compras',
    });
};

export const useExportRentalContractsCsv = () => {
    return useCsvExporter({
        query: RentalContractsCsvDocument,
        csvKey: 'rentalContractsCsv',
        variables: {},
        filename: 'contratos-de-alquiler',
    });
};
