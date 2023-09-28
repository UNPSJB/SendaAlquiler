'use client';

import { PropsWithChildren, useState, useRef, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';

import { Client } from '@/api/graphql';
import { useClients } from '@/api/hooks';

import DashboardLayout from '@/modules/dashboard/DashboardLayout';
import ArrowLeft from '@/modules/icons/ArrowLeft';
import ArrowRigth from '@/modules/icons/ArrowRight';
import VerticalEllipsis from '@/modules/icons/VerticalEllipsis';

import Button, { ButtonVariant } from '@/components/Button';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';
import { TD, TH, TR, Table } from '@/components/Table';

const ClientSkeleton = () => {
    return (
        <TR>
            {[...new Array(6)].map((_, i) => (
                <TD key={i}>
                    <Skeleton width={100}></Skeleton>
                </TD>
            ))}
        </TR>
    );
};

const ClientsTable = ({ children }: PropsWithChildren) => {
    return (
        <Table>
            <thead>
                <tr>
                    <TH>Nombre</TH>
                    <TH>Correo</TH>
                    <TH>Celular</TH>
                    <TH>Domicilio</TH>
                    <TH>Localidad</TH>
                    <TH></TH>
                </tr>
            </thead>
            <tbody>{children}</tbody>
        </Table>
    );
};

interface DropdownProps {
    onRemove: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({ onRemove }) => {
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
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

type PaginationProps = {
    onPrevious: () => void;
    onNext: () => void;
};

const Pagination: React.FC<PaginationProps> = ({ onPrevious, onNext }) => (
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

const Page = () => {
    const useClientsResult = useClients();

    const handlePrevious = () => {
        console.log('previous');
    };

    const handleNext = () => {
        console.log('next');
    };

    const handleRemove = (id: Client['id']) => {
        console.log(`remove ${id}`);
    };

    return (
        <DashboardLayout title="Clientes">
            <FetchedDataRenderer
                {...useClientsResult}
                Loading={
                    <div className="pr-container flex-1 py-5 pl-10">
                        <ClientsTable>
                            <ClientSkeleton />
                            <ClientSkeleton />
                            <ClientSkeleton />
                            <ClientSkeleton />
                            <ClientSkeleton />
                        </ClientsTable>
                    </div>
                }
                Error={
                    <div className="flex w-full flex-1 items-center justify-center">
                        <FetchStatusMessageWithDescription
                            title="Ha ocurrido un error"
                            line1="Hubo un error al cargar los clientes."
                            line2="Prueba de nuevo más tarde."
                        />
                    </div>
                }
            >
                {({ clients }) => {
                    return (
                        <div className="pr-container flex-1 py-5 pl-10">
                            <ClientsTable>
                                {clients.map((client) => (
                                    <TR key={client.id}>
                                        <TD>
                                            {client.user.firstName} {client.user.lastName}
                                        </TD>
                                        <TD>{client.user.email}</TD>
                                        <TD>
                                            {client.phoneCode}
                                            {client.phoneNumber}
                                        </TD>
                                        <TD>
                                            {client.streetName} {client.houseNumber}
                                        </TD>
                                        <TD>{client.locality.name}</TD>
                                        <TD>
                                            <Dropdown
                                                onRemove={() => handleRemove(client.id)}
                                            />
                                        </TD>
                                    </TR>
                                ))}
                            </ClientsTable>

                            <Pagination onPrevious={handlePrevious} onNext={handleNext} />
                        </div>
                    );
                }}
            </FetchedDataRenderer>
        </DashboardLayout>
    );
};

export default Page;
