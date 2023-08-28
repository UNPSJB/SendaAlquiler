import './globals.css';
import type { Metadata } from 'next';
import { Poppins, Roboto_Flex } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import ReactQueryWrapper from './ReactQueryWrapper';

const poppins = Poppins({
    variable: '--font-poppins',
    subsets: ['latin'],
    weight: ['400', '700', '900'],
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es">
            <body className={`${poppins.variable} ${robotoFlex.variable} font-sans`}>
                <ReactQueryWrapper>{children}</ReactQueryWrapper>

                <Toaster />
            </body>
        </html>
    );
}
