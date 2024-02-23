import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    numberOfPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
};

export const AdminDataTable = <TData, TValue>({
    columns,
    data,
    currentPage,
    numberOfPages,
    onPageChange,
}: DataTableProps<TData, TValue>) => {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const minPage = Math.max(1, currentPage - 1);
    const maxPage = Math.min(numberOfPages, currentPage + 1);

    return (
        <div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No se encontraron resultados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>

                    <TableFooter>
                        {table.getFooterGroups().map((footerGroup) => (
                            <TableRow key={footerGroup.id}>
                                {footerGroup.headers.map((footer) => {
                                    return (
                                        <TableCell key={footer.id}>
                                            {flexRender(
                                                footer.column.columnDef.footer,
                                                footer.getContext(),
                                            )}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableFooter>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                className={
                                    currentPage === 1
                                        ? 'pointer-events-none opacity-50'
                                        : ''
                                }
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onPageChange(currentPage - 1);
                                }}
                            />
                        </PaginationItem>

                        {currentPage - 2 > 1 && (
                            <>
                                <PaginationItem>
                                    <PaginationLink
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onPageChange(1);
                                        }}
                                    >
                                        1
                                    </PaginationLink>
                                </PaginationItem>

                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            </>
                        )}

                        {currentPage - 2 == 1 && (
                            <PaginationItem>
                                <PaginationLink
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onPageChange(1);
                                    }}
                                >
                                    1
                                </PaginationLink>
                            </PaginationItem>
                        )}

                        {[...Array(maxPage - minPage + 1)].map((_, i) => {
                            const pageNumber = minPage + i;
                            return (
                                <PaginationItem key={pageNumber}>
                                    <PaginationLink
                                        isActive={pageNumber === currentPage}
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onPageChange(pageNumber);
                                        }}
                                    >
                                        {pageNumber}
                                    </PaginationLink>
                                </PaginationItem>
                            );
                        })}

                        {currentPage + 2 < numberOfPages && (
                            <>
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>

                                <PaginationItem>
                                    <PaginationLink
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onPageChange(numberOfPages);
                                        }}
                                    >
                                        {numberOfPages}
                                    </PaginationLink>
                                </PaginationItem>
                            </>
                        )}

                        {currentPage + 2 == numberOfPages && (
                            <PaginationItem>
                                <PaginationLink
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onPageChange(numberOfPages);
                                    }}
                                >
                                    {numberOfPages}
                                </PaginationLink>
                            </PaginationItem>
                        )}

                        <PaginationItem>
                            <PaginationNext
                                className={
                                    currentPage === numberOfPages
                                        ? 'pointer-events-none opacity-50'
                                        : ''
                                }
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onPageChange(currentPage + 1);
                                }}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
};
