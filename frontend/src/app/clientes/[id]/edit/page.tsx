'use client';

import { useParams } from 'next/navigation';

import { useClientById } from '@/api/hooks';

import DashboardLayout from '@/modules/dashboard/DashboardLayout';
import { CustomerFormEditor } from '@/modules/editors/customer/customer-form-editor';

import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithButton from '@/components/FetchStatusMessageWithButton';
import Spinner from '@/components/Spinner/Spinner';

const Page = () => {
    const { id } = useParams();
    const clientByIdQuery = useClientById(id as string);

    return (
        <DashboardLayout>
            <FetchedDataRenderer
                {...clientByIdQuery}
                Error={
                    <FetchStatusMessageWithButton
                        message="Hubo un error al cargar el empleado"
                        btnText="Volver a intentar"
                        btnHref={`/empleados/${id}`}
                    />
                }
                Loading={
                    <div className="flex w-full flex-1 items-center justify-center">
                        <Spinner />
                    </div>
                }
            >
                {({ clientById }) => {
                    if (!clientById) {
                        return (
                            <FetchStatusMessageWithButton
                                message="Parece que el empleado que buscas no existe."
                                btnHref="/empleados"
                                btnText='Volver a "Empleados"'
                            />
                        );
                    }

                    return (
                        <CustomerFormEditor
                            cancelHref={`/empleados/${id}`}
                            defaultValues={{
                                dni: clientById.dni,
                                email: clientById.email,
                                firstName: clientById.firstName,
                                houseNumber: clientById.houseNumber,
                                houseUnit: clientById.houseUnit,
                                lastName: clientById.lastName,
                                phoneCode: clientById.phoneCode,
                                phoneNumber: clientById.phoneNumber,
                                streetName: clientById.streetName,
                                locality: {
                                    value: clientById.locality.id,
                                    label: clientById.locality.name,
                                },
                            }}
                            idToUpdate={id as string}
                        />
                    );
                }}
            </FetchedDataRenderer>
        </DashboardLayout>
    );
};

export default Page;
