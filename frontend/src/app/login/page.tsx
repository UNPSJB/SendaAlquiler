import { redirect } from 'next/navigation';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/modules/auth/auth';

import { LoginPage } from './page-content';

const Page = async () => {
    const session = await getServerSession(authOptions);
    let shouldSignOut = false;
    console.log('session', session);
    if (!session?.user || session.error) {
        shouldSignOut = true;
    }

    if (!shouldSignOut) {
        redirect('/');
    }

    return <LoginPage shouldSignOut={shouldSignOut} />;
};

export default Page;
