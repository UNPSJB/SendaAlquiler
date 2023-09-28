import Button, { ButtonVariant } from '@/components/Button';

import ArrowLeft from '../icons/ArrowLeft';
import ArrowRigth from '../icons/ArrowRight';

type PaginationProps = {
    onPrevious: () => void;
    onNext: () => void;
};

/**
 * DataTablePagination - A pagination component to be used with DataTable.
 * Provides buttons to navigate to the previous and next pages.
 *
 * @param {Object} props - The properties object.
 * @param {Function} props.onPrevious - A function to be called when the "Previous" button is clicked.
 * @param {Function} props.onNext - A function to be called when the "Next" button is clicked.
 * @returns {JSX.Element} The rendered DataTablePagination component.
 */
const DataTablePagination: React.FC<PaginationProps> = ({ onPrevious, onNext }) => (
    <div className="flex justify-between pt-8">
        <Button
            onClick={onPrevious}
            className="flex items-center justify-center space-x-2"
            variant={ButtonVariant.OUTLINE_WHITE}
        >
            <ArrowLeft /> <span>Anterior</span>
        </Button>

        <Button
            onClick={onNext}
            className="flex items-center justify-center space-x-2"
            variant={ButtonVariant.OUTLINE_WHITE}
        >
            <span>Siguiente</span> <ArrowRigth />
        </Button>
    </div>
);

export default DataTablePagination;
