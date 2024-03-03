import { ContractHistoryStatusChoices } from '@/api/graphql';

export const contractStatusToText = (status: ContractHistoryStatusChoices) => {
    switch (status) {
        case ContractHistoryStatusChoices.Activo:
            return 'Activo';
        case ContractHistoryStatusChoices.Cancelado:
            return 'Cancelado';
        case ContractHistoryStatusChoices.ConDeposito:
            return 'Con depósito';
        case ContractHistoryStatusChoices.DevolucionExitosa:
            return 'Devolución exitosa';
        case ContractHistoryStatusChoices.DevolucionFallida:
            return 'Devolución fallida';
        case ContractHistoryStatusChoices.Finalizado:
            return 'Finalizado';
        case ContractHistoryStatusChoices.Pagado:
            return 'Pagado';
        case ContractHistoryStatusChoices.Presupuestado:
            return 'Presupuestado';
        case ContractHistoryStatusChoices.Vencido:
            return 'Vencido';
        default:
            return status;
    }
};
