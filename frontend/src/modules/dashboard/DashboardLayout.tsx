'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { DropdownMenuGroup } from '@radix-ui/react-dropdown-menu';
import clsx from 'clsx';
import { ChevronUp, LogOut, Settings, User } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { PropsWithChildren, useCallback, useState } from 'react';

import { useOfficeContext } from '@/app/OfficeProvider';
import { useUserContext } from '@/app/UserProvider';

import styles from './DashboardLayout.module.scss';
import BagShoppingIcon from './Icons/BagShopping';
import ClipBoardIcon from './Icons/ClipBoard';
import ClipBoardList from './Icons/ClipBoardList';
import ClipBoardUserIcon from './Icons/ClipBoardUser';
import FileLinesIcon from './Icons/FileLines';
import HouseIcon from './Icons/House';
import LocationDotIcon from './Icons/LocationDot';
import MoneyCheckDollarIcon from './Icons/MoneyCheckDollar';
import UserIcon from './Icons/User';
import UserTieIcon from './Icons/UserTie';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { CurrentUser, EmployeeUser, isAdmin } from '../auth/user-utils';

export type DashboardIconProps = {
    isActive: boolean;
};

type NavLink = {
    href: string;
    label: string;
    Icon: React.FC<DashboardIconProps>;
    userCanAccess?: (user: CurrentUser) => boolean;
};

const MAIN_LINKS: NavLink[] = [
    { href: '/', label: 'Dashboard', Icon: HouseIcon },
    { href: '/productos', label: 'Productos', Icon: BagShoppingIcon },
    { href: '/clientes', label: 'Clientes', Icon: UserIcon },
    {
        href: '/empleados',
        label: 'Empleados',
        Icon: UserTieIcon,
        userCanAccess: (user) => isAdmin(user),
    },
    { href: '/proveedores', label: 'Proveedores', Icon: ClipBoardIcon },
    { href: '/localidades', label: 'Localidades', Icon: LocationDotIcon },
    { href: '/ventas', label: 'Ventas', Icon: MoneyCheckDollarIcon },
    {
        href: '/pedidos-a-proveedores',
        label: 'Pedidos a proveedores',
        Icon: ClipBoardList,
    },
    { href: '/pedidos-internos', label: 'Pedidos internos', Icon: ClipBoardUserIcon },
    { href: '/contratos', label: 'Contratos', Icon: FileLinesIcon },
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

    const { user } = useUserContext<EmployeeUser>();

    const { office, resetOffice } = useOfficeContext();

    return (
        <div className="min-h-screen lg:flex">
            <aside className="lg:pl-container pointer-events-none fixed inset-x-0 flex h-screen flex-col overflow-y-scroll text-white lg:static lg:w-1/5 lg:bg-black lg:pr-6">
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
                        {MAIN_LINKS.filter(
                            (link) => !link.userCanAccess || link.userCanAccess(user),
                        ).map((link) => (
                            <li className="pb-4" key={link.href}>
                                <NavigationLink href={link.href} Icon={link.Icon}>
                                    {link.label}
                                </NavigationLink>
                            </li>
                        ))}

                        <li className="mt-auto border-t border-white pt-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="w-full rounded border border-white/20 p-3 text-white duration-200 hover:opacity-70">
                                        <div className="mb-2.5 flex">
                                            <User className="mr-2 h-4 w-4" />
                                            <span>{user.email}</span>

                                            <ChevronUp className="ml-auto h-4 w-4" />
                                        </div>

                                        <div className="flex w-full">
                                            <span className="text-xs text-white/50">
                                                {office
                                                    ? office.name
                                                    : 'Sin sucursal asignada'}
                                            </span>
                                        </div>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-56">
                                    <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem onClick={resetOffice}>
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Cambiar de sucursal</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem
                                        onClick={() => {
                                            signOut({
                                                callbackUrl: '/login',
                                            });
                                        }}
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Cerrar sesión</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </li>
                    </ul>
                </nav>
            </aside>

            <main className="flex flex-col pt-20 lg:h-screen lg:w-4/5 lg:pt-0">
                <header className="lg:pr-container flex h-[5.625rem] items-center border-b border-black py-5 lg:pl-10">
                    <div className="container w-full lg:mx-0 lg:max-w-full lg:px-0">
                        {header}
                    </div>
                </header>

                <div className="flex flex-1 flex-col overflow-y-scroll">{children}</div>
            </main>
        </div>
    );
};

export default DashboardLayout;
