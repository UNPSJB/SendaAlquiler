'use client';

import { useParams } from 'next/navigation';

import { useState } from 'react';

import { ContractByIdQuery } from '@/api/graphql';
import { useContractById } from '@/api/hooks';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';
import Tabs from '@/modules/details-page/Tabs';
import ChevronRight from '@/modules/icons/ChevronRight';
