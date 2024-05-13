'use client';

import { useParams } from 'next/navigation';

import { useSupplierById } from '@/api/hooks';

import DashboardLayout from '@/modules/dashboard/DashboardLayout';
import { SupplierFormEditor } from '@/modules/editors/supplier/supplier-form-editor';

const Page = () => {
    const { id } = useParams();
    const supplierByIdQuery = useSupplierById(id as string);

    if (supplierByIdQuery.isPending) {
        return (
            <DashboardLayout>
                <div className="flex h-64 items-center justify-center">
                    <div className="text-2xl font-bold text-gray-500">Cargando...</div>
                </div>
            </DashboardLayout>
        );
    }

    if (supplierByIdQuery.isError) {
        return (
            <DashboardLayout>
                <div className="flex h-64 items-center justify-center">
                    <div className="text-2xl font-bold text-gray-500">
                        Error al cargar el proveedor
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!supplierByIdQuery.data.supplierById) {
        return (
            <DashboardLayout>
                <div className="flex h-64 items-center justify-center">
                    <div className="text-2xl font-bold text-gray-500">
                        No se encontró el proveedor
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const product = supplierByIdQuery.data.supplierById;

    return (
        <DashboardLayout>
            <SupplierFormEditor
                cancelHref={`/productos/${id}`}
                idToUpdate={id as string}
                defaultValues={{
                    locality: {
                        value: product.locality.id,
                        label: product.locality.name,
                    },
                    cuit: product.cuit,
                    email: product.email,
                    name: product.name,
                    phoneCode: product.phoneCode,
                    phoneNumber: product.phoneNumber,
                    streetName: product.streetName,
                    houseNumber: product.houseNumber,
                    houseUnit: product.houseUnit,
                    note: product.note,
                }}
            />
        </DashboardLayout>
    );
};

export default Page;
