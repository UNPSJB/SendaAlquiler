'use client';

import { usePathname } from 'next/navigation';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { signOut } from 'next-auth/react';
import { PropsWithChildren, createContext, useContext } from 'react';
import toast from 'react-hot-toast';

import { OFFICE_COOKIE_QUERY_KEY } from '@/api/server-action-constants';
import { gettOfficeCookieAction, setOfficeCookieAction } from '@/api/server-actions';

import { EmployeeUser } from '@/modules/auth/user-utils';

import { useUserContext } from './UserProvider';

import Button from '@/components/Button';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';
import Spinner from '@/components/Spinner/Spinner';

type Office = EmployeeUser['employee']['offices'][0]['office'];

type OfficeProviderData = {
    office: string | null;
};

const OfficeContext = createContext<OfficeProviderData>({
    office: null,
});

const useOfficeCookie = () => {
    return useQuery(OFFICE_COOKIE_QUERY_KEY, {
        queryFn: async () => {
            const res = await gettOfficeCookieAction();
            return res;
        },
    });
};

const useSetOfficeCookie = () => {
    return useMutation(async (id: string) => {
        await setOfficeCookieAction(id);
        return true;
    });
};

const OfficeProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const pathname = usePathname();
    const { user } = useUserContext<EmployeeUser | null>();

    const client = useQueryClient();
    const { data: selectedOffice, isLoading } = useOfficeCookie();
    const { mutate } = useSetOfficeCookie();

    const offices = user?.employee.offices.map(({ office }) => office);

    const handleSetSelectedOffice = (office: Office) => {
        mutate(office.id, {
            onSuccess: () => {
                client.setQueryData(OFFICE_COOKIE_QUERY_KEY, office.id);
            },
            onError: () => {
                toast.error('No se pudo seleccionar la oficina');
            },
        });
    };

    if (pathname === '/login' || selectedOffice) {
        return (
            <OfficeContext.Provider
                value={{
                    office: selectedOffice ?? null,
                }}
            >
                {children}
            </OfficeContext.Provider>
        );
    }

    if (!offices || offices.length === 0) {
        return (
            <FetchStatusMessageWithDescription
                title="No tienes oficinas asignadas"
                line1="Contacta con tu administrador para que te asigne una oficina"
            />
        );
    }

    if (isLoading) {
        return (
            <main className="flex h-screen items-center justify-center">
                <Spinner className="border-b-black" />
            </main>
        );
    }

    return (
        <OfficeContext.Provider
            value={{
                office: null,
            }}
        >
            <main className="flex min-h-screen items-center">
                <header className="absolute top-0 w-full py-8">
                    <div className="container flex items-center justify-end space-x-4">
                        <span>{user?.email}</span>
                        <Button
                            onClick={() => {
                                signOut();
                            }}
                        >
                            Cerrar sesión
                        </Button>
                    </div>
                </header>

                <div className="container">
                    <h1 className="mb-8 text-center text-3xl font-bold">
                        Selecciona una sucursal
                    </h1>
                    <div className="container flex w-full flex-wrap justify-center">
                        <div className="flex w-full justify-center space-x-8">
                            {offices?.map((office) => (
                                <button
                                    key={office.id}
                                    className="w-4/12 rounded-md border-2 border-black p-4 py-8 font-bold transition duration-200 hover:bg-black hover:text-white"
                                    onClick={() => handleSetSelectedOffice(office)}
                                >
                                    <p>{office.name}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </OfficeContext.Provider>
    );
};

export const useOfficeContext = () => {
    const context = useContext(OfficeContext);

    if (context === undefined) {
        throw new Error('useOfficeContext must be used within a OfficeProvider');
    }

    return context;
};

export default OfficeProvider;
