'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { DropdownMenuGroup } from '@radix-ui/react-dropdown-menu';
import {
    ChevronsUpDownIcon,
    ClipboardListIcon,
    ClipboardPenLineIcon,
    ContactIcon,
    CreditCardIcon,
    FileTextIcon,
    LandmarkIcon,
    LayoutDashboardIcon,
    LogOut,
    LucideIcon,
    MapPinIcon,
    Settings,
    ShoppingBagIcon,
    WarehouseIcon,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { PropsWithChildren } from 'react';

import { useOfficeContext } from '@/app/OfficeProvider';
import { useUserContext } from '@/app/UserProvider';

import { buttonVariants } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import { CurrentUser, EmployeeUser, isAdmin } from '../auth/user-utils';

export type DashboardIconProps = {
    isActive: boolean;
};

type NavLink = {
    href: string;
    label?: string;
    Icon: LucideIcon;
    userCanAccess?: (user: CurrentUser) => boolean;
};

const MAIN_LINKS: NavLink[] = [
    { href: '/', label: 'Dashboard', Icon: LayoutDashboardIcon },
    { href: '/productos', label: 'Productos', Icon: ShoppingBagIcon },
    { href: '/clientes', label: 'Clientes', Icon: ContactIcon },
    {
        href: '/empleados',
        label: 'Empleados',
        Icon: LandmarkIcon,
        userCanAccess: (user) => isAdmin(user),
    },
    { href: '/proveedores', label: 'Proveedores', Icon: WarehouseIcon },
    { href: '/localidades', label: 'Localidades', Icon: MapPinIcon },
    { href: '/ventas', label: 'Ventas', Icon: CreditCardIcon },
    {
        href: '/pedidos-a-proveedores',
        label: 'Pedidos a proveedores',
        Icon: ClipboardListIcon,
    },
    { href: '/pedidos-internos', label: 'Pedidos internos', Icon: ClipboardPenLineIcon },
    { href: '/contratos', label: 'Contratos', Icon: FileTextIcon },
];

type NavigationLinkProps = PropsWithChildren<{
    href: string;
    Icon: NavLink['Icon'];
    label?: string;
}>;

/**
 * NavigationLink component.
 * Renders a navigation link that can be highlighted when active.
 *
 * @param {string} href - The path the link should navigate to.
 * @param {React.ReactNode} children - Content to be displayed inside the link.
 */
const NavigationLink: React.FC<NavigationLinkProps> = ({
    children,
    href,
    Icon,
    label,
}) => {
    const currentPath = usePathname();
    const currenLinkIsActive =
        href === '/' ? currentPath === href : currentPath.startsWith(href);
    const variant = currenLinkIsActive ? 'default' : 'ghost';

    return (
        <Link
            href={href}
            className={cn(
                buttonVariants({
                    variant: variant,
                    size: 'sm',
                }),
                variant === 'default' &&
                    'dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white',
                'justify-start',
            )}
        >
            <Icon className="mr-2 h-4 w-4" />
            {children}
            {label && (
                <span
                    className={cn(
                        'ml-auto',
                        variant === 'default' && 'text-background dark:text-white',
                    )}
                >
                    {label}
                </span>
            )}
        </Link>
    );
};

export const DashboardLayoutBigTitle: React.FC<PropsWithChildren> = ({ children }) => {
    return <h1 className="text-2xl font-bold">{children}</h1>;
};

type DashboardLayoutProps = PropsWithChildren<{
    header?: React.ReactNode;
}>;

/**
 * DashboardLayout component.
 * Represents the main dashboard layout structure with a sidebar.
 */
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, header }) => {
    const { user } = useUserContext<EmployeeUser>();
    const { office, resetOffice } = useOfficeContext();

    return (
        <div className="min-h-screen lg:flex">
            <aside className="no-scrollbar flex h-screen w-[300px] flex-col space-y-4 overflow-y-scroll pt-4">
                <header className="pl-container block font-headings text-xl font-black tracking-widest">
                    SENDA
                </header>

                <div className="relative flex flex-1 flex-col">
                    <nav className="pl-container -mx-3 grid gap-2 pr-7">
                        {MAIN_LINKS.filter(
                            (link) => !link.userCanAccess || link.userCanAccess(user),
                        ).map((link) => (
                            <NavigationLink
                                key={link.href}
                                href={link.href}
                                Icon={link.Icon}
                                label={undefined}
                            >
                                {link.label}
                            </NavigationLink>
                        ))}
                    </nav>

                    <div className="pl-container mt-auto border-t border-border">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="w-full space-y-2 rounded py-4 pr-4 duration-200 hover:opacity-70">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border">
                                            {office!.name[0]}
                                        </div>

                                        <div className="flex flex-1 items-center justify-between">
                                            <div className="flex flex-col text-start">
                                                <span className="text-sm">
                                                    {office!.name}
                                                </span>

                                                <span className="text-sm text-muted-foreground">
                                                    {user.email}
                                                </span>
                                            </div>

                                            <ChevronsUpDownIcon className="h-4 w-4" />
                                        </div>
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
                    </div>
                </div>
            </aside>

            <Separator orientation="vertical" className="h-screen" />

            <main className="flex flex-1 flex-col pt-20 lg:h-screen lg:pt-0">
                {header && (
                    <header className="lg:pr-container flex h-[75px] items-center border-b border-gray-300 py-4 lg:px-8">
                        <div className="container w-full lg:mx-0 lg:max-w-full lg:px-0">
                            {header}
                        </div>
                    </header>
                )}

                <div className="flex flex-1 flex-col overflow-y-scroll">{children}</div>
            </main>
        </div>
    );
};

export default DashboardLayout;
