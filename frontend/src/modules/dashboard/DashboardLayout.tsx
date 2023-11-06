'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import clsx from 'clsx';
import { PropsWithChildren, useCallback, useState } from 'react';

import styles from './DashboardLayout.module.scss';
import BagShopping from './Icons/BagShopping';
import ClipBoard from './Icons/ClipBoard';
import ClipBoardList from './Icons/ClipBoardList';
import ClipBoardUser from './Icons/ClipBoardUser';
import Gear from './Icons/Gear';
import House from './Icons/House';
import LocationDot from './Icons/LocationDot';
import User from './Icons/User';

export type DashboardIconProps = {
    isActive: boolean;
};

type NavLink = {
    href: string;
    label: string;
    Icon: React.FC<DashboardIconProps>;
};

const MAIN_LINKS: NavLink[] = [
    { href: '/', label: 'Dashboard', Icon: House },
    { href: '/productos', label: 'Productos', Icon: BagShopping },
    { href: '/clientes', label: 'Clientes', Icon: User },
    { href: '/proveedores', label: 'Proveedores', Icon: ClipBoard },
    { href: '/localidades', label: 'Localidades', Icon: LocationDot },
    {
        href: '/pedidos-a-proveedores',
        label: 'Pedidos a proveedores',
        Icon: ClipBoardList,
    },
    { href: '/pedidos-internos', label: 'Pedidos internos', Icon: ClipBoardUser },
    { href: '/contratos', label: 'Contratos', Icon: () => null },
];

type NavigationLinkProps = PropsWithChildren<{
    href: string;
    Icon: NavLink['Icon'];
}>;

/**
 * NavigationLink component.
 * Renders a navigation link that can be highlighted when active.
 *
 * @param {string} href - The path the link should navigate to.
 * @param {React.ReactNode} children - Content to be displayed inside the link.
 */
const NavigationLink: React.FC<NavigationLinkProps> = ({ children, href, Icon }) => {
    const currentPath = usePathname();
    const currenLinkIsActive =
        href === '/' ? currentPath === href : currentPath.startsWith(href);

    return (
        <Link
            className={clsx(
                'flex items-center space-x-3 rounded p-4',
                currenLinkIsActive
                    ? 'bg-white text-black'
                    : 'transition-colors duration-200 hover:bg-white/10',
            )}
            aria-current={currenLinkIsActive ? 'page' : undefined}
            href={href}
        >
            <Icon isActive={currenLinkIsActive} />
            <span>{children}</span>
        </Link>
    );
};

export const DashboardLayoutBigTitle: React.FC<PropsWithChildren> = ({ children }) => {
    return <h1 className="text-3xl font-bold">{children}</h1>;
};

type DashboardLayoutProps = PropsWithChildren<{
    header: React.ReactNode;
}>;

/**
 * DashboardLayout component.
 * Represents the main dashboard layout structure with a sidebar.
 */
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, header }) => {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);

    return (
        <div className="min-h-screen lg:flex">
            <aside className="lg:pl-container pointer-events-none fixed inset-x-0 flex h-screen flex-col text-white lg:static lg:w-1/5 lg:bg-black lg:pr-6">
                <header className="container pointer-events-auto flex max-h-[5.625rem] min-h-[5.625rem] items-center justify-between border-b border-b-[#444C40] bg-black py-5 lg:static lg:mx-0 lg:max-w-full lg:px-0">
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
                                <NavigationLink href={link.href} Icon={link.Icon}>
                                    {link.label}
                                </NavigationLink>
                            </li>
                        ))}

                        <li className="mt-auto border-t border-white py-5 pt-4">
                            <NavigationLink href="/configuracion" Icon={Gear}>
                                Configuración
                            </NavigationLink>
                        </li>
                    </ul>
                </nav>
            </aside>

            <main className="flex flex-col pt-20 lg:w-4/5 lg:pt-0">
                <header className="lg:pr-container flex h-[5.625rem] items-center border-b border-black py-5 lg:pl-10">
                    <div className="container w-full lg:mx-0 lg:max-w-full lg:px-0">
                        {header}
                    </div>
                </header>

                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
