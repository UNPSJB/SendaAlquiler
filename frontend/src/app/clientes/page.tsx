'use client';

import { PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import DashboardLayout from '@/modules/dashboard/DashboardLayout';
import { RHFFormField } from '@/modules/forms/FormField';
import Input from '@/modules/forms/Input';

import Button, { ButtonVariant } from '@/components/Button';

const TD: React.FC<PropsWithChildren<unknown>> = ({ children }) => {
    return (
        <td className="px-10 py-4 first:pl-0 last:pr-0 group-even:bg-gray-100">
            {children}
        </td>
    );
};

const TR: React.FC<PropsWithChildren<unknown>> = ({ children }) => {
    return <tr className="group">{children}</tr>;
};

const Page = () => {
    const useFormMethods = useForm();
    const { register } = useFormMethods;

    return (
        <DashboardLayout title="Clientes">
            <div className="pr-container py-5 pl-10">
                <div className="mb-4">
                    <FormProvider {...useFormMethods}>
                        <RHFFormField fieldID="email" label="Busca un cliente">
                            <Input
                                id="query"
                                type="search"
                                placeholder="Nombre, email, telefono, etc"
                                {...register('query')}
                            />
                        </RHFFormField>
                    </FormProvider>
                </div>

                <table className="mb-8 w-full">
                    <thead>
                        <tr>
                            <th className="px-10 py-2.5 text-left first:pl-0 last:pr-0">
                                Nombre
                            </th>
                            <th className="px-10 py-2.5 text-left first:pl-0 last:pr-0">
                                E-Mail
                            </th>
                            <th className="px-10 py-2.5 text-left first:pl-0 last:pr-0">
                                Celular
                            </th>
                            <th className="px-10 py-2.5 text-left first:pl-0 last:pr-0">
                                Domicilio
                            </th>
                            <th className="px-10 py-2.5 text-left first:pl-0 last:pr-0">
                                Localidad
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...new Array(10)].map((client, index) => (
                            <TR key={index}>
                                <TD>-----</TD>
                                <TD>-----</TD>
                                <TD>-----</TD>
                                <TD>-----</TD>
                                <TD>-----</TD>
                            </TR>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-between">
                    <Button variant={ButtonVariant.OUTLINE_WHITE}>{'<-'} Anterior</Button>
                    <Button variant={ButtonVariant.OUTLINE_WHITE}>
                        Siguiente {'->'}
                    </Button>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Page;
