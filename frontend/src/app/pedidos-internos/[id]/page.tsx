'use client';

import { useParams } from 'next/navigation';

import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

import { InternalOrderByIdQuery, InternalOrderHistoryStatusChoices } from '@/api/graphql';
import {
    useInternalOrderById,
    useSetInternalOrderAsCompleted,
    useSetInternalOrderAsInProgress,
} from '@/api/hooks';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';
import ChevronRight from '@/modules/icons/ChevronRight';

import { useOfficeContext } from '@/app/OfficeProvider';

import { BaseTable } from '@/components/base-table';
import ButtonWithSpinner from '@/components/ButtonWithSpinner';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithButton from '@/components/FetchStatusMessageWithButton';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';
import Spinner from '@/components/Spinner/Spinner';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const useHeader = (
    internalOrder: InternalOrderByIdQuery['internalOrderById'] | undefined,
) => {
    const { office } = useOfficeContext();
    const { mutate: markAsInProgress, isLoading: isMarkAsInProgressLoading } =
        useSetInternalOrderAsInProgress();
    const { mutate: markAsCompleted, isLoading: isMarkAsCompletedLoading } =
        useSetInternalOrderAsCompleted();

    if (!internalOrder) {
        return <DashboardLayoutBigTitle>Pedidos Internos</DashboardLayoutBigTitle>;
    }

    return (
        <div className="flex justify-between">
            <div className="flex items-center space-x-4">
                <DashboardLayoutBigTitle>Pedidos Internos</DashboardLayoutBigTitle>
                <ChevronRight />
                <span className="font-headings text-sm">Pedido #{internalOrder.id}</span>
            </div>

            {internalOrder.latestHistoryEntry?.status ===
                InternalOrderHistoryStatusChoices.Pending &&
                internalOrder.sourceOffice.id === office?.id && (
                    <ButtonWithSpinner
                        showSpinner={isMarkAsInProgressLoading}
                        onClick={() => {
                            markAsInProgress(internalOrder.id, {
                                onSuccess: () => {
                                    toast.success('Pedido en progreso');
                                },
                                onError: () => {
                                    toast.error('Ha ocurrido un error');
                                },
                            });
                        }}
                    >
                        Pasar pedido a en progreso
                    </ButtonWithSpinner>
                )}

            {internalOrder.latestHistoryEntry?.status ===
                InternalOrderHistoryStatusChoices.InProgress &&
                internalOrder.targetOffice.id === office?.id && (
                    <ButtonWithSpinner
                        showSpinner={isMarkAsCompletedLoading}
                        onClick={() => {
                            markAsCompleted(internalOrder.id, {
                                onSuccess: () => {
                                    toast.success('Pedido completado');
                                },
                                onError: () => {
                                    toast.error('Ha ocurrido un error');
                                },
                            });
                        }}
                    >
                        Pasar pedido a completado
                    </ButtonWithSpinner>
                )}
        </div>
    );
};

export type InternalOrderByIdTabComponentProps = {
    internalOrder: NonNullable<InternalOrderByIdQuery['internalOrderById']>;
};

enum StageStatus {
    Completed = 'completed',
    InProgress = 'inProgress',
    Upcoming = 'upcoming',
}

enum StagesSortingType {
    LATEST_STAGE_IS_FIRST = 'latestStageIsFirst',
    LATEST_STAGE_IS_LAST = 'latestStageIsLast',
}

interface Stage {
    id: string;
    status: StageStatus;
    children: React.ReactNode;
}

type CircleShouldBeFilledOptions = {
    status: StageStatus;
    sortingType: StagesSortingType;
    circlePosition: 'top' | 'bottom';
};

const getStageCircleStateClass = ({
    status,
    sortingType,
    circlePosition,
}: CircleShouldBeFilledOptions) => {
    if (sortingType === StagesSortingType.LATEST_STAGE_IS_LAST) {
        if (circlePosition === 'top') {
            if (status === StageStatus.Completed) {
                return 'bg-primary-v1 border-primary-v1';
            }

            if (status === StageStatus.InProgress) {
                return 'h-[18px] w-[18px] border-[4px] border-primary-v1-foreground bg-primary-v1';
            }

            return 'bg-primary-v1/30 border-primary-v1/30';
        }

        if (circlePosition === 'bottom') {
            if (status === StageStatus.Completed) {
                return 'bg-primary-v1 border-primary-v1';
            }

            return 'bg-primary-v1/30 border-primary-v1/30';
        }
    }
};

