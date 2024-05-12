'use client';

import { format } from 'date-fns';

import { SupplierOrderByIdQuery, SupplierOrderHistoryStatusChoices } from '@/api/graphql';

import { supplierOrderStatusToText } from '@/modules/supplier-order-utils';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
    VerticalProgressTrackerStage,
    VerticalProgressTrackerStageStatus as StageStatus,
} from '@/components/vertical-progress-tracker';
import { VerticalProgressTracker } from '@/components/vertical-progress-tracker';

type Props = {
    supplierOrder: NonNullable<SupplierOrderByIdQuery['supplierOrderById']>;
};

const createNextStage = (message: string) => {
    return {
        id: 'pending',
        status: StageStatus.Upcoming,
        children: (
            <div>
                <h3 className="text-sm text-muted-foreground">Fecha por definir</h3>
                <p>{message}</p>
            </div>
        ),
    };
};

const getNextStage = (
    latestHistoryEntry: Props['supplierOrder']['latestHistoryEntry'],
): VerticalProgressTrackerStage | null => {
    if (latestHistoryEntry?.status === SupplierOrderHistoryStatusChoices.Pending) {
        return createNextStage('Esperando confirmación');
    }

    if (latestHistoryEntry?.status === SupplierOrderHistoryStatusChoices.InProgress) {
        return createNextStage('Esperando completar');
    }

    return null;
};

type ResponsibleUserProps = {
    responsibleUser: {
        firstName: string;
        lastName: string;
        email: string;
    };
};

const ResponsibleUser = ({ responsibleUser }: ResponsibleUserProps) => {
    return (
        <HoverCard>
            <HoverCardTrigger>
                <span className="cursor-pointer font-medium underline">
                    {responsibleUser.email}
                </span>
            </HoverCardTrigger>

            <HoverCardContent className="w-80">
                <div className="flex space-x-4">
                    <Avatar>
                        <AvatarFallback>
                            {responsibleUser.firstName.charAt(0)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="text-sm">
                        <h4 className="font-medium">
                            {responsibleUser.firstName} {responsibleUser.lastName}
                        </h4>
                        <p>{responsibleUser.email}</p>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
};

type GetStateStatusOptions = {
    status: SupplierOrderHistoryStatusChoices;
    isCurrent: boolean;
    isOldest: boolean;
};

const getStateStatus = ({
    status,
    isCurrent,
    isOldest,
}: GetStateStatusOptions): StageStatus => {
    if (isCurrent) {
        const statuses = {
            [SupplierOrderHistoryStatusChoices.Pending]: StageStatus.Upcoming,
            [SupplierOrderHistoryStatusChoices.InProgress]: StageStatus.InProgress,
            [SupplierOrderHistoryStatusChoices.Completed]: StageStatus.Completed,
            [SupplierOrderHistoryStatusChoices.Canceled]: StageStatus.Completed,
        };

        return statuses[status];
    }

    if ((!isCurrent && !isOldest) || isOldest) {
        return StageStatus.Completed;
    }

    return StageStatus.Upcoming;
};

const formatDate = (date: string) => format(new Date(date), 'dd/MM/yyyy');

export const SupplierOrderHistorEntriesTracker = ({ supplierOrder }: Props) => {
    const nextStage = getNextStage(supplierOrder.latestHistoryEntry);

    const stages = supplierOrder.historyEntries.map((entry, index, arr) => ({
        id: entry.id,
        status: getStateStatus({
            status: entry.status,
            isCurrent: index === arr.length - 1,
            isOldest: index === 0,
        }),
        children: (
            <div>
                {entry.responsibleUser ? (
                    <div className="text-sm">
                        <ResponsibleUser responsibleUser={entry.responsibleUser} />{' '}
                        <span className="text-muted-foreground">
                            el {formatDate(entry.createdOn)}
                        </span>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        {formatDate(entry.createdOn)}
                    </p>
                )}

                <div className="space-y-1">
                    <p>{supplierOrderStatusToText(entry.status)}</p>

                    {entry.note && (
                        <p className="bg-muted p-2 text-sm text-muted-foreground">
                            {entry.note}
                        </p>
                    )}
                </div>
            </div>
        ),
    }));

    return (
        <div className="space-y-4 bg-white p-4">
            <h3 className="text-sm text-muted-foreground">Historial del pedido</h3>

            <VerticalProgressTracker
                stages={[...stages, ...(nextStage ? [nextStage] : [])]}
            />
        </div>
    );
};
