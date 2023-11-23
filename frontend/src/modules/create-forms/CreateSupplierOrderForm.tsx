'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
    FormProvider,
    SubmitErrorHandler,
    SubmitHandler,
    useForm,
} from 'react-hook-form';
import toast from 'react-hot-toast';