const VerticalProgressTracker = ({
    stages,
    sortingType = StagesSortingType.LATEST_STAGE_IS_LAST,
}: {
    stages: Stage[];
    sortingType?: StagesSortingType;
}) => {
    return (
        <div>
            {stages.map((stage, index) => {
                return (
                    <div key={stage.id} className="flex items-stretch space-x-4">
                        <div className="flex w-5 flex-col items-center">
                            <div
                                className={cn(
                                    'h-2.5 w-2.5 rounded-full border',
                                    getStageCircleStateClass({
                                        sortingType,
                                        status: stage.status,
                                        circlePosition: 'top',
                                    }),
                                )}
                            />

                            <div
                                className={cn(
                                    'w-[1px] flex-1 border-[1px]',
                                    [StageStatus.Upcoming].includes(stage.status) &&
                                        'border-primary-v1/30 border-dashed',
                                    StageStatus.InProgress === stage.status &&
                                        'border-primary-v1 border-dashed',
                                    StageStatus.Completed === stage.status &&
                                        'border-primary-v1 border-solid',
                                )}
                            />

                            {index === stages.length - 1 && (
                                <div
                                    className={cn(
                                        'h-2.5 w-2.5 rounded-full border',
                                        getStageCircleStateClass({
                                            sortingType,
                                            status: stage.status,
                                            circlePosition: 'bottom',
                                        }),
                                    )}
                                />
                            )}
                        </div>

                        <div className="py-1.5">{stage.children}</div>
                    </div>
                );
            })}
        </div>
    );
};

type Item = NonNullable<InternalOrderByIdQuery['internalOrderById']>['orderItems'][0];

const columnHelper = createColumnHelper<Item>();

const productColumns: ColumnDef<Item, any>[] = [
    columnHelper.accessor('product.name', {
        header: 'Descripción',
        cell: (cell) => {
            const value = cell.getValue();
            return (
                <div>
                    <p className="font-bold">{value}</p>
                    <p className="text-xs text-muted-foreground">
                        {cell.row.original.product.brand?.name || 'Sin marca'}
                    </p>
                </div>
            );
        },
    }),
    columnHelper.accessor('quantityOrdered', {
        header: 'Cantidad solicitada',
    }),
    columnHelper.accessor('quantityReceived', {
        header: 'Cantidad recibida',
    }),
];

const getSourceOfficeStateStatus = (
    latestHistoryEntry: NonNullable<
        InternalOrderByIdQuery['internalOrderById']
    >['latestHistoryEntry'],
) => {
    if (latestHistoryEntry?.status === InternalOrderHistoryStatusChoices.Canceled) {
        return StageStatus.Upcoming;
    }

    if (latestHistoryEntry?.status === InternalOrderHistoryStatusChoices.Pending) {
        return StageStatus.Upcoming;
    }

    if (latestHistoryEntry?.status === InternalOrderHistoryStatusChoices.InProgress) {
        return StageStatus.InProgress;
    }

    if (latestHistoryEntry?.status === InternalOrderHistoryStatusChoices.Completed) {
        return StageStatus.Completed;
    }

    return StageStatus.Upcoming;
};

const getTargetOfficeStateStatus = (
    latestHistoryEntry: NonNullable<
        InternalOrderByIdQuery['internalOrderById']
    >['latestHistoryEntry'],
) => {
    if (latestHistoryEntry?.status === InternalOrderHistoryStatusChoices.Pending) {
        return StageStatus.Upcoming;
    }

    if (latestHistoryEntry?.status === InternalOrderHistoryStatusChoices.InProgress) {
        return StageStatus.Upcoming;
    }

    if (latestHistoryEntry?.status === InternalOrderHistoryStatusChoices.Completed) {
        return StageStatus.Completed;
    }

    if (latestHistoryEntry?.status === InternalOrderHistoryStatusChoices.Canceled) {
        return StageStatus.Upcoming;
    }

    return StageStatus.Upcoming;
};

