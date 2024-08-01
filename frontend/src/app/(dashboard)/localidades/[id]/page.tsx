'use client';

import { useParams } from 'next/navigation';

import { useLocalityById } from '@/api/hooks';

import DashboardLayout from '@/modules/dashboard/DashboardLayout';
import {
    LocalityFormEditor,
    LocalityFormEditorValues,
} from '@/modules/editors/locality/locality-form-editor';

const Page = () => {
    const { id } = useParams();
    const localityByIdQuery = useLocalityById(id as string);

    if (localityByIdQuery.isPending) {
        return (
            <DashboardLayout>
                <div className="flex h-64 items-center justify-center">
                    <div className="text-2xl font-bold text-gray-500">Cargando...</div>
                </div>
            </DashboardLayout>
        );
    }

    if (localityByIdQuery.isError) {
        return (
            <DashboardLayout>
                <div className="flex h-64 items-center justify-center">
                    <div className="text-2xl font-bold text-gray-500">
                        Error al cargar la localidad
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!localityByIdQuery.data.localityById) {
        return (
            <DashboardLayout>
                <div className="flex h-64 items-center justify-center">
                    <div className="text-2xl font-bold text-gray-500">
                        No se encontró la localidad
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const locality = localityByIdQuery.data.localityById;

    const defaultValues: LocalityFormEditorValues = {
        name: locality.name,
        postalCode: locality.postalCode,
        state: {
            value: locality.state,
            label: locality.state,
        },
    };

    return (
        <DashboardLayout>
            <LocalityFormEditor
                cancelHref={`/localidades/${id}`}
                idToUpdate={id as string}
                defaultValues={defaultValues}
            />
        </DashboardLayout>
    );
};

export default Page;
