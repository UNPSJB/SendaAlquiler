import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import clsx from 'clsx';

import Button, { ButtonVariant } from '@/components/Button';

import ArrowLeft from '../icons/ArrowLeft';
import ArrowRigth from '../icons/ArrowRight';

type PaginationProps = {
    hasPrevious: boolean;
    hasNext: boolean;
    currentPage: number;
    totalPages: number;
};

/**
 * DataTablePagination - A pagination component to be used with DataTable.
 * Provides buttons to navigate to the previous and next pages.
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered DataTablePagination component.
 */
const DataTablePagination: React.FC<PaginationProps> = ({
    hasPrevious,
    hasNext,
    currentPage,
    totalPages,
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const changePage = (direction: 'prev' | 'next') => {
        let queryStr = '';
        searchParams.forEach((value, key) => {
            if (key !== 'page') {
                queryStr += `${key}=${encodeURIComponent(value)}`;
            }
        });

        if (direction === 'prev') {
            queryStr += `page=${currentPage - 1}`;
        } else {
            queryStr += `page=${currentPage + 1}`;
        }

        const href = `${pathname}?${queryStr}`;
        router.push(href);
    };

    const handlePrevious = () => {
        if (!hasPrevious) return;
        changePage('prev');
    };

    const handleNext = () => {
        if (!hasNext) return;
        changePage('next');
    };

    return (
        <div className="flex justify-center pt-8">
            <Button
                onClick={handlePrevious}
                className={clsx(
                    'flex items-center justify-center space-x-2',
                    !hasPrevious && 'pointer-events-none opacity-50',
                )}
                variant={ButtonVariant.OUTLINE_WHITE}
            >
                <ArrowLeft /> <span>Anterior</span>
            </Button>

            <div className="flex items-center justify-center px-8 text-center">
                <span className="text-sm font-semibold">
                    Página {currentPage} de {totalPages}
                </span>
            </div>

            <Button
                onClick={handleNext}
                className={clsx(
                    'flex items-center justify-center space-x-2',
                    !hasNext && 'pointer-events-none opacity-50',
                )}
                variant={ButtonVariant.OUTLINE_WHITE}
            >
                <span>Siguiente</span> <ArrowRigth />
            </Button>
        </div>
    );
};

export default DataTablePagination;
