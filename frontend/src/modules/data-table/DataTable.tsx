'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from 'react';

import DataTableDropdown from './DataTableDropdown';

import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import { TH, Table, TD } from '@/components/Table';

type DataTableProps<T extends any> = {
    columns: {
        key: string;
        label: string;
    }[];
    data: T[];
    rowRenderer: (extraData: React.ReactNode) => (row: T) => React.ReactNode;
    deleteOptions?: {
        confirmationText: string | ((row: T) => React.ReactNode);
        isDeleting: boolean;
        onDeleteClick: (row: T) => void;
    };
    dropdownActions?: Array<{ label: string; onClick: () => void }>;
};

/**
 * DataTable - A generic component to render tables with dynamic columns and data.
 *
 * @param {Object} props - The properties object.
 * @param {Array} props.columns - An array of column objects containing key and label.
 * @param {Array} props.data - An array of data to be rendered in the table.
 * @param {Function} props.rowRenderer - A function to render each row of the table.
 * @returns {JSX.Element} The rendered DataTable component.
 */
const DataTable = <T extends any>({
    columns,
    data,
    rowRenderer,
    deleteOptions,
    dropdownActions,
}: DataTableProps<T>) => {
    const [itemToBeDeleted, setItemToBeDeleted] = useState<T | null>(null);
    const { confirmationText, isDeleting, onDeleteClick } = deleteOptions || {};

    const onRemoveClick = useCallback(
        (row: T) => () => {
            setItemToBeDeleted(row);
        },
        [],
    );

    return (
        <>
            <Table>
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <TH key={column.key}>{column.label}</TH>
                        ))}

                        {(deleteOptions || dropdownActions) && <TH></TH>}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => {
                        return rowRenderer(
                            deleteOptions || dropdownActions ? (
                                <TD>
                                    <DataTableDropdown
                                        actions={[
                                            ...(deleteOptions
                                                ? [
                                                      {
                                                          label: 'Eliminar',
                                                          onClick: onRemoveClick(item),
                                                      },
                                                  ]
                                                : []),
                                            ...(dropdownActions || []),
                                        ]}
                                    />
                                </TD>
                            ) : (
                                <></>
                            ),
                        )(item);
                    })}
                </tbody>
            </Table>

            {itemToBeDeleted && onDeleteClick && confirmationText && (
                <DeleteConfirmationModal
                    onCancelClick={() => {
                        setItemToBeDeleted(null);
                    }}
                    onConfirmClick={() => {
                        onDeleteClick(itemToBeDeleted);
                        setItemToBeDeleted(null);
                    }}
                    isDeleting={Boolean(isDeleting)}
                    confirmationText={
                        typeof confirmationText === 'function'
                            ? confirmationText(itemToBeDeleted)
                            : confirmationText
                    }
                />
            )}
        </>
    );
};

export default DataTable;
