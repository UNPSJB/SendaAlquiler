import { redirect } from 'next/navigation';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/modules/auth/auth';

import OfficeProvider from './OfficeProvider';
import Home from './page-content';

const DashboardLayout = async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.error) {
        redirect('/login');
    }

    return (
        <OfficeProvider>
            <Home />
        </OfficeProvider>
    );
};

export default DashboardLayout;
