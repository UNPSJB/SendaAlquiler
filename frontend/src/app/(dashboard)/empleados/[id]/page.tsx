'use client';

import { useParams } from 'next/navigation';

import { useState } from 'react';
import toast from 'react-hot-toast';

import { EmployeeByIdQuery } from '@/api/graphql';
import { useEmployeeById } from '@/api/hooks';
import { useSendPasswordRecoveryEmail } from '@/api/hooks/profile';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';
import Tabs from '@/modules/details-page/Tabs';
import ChevronRight from '@/modules/icons/ChevronRight';

import { EmployeeByIdDetailsTab } from './employee-by-id-details';

import Avatar from '@/components/Avatar';
import DeprecatedButton from '@/components/Button';
import ButtonWithSpinner from '@/components/ButtonWithSpinner';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithButton from '@/components/FetchStatusMessageWithButton';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';
import { DashboardLayoutContentLoading } from '@/components/page-loading';

const getAvatarText = (firstName: string, lastName: string) => {
    return (firstName[0] + lastName[0]).toUpperCase();
};

type DasboardTitleProps = {
    employee: EmployeeByIdQuery['employeeById'] | undefined;
};

const DasboardTitle = ({ employee }: DasboardTitleProps) => {
    const recoverPasswordMutation = useSendPasswordRecoveryEmail();

    if (!employee) {
        return <DashboardLayoutBigTitle>Empleados</DashboardLayoutBigTitle>;
    }

    return (
        <div className="flex justify-between">
            <div className="flex items-center space-x-4">
                <DashboardLayoutBigTitle>Empleados</DashboardLayoutBigTitle>
                <ChevronRight />
                <span className="font-headings text-sm">
                    {employee.user.firstName} {employee.user.lastName}
                </span>
            </div>

            <div className="flex space-x-4">
                <ButtonWithSpinner
                    variant="secondary"
                    showSpinner={recoverPasswordMutation.isPending}
                    onClick={() => {
                        recoverPasswordMutation.mutate(
                            {
                                email: employee.user.email,
                            },
                            {
                                onSuccess: (data) => {
                                    if (data.sendPasswordRecoveryEmail?.success) {
                                        toast.success(
                                            'Se ha enviado un correo electrónico al empleado con las instrucciones para recuperar su contraseña.',
                                        );
                                    }

                                    if (data.sendPasswordRecoveryEmail?.error) {
                                        toast.error(data.sendPasswordRecoveryEmail.error);
                                    }
                                },
                                onError: () => {
                                    toast.error(
                                        'Hubo un error al enviar el correo electrónico. Por favor, intenta de nuevo.',
                                    );
                                },
                            },
                        );
                    }}
                >
                    Recuperar contraseña
                </ButtonWithSpinner>

                <DeprecatedButton href={`/empleados/${employee.id}/edit`}>
                    Editar
                </DeprecatedButton>
            </div>
        </div>
    );
};

export type EmployeeByIdTabComponentProps = {
    employee: NonNullable<EmployeeByIdQuery['employeeById']>;
};

const tabs = [
    {
        label: 'Detalles',
        key: 'details',
        Component: EmployeeByIdDetailsTab,
    },
];

const Page = () => {
    const { id } = useParams();
    const useEmployeeByIdResult = useEmployeeById(id as string);

    const [activeTab, setActiveTab] = useState(tabs[0].key);

    const employee = useEmployeeByIdResult.data?.employeeById;
    const Component = tabs.find((tab) => tab.key === activeTab)!.Component;

    return (
        <DashboardLayout header={<DasboardTitle employee={employee} />}>
            <FetchedDataRenderer
                {...useEmployeeByIdResult}
                Loading={<DashboardLayoutContentLoading />}
                Error={
                    <div className="flex w-full flex-1 items-center justify-center">
                        <FetchStatusMessageWithDescription
                            title="Ha ocurrido un error"
                            line1="Hubo un error al cargar el empleado."
                            line2="Prueba de nuevo más tarde."
                        />
                    </div>
                }
            >
                {({ employeeById: employee }) => {
                    if (!employee) {
                        return (
                            <div className="flex w-full flex-1 items-center justify-center">
                                <FetchStatusMessageWithButton
                                    message="Parece que el empleado que buscas no existe."
                                    btnHref="/empleados"
                                    btnText='Volver a "Empleados"'
                                />
                            </div>
                        );
                    }

                    return (
                        <div className="flex  flex-1 flex-col">
                            <header className="border-b pl-8">
                                <div className="mb-10 flex items-center">
                                    <Avatar>
                                        {getAvatarText(
                                            employee.user.firstName,
                                            employee.user.lastName,
                                        )}
                                    </Avatar>

                                    <div className="pl-6">
                                        <h1 className="my-2 mt-10 text-xl font-bold">
                                            {employee.user.firstName}{' '}
                                            {employee.user.lastName}
                                        </h1>
                                        <p>{employee.user.email}</p>
                                    </div>
                                </div>

                                <Tabs
                                    tabs={tabs.map((tab) => {
                                        return {
                                            ...tab,
                                            isActive: tab.key === activeTab,
                                            onClick: setActiveTab,
                                        };
                                    })}
                                />
                            </header>

                            <div className="flex flex-1 bg-gray-100">
                                <section className="pr-container flex w-full flex-1 flex-col pl-8">
                                    <Component employee={employee} />
                                </section>
                            </div>
                        </div>
                    );
                }}
            </FetchedDataRenderer>
        </DashboardLayout>
    );
};

export default Page;
