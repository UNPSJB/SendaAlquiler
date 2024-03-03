import { SupplierOrderHistoryStatusChoices } from '@/api/graphql';

export const supplierOrderStatusToText = (status: SupplierOrderHistoryStatusChoices) => {
    switch (status) {
        case SupplierOrderHistoryStatusChoices.Completed:
            return 'Completado';
        case SupplierOrderHistoryStatusChoices.InProgress:
            return 'En progreso';
        case SupplierOrderHistoryStatusChoices.Canceled:
            return 'Cancelado';
        default:
            return 'Pendiente';
    }
};
