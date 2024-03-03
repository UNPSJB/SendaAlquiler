import {
    ContractHistoryStatusChoices,
    InternalOrderHistoryStatusChoices,
    SupplierOrderHistoryStatusChoices,
} from '@/api/graphql';

import { contractStatusToText } from '@/modules/contract-utils';
import { internalOrderStatusToText } from '@/modules/internal-order-utils';
import { supplierOrderStatusToText } from '@/modules/supplier-order-utils';

import { Badge } from './ui/badge';

import { cn } from '@/lib/utils';

export const InternalOrderStatusBadge = ({
    status,
}: {
    status: InternalOrderHistoryStatusChoices;
}) => {
    const circleClassByStatus = {
        [InternalOrderHistoryStatusChoices.Canceled]: 'bg-red-500',
        [InternalOrderHistoryStatusChoices.Completed]: 'bg-green-500',
        [InternalOrderHistoryStatusChoices.InProgress]: 'bg-yellow-500',
        [InternalOrderHistoryStatusChoices.Pending]: 'bg-blue-500',
    };

    return (
        <Badge variant="outline" className="inline-flex space-x-2">
            <span
                className={cn(
                    'inline-block h-2.5 w-2.5 rounded-full',
                    circleClassByStatus[status],
                )}
            ></span>

            <span>{internalOrderStatusToText(status)}</span>
        </Badge>
    );
};

export const SupplierOrderStatusBadge = ({
    status,
}: {
    status: SupplierOrderHistoryStatusChoices;
}) => {
    const circleClassByStatus = {
        [SupplierOrderHistoryStatusChoices.Canceled]: 'bg-red-500',
        [SupplierOrderHistoryStatusChoices.Completed]: 'bg-green-500',
        [SupplierOrderHistoryStatusChoices.InProgress]: 'bg-yellow-500',
        [SupplierOrderHistoryStatusChoices.Pending]: 'bg-blue-500',
    };

    return (
        <Badge variant="outline" className="inline-flex space-x-2">
            <span
                className={cn(
                    'inline-block h-2.5 w-2.5 rounded-full',
                    circleClassByStatus[status],
                )}
            ></span>

            <span>{supplierOrderStatusToText(status)}</span>
        </Badge>
    );
};

export const ContractStatusBadge = ({
    status,
}: {
    status: ContractHistoryStatusChoices;
}) => {
    const circleClassByStatus = {
        [ContractHistoryStatusChoices.Activo]: 'bg-green-500',
        [ContractHistoryStatusChoices.Cancelado]: 'bg-gray-500',
        [ContractHistoryStatusChoices.ConDeposito]: 'bg-yellow-500',
        [ContractHistoryStatusChoices.DevolucionExitosa]: 'bg-gray-600',
        [ContractHistoryStatusChoices.DevolucionFallida]: 'bg-red-600',
        [ContractHistoryStatusChoices.Finalizado]: 'bg-primary',
        [ContractHistoryStatusChoices.Pagado]: 'bg-gray-700',
        [ContractHistoryStatusChoices.Presupuestado]: 'bg-blue-500',
        [ContractHistoryStatusChoices.Vencido]: 'bg-red-500',
    };

    return (
        <Badge variant="outline" className="inline-flex space-x-2">
            <span
                className={cn(
                    'inline-block h-2.5 w-2.5 rounded-full',
                    circleClassByStatus[status],
                )}
            ></span>

            <span>{contractStatusToText(status)}</span>
        </Badge>
    );
};
