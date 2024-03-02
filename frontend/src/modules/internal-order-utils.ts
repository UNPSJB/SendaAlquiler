import { InternalOrderHistoryStatusChoices } from '@/api/graphql';

export const internalOrderStatusToText = (status: InternalOrderHistoryStatusChoices) => {
    switch (status) {
        case InternalOrderHistoryStatusChoices.Completed:
            return 'Completado';
        case InternalOrderHistoryStatusChoices.InProgress:
            return 'En progreso';
        case InternalOrderHistoryStatusChoices.Canceled:
            return 'Cancelado';
        default:
            return 'Pendiente';
    }
};
