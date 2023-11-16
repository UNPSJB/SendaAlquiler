'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import clsx from 'clsx';
import { useState } from 'react';
import {
    FormProvider,
    FormState,
    SubmitHandler,
    UseFormRegister,
    useForm,
} from 'react-hook-form';
import toast from 'react-hot-toast';

import { CreatePurchaseVariables} from '@/api/graphql';
import { useCreatePurchase } from '@/api/hooks';

import BrandField from '@/modules/create-forms/fields/BrandField';
import { RHFFormField } from '@/modules/forms/FormField';
import Input from '@/modules/forms/Input';

import NavigationButtons, { NavigationButtonsCancelProps } from './NavigationButtons';

type FormValues = CreatePurchaseVariables['']  // TODO

type FieldsComponentProps = {
    formErrors: FormState<FormValues>['errors'];
    register: UseFormRegister<FormValues>;
};

const PurchaseDataStep: React.FC<FieldsComponentProps> = ({ formErrors, register }) => (
    <>
    <RHFFormField className="flex-1" fieldID="" label="" showRequired>
        <Input
            id="sku"
            placeholder="XYZ12345"
            hasError={!!formErrors.sku}
            {...register('sku', { required: true })}
        />
    </RHFFormField>

    <RHFFormField className="flex-1" fieldID="name" label="Nombre" showRequired>
        <Input
            id="name"
            placeholder="Lavandina"
            hasError={!!formErrors.name}
            {...register('name', { required: true })}
        />
    </RHFFormField>

    <RHFFormField
        className="flex-1"
        fieldID="description"
        label="Descripcion"
        showRequired
    >
        <Input
            id="description"
            placeholder="Descripción"
            hasError={!!formErrors.description}
            {...register('description', { required: true })}
        />
    </RHFFormField>

    <RHFFormField fieldID="brand" label="Marca" showRequired>
        <BrandField />
    </RHFFormField>

    <RHFFormField className="flex-1" fieldID="type" label="Tipo" showRequired>
        <ProductTypeField />
    </RHFFormField>

    <RHFFormField fieldID="price" label="Precio" showRequired>
        <Input
            type="price"
            id="price"
            placeholder="0.00"
            hasError={!!formErrors.price}
            {...register('price', {
                required: true,
                // maxLength: 7, // 1 million
                // minLength: 1,
                // max: 1000000,
                // min: 1,
            })}
        />
    </RHFFormField>
</>
);