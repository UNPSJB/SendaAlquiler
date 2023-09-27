'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import clsx from 'clsx';
import { PropsWithChildren, useCallback, useState } from 'react';

import styles from './DashboardLayout.module.scss';

type NavLink = {
    href: string;
    label: string;
};

const MAIN_LINKS: NavLink[] = [
    { href: '/', label: 'Dashboard' },
    { href: '/productos', label: 'Productos' },
    { href: '/clientes', label: 'Clientes' },
    { href: '/proveedores', label: 'Proveedores' },
    { href: '/localidad', label: 'Localidad' },
];

type NavigationLinkProps = PropsWithChildren<{
    href: string;
}>;

/**
 * NavigationLink component.
 * Renders a navigation link that can be highlighted when active.
 *
 * @param {string} href - The path the link should navigate to.
 * @param {React.ReactNode} children - Content to be displayed inside the link.
 */
const NavigationLink: React.FC<NavigationLinkProps> = ({ children, href }) => {
    const currentPath = usePathname();
    const isActive = href === '/' ? currentPath === href : currentPath.startsWith(href);

    return (
        <Link
            className={clsx(
                'flex items-center space-x-2 rounded p-4',
                isActive
                    ? 'bg-white text-black'
                    : 'transition-colors duration-200 hover:bg-white hover:bg-opacity-10',
            )}
            aria-current={isActive ? 'page' : undefined}
            href={href}
        >
            <span className="block h-6 w-6 rounded bg-gray-200"></span>
            <span>{children}</span>
        </Link>
    );
};

type DashboardLayoutProps = PropsWithChildren<{
    title: string;
}>;

/**
 * DashboardLayout component.
 * Represents the main dashboard layout structure with a sidebar.
 */
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);

    return (
        <div className="min-h-screen lg:flex">
            <aside className="lg:pl-container pointer-events-none fixed inset-x-0 flex h-screen flex-col text-white lg:static lg:w-1/5 lg:bg-black lg:pr-6">
                <header className="container pointer-events-auto flex items-center justify-between border-b border-b-[#444C40] bg-black py-5 lg:static lg:mx-0 lg:block lg:max-w-full lg:px-0">
                    <span className="block font-headings text-3xl font-black tracking-widest">
                        SENDA
                    </span>

                    <button
                        onClick={toggleMenu}
                        className={clsx(styles.burger, isMenuOpen && styles.activated)}
                        aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </header>

                <nav className="relative flex flex-1 flex-col">
                    <ul
                        className={clsx(
                            'container pointer-events-auto absolute flex h-full flex-col bg-black py-6 font-headings text-sm transition-all duration-200 lg:static lg:mx-0 lg:max-w-full lg:px-0',
                            isMenuOpen ? 'inset-0' : '-left-full right-full',
                        )}
                    >
                        {MAIN_LINKS.map((link) => (
                            <li className="pb-4" key={link.href}>
                                <NavigationLink href={link.href}>
                                    {link.label}
                                </NavigationLink>
                            </li>
                        ))}

                        <li className="mt-auto border-t border-white py-5 pt-4">
                            <NavigationLink href="/configuracion">
                                Configuración
                            </NavigationLink>
                        </li>
                    </ul>
                </nav>
            </aside>

            <main className="lg:pr-container pt-20 lg:w-4/5 lg:pt-0">
                <header className="border-b border-black py-5 lg:pl-10">
                    <div className="container lg:mx-0 lg:max-w-full lg:px-0">
                        <h1 className="text-3xl font-bold">{title}</h1>
                    </div>
                </header>

                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
