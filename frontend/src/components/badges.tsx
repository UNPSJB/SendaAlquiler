import {
    InternalOrderHistoryStatusChoices,
    SupplierOrderHistoryStatusChoices,
} from '@/api/graphql';

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
