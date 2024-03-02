'use client';

import { useParams } from 'next/navigation';

import { CellContext, ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useEffect } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';

import { InternalOrderByIdQuery, InternalOrderHistoryStatusChoices } from '@/api/graphql';
import {
    useInternalOrderById,
    useSetInternalOrderAsCanceled,
    useSetInternalOrderAsCompleted,
    useSetInternalOrderAsInProgress,
} from '@/api/hooks';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';
import ChevronRight from '@/modules/icons/ChevronRight';

import { BaseTable } from '@/components/base-table';
import ButtonWithSpinner from '@/components/ButtonWithSpinner';
import { ComboboxSimple } from '@/components/combobox';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithButton from '@/components/FetchStatusMessageWithButton';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';
import Spinner from '@/components/Spinner/Spinner';
import { Badge } from '@/components/ui/badge';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn, inputToNumber } from '@/lib/utils';

const useHeader = (
    internalOrder: InternalOrderByIdQuery['internalOrderById'] | undefined,
) => {
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

type QuantityReceivedColumnProps = {
    cell: CellContext<Item, any>;
};

const QuantityReceivedColumn = ({ cell }: QuantityReceivedColumnProps) => {
    const value = cell.getValue();
    const formMethods = useFormContext<FormValues>();
    const watchedStatus = formMethods.watch('status');
    const max = cell.row.original.quantityOrdered;

    return (
        <div>
            {watchedStatus?.value === InternalOrderHistoryStatusChoices.Completed ? (
                <FormField
                    name={`ordersById.${cell.row.original.id}.quantityReceived`}
                    control={formMethods.control}
                    rules={{
                        required: 'Este campo es requerido',
                        min: {
                            value: 0,
                            message: 'La cantidad recibida no puede ser menor a 0',
                        },
                        max: {
                            value: max,
                            message: `La cantidad recibida no puede ser mayor a ${max}`,
                        },
                    }}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(
                                            inputToNumber(e.target.value, {
                                                min: 0,
                                                max,
                                            }),
                                        );
                                    }}
                                    value={field.value ?? ''}
                                />
                            </FormControl>

                            <div className="flex space-x-4">
                                <FormMessage className="flex-1" />

                                <button
                                    className="ml-auto rounded-md border border-primary px-3 py-1.5 text-sm text-primary"
                                    onClick={() => field.onChange(max)}
                                >
                                    Llenar
                                </button>
                            </div>
                        </FormItem>
                    )}
                />
            ) : (
                value ?? '-'
            )}
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
        size: 300,
    }),
    columnHelper.accessor('quantityOrdered', {
        header: 'Cantidad solicitada',
        size: 300,
    }),
    columnHelper.accessor('quantityReceived', {
        header: 'Cantidad recibida',
        cell: (cell) => {
            return <QuantityReceivedColumn cell={cell} />;
        },
        size: 300,
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

type FormValues = Partial<{
    status: {
        value: InternalOrderHistoryStatusChoices;
        label: string;
    };
    note: string;
    ordersById: Record<string, { quantityReceived: number | null }>;
    ordersIds: string[];
}>;

const Page = () => {
    const { id } = useParams();
    const useInternalOrderByIdResult = useInternalOrderById(id as string);

    const internalOrder = useInternalOrderByIdResult.data?.internalOrderById;
    const statusToInProgressMutation = useSetInternalOrderAsInProgress();
    const statusToCompletedMutation = useSetInternalOrderAsCompleted();
    const statusToCanceledMutation = useSetInternalOrderAsCanceled();

    const header = useHeader(internalOrder);

    const formMethods = useForm<FormValues>();
    const { reset: formReset } = formMethods;

    useEffect(() => {
        if (!internalOrder) return;
        const ordersIds = internalOrder.orderItems.map((orderItem) => orderItem.id);
        const ordersById = internalOrder.orderItems.reduce(
            (acc, orderItem) => ({
                ...acc,
                [orderItem.id]: {
                    quantityReceived: null,
                },
            }),
            {},
        );

        formReset({
            ordersIds,
            ordersById,
        });
    }, [internalOrder, formReset]);

    const onSubmit = (data: FormValues) => {
        if (!internalOrder) return;

        if (data.status?.value === InternalOrderHistoryStatusChoices.InProgress) {
            statusToInProgressMutation.mutate(
                {
                    id: internalOrder.id,
                    note: data.note || null,
                },
                {
                    onSuccess: (data) => {
                        if (
                            !data.inProgressInternalOrder ||
                            data.inProgressInternalOrder?.error
                        ) {
                            toast.error(
                                'Hubo un error al actualizar el estado del pedido',
                            );
                            return;
                        }

                        formReset();
                    },
                    onError: () => {
                        toast.error('Hubo un error al actualizar el estado del pedido');
                    },
                },
            );
        }

        if (data.status?.value === InternalOrderHistoryStatusChoices.Completed) {
            statusToCompletedMutation.mutate(
                {
                    id: internalOrder.id,
                    note: data.note || null,
                    items: internalOrder.orderItems.map((orderItem) => ({
                        id: orderItem.id,
                        quantityReceived:
                            data.ordersById![orderItem.id]!.quantityReceived!,
                    })),
                },
                {
                    onSuccess: (data) => {
                        if (
                            !data.receiveInternalOrder ||
                            data.receiveInternalOrder?.error
                        ) {
                            toast.error(
                                'Hubo un error al actualizar el estado del pedido',
                            );
                            return;
                        }

                        formReset();
                    },
                    onError: () => {
                        toast.error('Hubo un error al actualizar el estado del pedido');
                    },
                },
            );
        }

        if (data.status?.value === InternalOrderHistoryStatusChoices.Canceled) {
            statusToCanceledMutation.mutate(
                {
                    id: internalOrder.id,
                    note: data.note || null,
                },
                {
                    onSuccess: (data) => {
                        if (
                            !data.cancelInternalOrder ||
                            data.cancelInternalOrder?.error
                        ) {
                            toast.error(
                                'Hubo un error al actualizar el estado del pedido',
                            );
                            return;
                        }

                        formReset();
                    },
                    onError: () => {
                        toast.error('Hubo un error al actualizar el estado del pedido');
                    },
                },
            );
        }
    };

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
                        <Form {...formMethods}>
                            <div className="flex-1 bg-muted pb-8">
                                <section className="pr-container grid grid-cols-12 gap-4 pl-8 pt-8">
                                    <div className="col-span-9">
                                        <div className="space-y-4 bg-white p-4">
                                            <div className="flex justify-between">
                                                <div>
                                                    <h2 className="text-lg font-bold">
                                                        Pedido #{internalOrder.id}
                                                    </h2>
                                                    <p className="text-sm text-muted-foreground">
                                                        Creado el{' '}
                                                        {format(
                                                            new Date(
                                                                internalOrder.createdOn,
                                                            ),
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

                                            <div className="space-y-2">
                                                <h3 className="text-sm text-muted-foreground">
                                                    Productos
                                                </h3>

                                                <BaseTable
                                                    columns={productColumns}
                                                    data={internalOrder.orderItems}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-span-3 grid grid-cols-1 gap-4">
                                        {internalOrder.latestHistoryEntry?.status !==
                                            InternalOrderHistoryStatusChoices.Completed &&
                                            internalOrder.latestHistoryEntry?.status !==
                                                InternalOrderHistoryStatusChoices.Canceled && (
                                                <div className="space-y-4 bg-white p-4">
                                                    <h3 className="text-sm text-muted-foreground">
                                                        Asignación de estado
                                                    </h3>

                                                    <FormField
                                                        name="status"
                                                        rules={{
                                                            required:
                                                                'Este campo es requerido',
                                                        }}
                                                        control={formMethods.control}
                                                        render={({ field }) => (
                                                            <FormItem className="flex flex-col space-y-2">
                                                                <FormLabel required>
                                                                    Nuevo estado
                                                                </FormLabel>

                                                                <ComboboxSimple
                                                                    placeholder="Selecciona un estado"
                                                                    options={
                                                                        internalOrder
                                                                            .latestHistoryEntry
                                                                            ?.status ===
                                                                        InternalOrderHistoryStatusChoices.Pending
                                                                            ? [
                                                                                  {
                                                                                      value: InternalOrderHistoryStatusChoices.InProgress,
                                                                                      label: 'En progreso',
                                                                                  },
                                                                                  {
                                                                                      value: InternalOrderHistoryStatusChoices.Canceled,
                                                                                      label: 'Cancelar',
                                                                                  },
                                                                                  {
                                                                                      value: InternalOrderHistoryStatusChoices.Completed,
                                                                                      label: 'Completar',
                                                                                  },
                                                                              ]
                                                                            : internalOrder
                                                                                    .latestHistoryEntry
                                                                                    ?.status ===
                                                                                InternalOrderHistoryStatusChoices.InProgress
                                                                              ? [
                                                                                    {
                                                                                        value: InternalOrderHistoryStatusChoices.Completed,
                                                                                        label: 'Completar',
                                                                                    },
                                                                                    {
                                                                                        value: InternalOrderHistoryStatusChoices.Canceled,
                                                                                        label: 'Cancelar',
                                                                                    },
                                                                                ]
                                                                              : []
                                                                    }
                                                                    onChange={
                                                                        field.onChange
                                                                    }
                                                                    value={
                                                                        field.value ||
                                                                        null
                                                                    }
                                                                />

                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        name="note"
                                                        control={formMethods.control}
                                                        render={({ field }) => (
                                                            <FormItem className="flex flex-col space-y-2">
                                                                <FormLabel>
                                                                    Nota
                                                                </FormLabel>

                                                                <FormControl>
                                                                    <Textarea
                                                                        {...field}
                                                                        value={
                                                                            field.value ||
                                                                            ''
                                                                        }
                                                                    />
                                                                </FormControl>

                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <ButtonWithSpinner
                                                        className="w-full"
                                                        showSpinner={
                                                            statusToInProgressMutation.isLoading ||
                                                            statusToCompletedMutation.isLoading ||
                                                            statusToCanceledMutation.isLoading
                                                        }
                                                        type="submit"
                                                        onClick={formMethods.handleSubmit(
                                                            onSubmit,
                                                        )}
                                                    >
                                                        Guardar
                                                    </ButtonWithSpinner>
                                                </div>
                                            )}

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
                                                                        <h3 className="mb-1 text-sm text-muted-foreground">
                                                                            {format(
                                                                                new Date(
                                                                                    historyEntry.createdOn,
                                                                                ),
                                                                                'dd/MM/yyyy',
                                                                            )}
                                                                        </h3>
                                                                        <p>
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
                                                                        </p>
                                                                        {historyEntry.note && (
                                                                            <p className="text-sm text-muted-foreground">
                                                                                {
                                                                                    historyEntry.note
                                                                                }
                                                                            </p>
                                                                        )}
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
                                                                              Fecha por
                                                                              definir
                                                                          </h3>
                                                                          <p>
                                                                              Esperando
                                                                              aprobación
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
                                                                              Fecha por
                                                                              definir
                                                                          </h3>
                                                                          <p>
                                                                              Esperando
                                                                              completar
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
                                </section>
                            </div>
                        </Form>
                    );
                }}
            </FetchedDataRenderer>
        </DashboardLayout>
    );
};

export default Page;
