import { getServerSession } from 'next-auth';

import { authOptions } from '@/modules/auth/auth';

import { LoginPage } from './page-content';

const Page = async () => {
    const res = await getServerSession(authOptions);
    return <LoginPage shouldSignOut={!!res?.error} />;
};

export default Page;
