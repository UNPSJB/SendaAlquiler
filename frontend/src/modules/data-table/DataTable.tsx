/* eslint-disable @typescript-eslint/no-explicit-any */
import { TH, Table } from '@/components/Table';

type DataTableProps<T extends any> = {
    columns: {
        key: string;
        label: string;
    }[];
    data: T[];
    rowRenderer: (row: T) => JSX.Element;
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
const DataTable = <T extends any>({ columns, data, rowRenderer }: DataTableProps<T>) => (
    <Table>
        <thead>
            <tr>
                {columns.map((column) => (
                    <TH key={column.key}>{column.label}</TH>
                ))}
            </tr>
        </thead>
        <tbody>{data.map(rowRenderer)}</tbody>
    </Table>
);

export default DataTable;
