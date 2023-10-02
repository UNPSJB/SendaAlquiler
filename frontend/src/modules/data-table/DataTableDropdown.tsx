import { useEffect, useRef, useState } from 'react';

import VerticalEllipsis from '../icons/VerticalEllipsis';

interface DropdownProps {
    onRemove: () => void;
}

/**
 * DataTableDropdown - A dropdown component specifically designed for DataTable rows,
 * providing actions like 'Remove' on each data row.
 *
 * @param {Object} props - The properties object.
 * @param {Function} props.onRemove - A function to be called when the 'Remove' action is clicked.
 * @returns {JSX.Element} The rendered DataTableDropdown component.
 */
const DataTableDropdown: React.FC<DropdownProps> = ({ onRemove }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
        setIsOpen((prevIsOpen) => !prevIsOpen);
    };

    const handleRemove = () => {
        onRemove();
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = ({ target }: { target: EventTarget | null }) => {
            if (
                dropdownRef.current &&
                (!(target instanceof HTMLElement) ||
                    !dropdownRef.current.contains(target as Node))
            ) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="focus:outline-none"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <VerticalEllipsis />
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 top-full mt-2 overflow-hidden rounded border border-gray-300 bg-white shadow"
                    role="menu"
                >
                    <ul className="divide-y divide-gray-200 text-sm">
                        <li>
                            <button
                                onClick={handleRemove}
                                className="block w-full px-6 py-2 text-left font-headings font-bold first:rounded-t last:rounded-b hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                                role="menuitem"
                            >
                                Eliminar
                            </button>
                            <button
                                onClick={handleRemove}
                                className="block w-full px-6 py-2 text-left font-headings font-bold first:rounded-t last:rounded-b hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                                role="menuitem"
                            >
                                Editar
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DataTableDropdown;