const Page = () => {
    const { id } = useParams();
    const useInternalOrderByIdResult = useInternalOrderById(id as string);

    const internalOrder = useInternalOrderByIdResult.data?.internalOrderById;

    const header = useHeader(internalOrder);

    return (
        <DashboardLayout header={header}>
            <FetchedDataRenderer
                {...useInternalOrderByIdResult}
                Loading={
                    <div className="flex w-full flex-1 items-center justify-center">
                        <Spinner />
                    </div>
                }
                Error={
                    <div className="flex w-full flex-1 items-center justify-center">
                        <FetchStatusMessageWithDescription
                            title="Ha ocurrido un error"
                            line1="Hubo un error al cargar el pedido."
                            line2="Prueba de nuevo más tarde."
                        />
                    </div>
                }
            >
                {({ internalOrderById: internalOrder }) => {
                    if (!internalOrder) {
                        return (
                            <div className="flex w-full flex-1 items-center justify-center">
                                <FetchStatusMessageWithButton
                                    message="Parece que el pedido que buscas no existe."
                                    btnHref="/pedidos-internos"
                                    btnText='Volver a "Pedido Internos"'
                                />
                            </div>
                        );
                    }

                    return (
                        <div className="flex flex-1 flex-col">
                            <header className="border-b pl-8"></header>

                            <div className="flex-1 bg-muted">
                                <section className="pr-container grid gap-4 pl-8 pt-8">
                                    <div className="space-y-4 bg-white p-4">
                                        <div className="flex justify-between">
                                            <div>
                                                <h2 className="text-lg font-bold">
                                                    Pedido #{internalOrder.id}
                                                </h2>
                                                <p className="text-sm text-muted-foreground">
                                                    Creado el{' '}
                                                    {format(
                                                        new Date(internalOrder.createdOn),
                                                        'dd/MM/yyyy',
                                                    )}
                                                </p>
                                            </div>

                                            <div>
                                                {internalOrder.latestHistoryEntry
                                                    ?.status ===
                                                    InternalOrderHistoryStatusChoices.Canceled && (
                                                    <Badge
                                                        variant="outline"
                                                        className="flex space-x-2"
                                                    >
                                                        <span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-red-500"></span>
                                                        <span>Cancelado</span>
                                                    </Badge>
                                                )}

                                                {internalOrder.latestHistoryEntry
                                                    ?.status ===
                                                    InternalOrderHistoryStatusChoices.Completed && (
                                                    <Badge
                                                        variant="outline"
                                                        className="flex space-x-2"
                                                    >
                                                        <span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-green-500"></span>
                                                        <span>Completado</span>
                                                    </Badge>
                                                )}

                                                {internalOrder.latestHistoryEntry
                                                    ?.status ===
                                                    InternalOrderHistoryStatusChoices.InProgress && (
                                                    <Badge
                                                        variant="outline"
                                                        className="flex space-x-2"
                                                    >
                                                        <span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-yellow-500"></span>
                                                        <span>En progreso</span>
                                                    </Badge>
                                                )}

                                                {internalOrder.latestHistoryEntry
                                                    ?.status ===
                                                    InternalOrderHistoryStatusChoices.Pending && (
                                                    <Badge
                                                        variant="outline"
                                                        className="flex space-x-2"
                                                    >
                                                        <span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-blue-500"></span>
                                                        <span>Pendiente</span>
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-4 bg-white p-4">
                                            <h3 className="text-sm text-muted-foreground">
                                                Origen y destino
                                            </h3>

                                            <VerticalProgressTracker
                                                stages={[
                                                    {
                                                        id: 'source',
                                                        status: getSourceOfficeStateStatus(
                                                            internalOrder.latestHistoryEntry,
                                                        ),
                                                        children: (
                                                            <div>
                                                                <h3 className="text-sm text-muted-foreground">
                                                                    Origen
                                                                </h3>
                                                                <p>
                                                                    {
                                                                        internalOrder
                                                                            .sourceOffice
                                                                            .name
                                                                    }
                                                                </p>
                                                            </div>
                                                        ),
                                                    },
                                                    {
                                                        id: 'target',
                                                        status: getTargetOfficeStateStatus(
                                                            internalOrder.latestHistoryEntry,
                                                        ),
                                                        children: (
                                                            <div>
                                                                <h3 className="text-sm text-muted-foreground">
                                                                    Destino
                                                                </h3>
                                                                <p>
                                                                    {
                                                                        internalOrder
                                                                            .targetOffice
                                                                            .name
                                                                    }
                                                                </p>
                                                            </div>
                                                        ),
                                                    },
                                                ]}
                                            />
                                        </div>

                                        <div className="space-y-4 bg-white p-4">
                                            <h3 className="text-sm text-muted-foreground">
                                                Historial del pedido
                                            </h3>

                                            <VerticalProgressTracker
                                                stages={[
                                                    ...internalOrder.historyEntries.map(
                                                        (historyEntry, index, arr) => {
                                                            const isCurrent =
                                                                index === arr.length - 1;
                                                            const isOldest = index === 0;

                                                            let status: StageStatus =
                                                                StageStatus.Upcoming;

                                                            if (isCurrent) {
                                                                if (
                                                                    historyEntry.status ===
                                                                        InternalOrderHistoryStatusChoices.Completed ||
                                                                    historyEntry.status ===
                                                                        InternalOrderHistoryStatusChoices.Canceled
                                                                ) {
                                                                    status =
                                                                        StageStatus.Completed;
                                                                }

                                                                if (
                                                                    historyEntry.status ===
                                                                    InternalOrderHistoryStatusChoices.InProgress
                                                                ) {
                                                                    status =
                                                                        StageStatus.InProgress;
                                                                }
                                                            }

                                                            if (!isCurrent && !isOldest) {
                                                                status =
                                                                    StageStatus.Completed;
                                                            }

                                                            if (isOldest) {
                                                                status =
                                                                    StageStatus.Completed;
                                                            }

                                                            return {
                                                                id: historyEntry.id,
                                                                status: status,
                                                                children: (
                                                                    <div>
                                                                        <h3 className="text-sm text-muted-foreground">
                                                                            {historyEntry.status ===
                                                                            InternalOrderHistoryStatusChoices.Completed
                                                                                ? 'Completado'
                                                                                : historyEntry.status ===
                                                                                    InternalOrderHistoryStatusChoices.InProgress
                                                                                  ? 'En progreso'
                                                                                  : historyEntry.status ===
                                                                                      InternalOrderHistoryStatusChoices.Canceled
                                                                                    ? 'Cancelado'
                                                                                    : 'Pendiente'}
                                                                        </h3>
                                                                        <p>
                                                                            {format(
                                                                                new Date(
                                                                                    historyEntry.createdOn,
                                                                                ),
                                                                                'dd/MM/yyyy',
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                ),
                                                            };
                                                        },
                                                    ),
                                                    ...(internalOrder.latestHistoryEntry
                                                        ?.status ===
                                                    InternalOrderHistoryStatusChoices.Pending
                                                        ? [
                                                              {
                                                                  id: 'pending',
                                                                  status: StageStatus.Upcoming,
                                                                  children: (
                                                                      <div>
                                                                          <h3 className="text-sm text-muted-foreground">
                                                                              Esperando
                                                                              aprobación
                                                                          </h3>
                                                                          <p>
                                                                              Fecha por
                                                                              definir
                                                                          </p>
                                                                      </div>
                                                                  ),
                                                              },
                                                          ]
                                                        : []),
                                                    ...(internalOrder.latestHistoryEntry
                                                        ?.status ===
                                                    InternalOrderHistoryStatusChoices.InProgress
                                                        ? [
                                                              {
                                                                  id: 'inProgress',
                                                                  status: StageStatus.Upcoming,
                                                                  children: (
                                                                      <div>
                                                                          <h3 className="text-sm text-muted-foreground">
                                                                              Esperando
                                                                              completar
                                                                          </h3>
                                                                          <p>
                                                                              Fecha por
                                                                              definir
                                                                          </p>
                                                                      </div>
                                                                  ),
                                                              },
                                                          ]
                                                        : []),
                                                ]}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4 bg-white p-4">
                                        <h3 className="text-sm text-muted-foreground">
                                            Productos
                                        </h3>

                                        <BaseTable
                                            columns={productColumns}
                                            data={internalOrder.orderItems}
                                        />
                                    </div>
                                </section>
                            </div>
                        </div>
                    );
                }}
            </FetchedDataRenderer>
        </DashboardLayout>
    );
};

export default Page;
