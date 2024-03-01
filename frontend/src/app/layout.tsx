/* eslint-disable import/order */
import type { Metadata } from 'next';

import { Poppins, Roboto_Flex } from 'next/font/google';

import { Toaster } from 'react-hot-toast';

import '../styles/globals.scss';
import LayoutReactQuery from './LayoutReactQuery';
import 'react-loading-skeleton/dist/skeleton.css';
import { AuthProvider } from './AuthProvider';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/modules/auth/auth';
import UserProvider from './UserProvider';
import OfficeProvider from './OfficeProvider';

const poppins = Poppins({
    variable: '--font-poppins',
    subsets: ['latin'],
    weight: ['400', '500', '700', '900'],
});

const robotoFlex = Roboto_Flex({
    variable: '--font-roboto-flex',
    subsets: ['latin'],
    weight: ['400', '700'],
});

export const metadata: Metadata = {
    title: 'Senda',
    description: 'Aplicación para senda',
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await getServerSession(authOptions);

    return (
        <html lang="es">
            <body className={`${poppins.variable} ${robotoFlex.variable} font-sans`}>
                <AuthProvider session={session}>
                    <LayoutReactQuery>
                        <UserProvider user={session?.user || null}>
                            <OfficeProvider>{children}</OfficeProvider>
                        </UserProvider>
                    </LayoutReactQuery>
                </AuthProvider>

                <Toaster />
            </body>
        </html>
    );
};

export default RootLayout;
