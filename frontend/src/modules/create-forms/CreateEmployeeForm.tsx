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

import { CreateEmployeeMutationVariables } from '@/api/graphql';
import { useCreateEmployee } from '@/api/hooks';