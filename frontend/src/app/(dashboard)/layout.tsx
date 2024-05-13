import { redirect } from 'next/navigation';

import { getServerSession } from 'next-auth';
import { PropsWithChildren } from 'react';

import { authOptions } from '@/modules/auth/auth';

import OfficeProvider from '../OfficeProvider';

const DashboardLayout = async ({ children }: PropsWithChildren) => {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.error) {
        redirect('/login');
    }

    return <OfficeProvider>{children}</OfficeProvider>;
};

export default DashboardLayout;
