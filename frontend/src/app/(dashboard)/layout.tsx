import { redirect } from 'next/navigation';

import { getServerSession } from 'next-auth';
import { PropsWithChildren } from 'react';

import { authOptions } from '@/modules/auth/auth';

const DashboardLayout = async ({ children }: PropsWithChildren) => {
    const session = await getServerSession(authOptions);
    console.log('session', session);
    if (!session?.user || session.error) {
        redirect('/login');
    }

    return <>{children}</>;
};

export default DashboardLayout;
