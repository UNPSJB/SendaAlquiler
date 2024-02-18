import { ColumnDef, flexRender } from '@tanstack/react-table';
import Skeleton from 'react-loading-skeleton';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
};

export const AdminDataTableLoading = <TData, TValue>({
    columns,
}: DataTableProps<TData, TValue>) => {
    return (
        <div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {columns.map((column) => (
                            <TableHead key={column.id}>
                                {typeof column.header === 'string' ? (
                                    column.header
                                ) : (
                                    <Skeleton width={100}></Skeleton>
                                )}
                            </TableHead>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {[...new Array(5)].map((_, index) => (
                            <TableRow key={index}>
                                {columns.map((column) => (
                                    <TableCell key={column.id}>
                                        <Skeleton width={100}></Skeleton>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
