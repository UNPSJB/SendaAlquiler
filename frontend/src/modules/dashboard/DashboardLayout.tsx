'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { DropdownMenuGroup } from '@radix-ui/react-dropdown-menu';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { useQuery } from '@tanstack/react-query';
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
    UserIcon,
    WarehouseIcon,
    ClipboardPlus,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import fetchClient from '@/api/fetch-client';
import { NumberOfPendingOutgoingInternalOrdersDocument } from '@/api/graphql';
import { useChangePasswordLoggedIn, useUpdateMyBasicInfo } from '@/api/hooks/profile';

import { useOfficeContext } from '@/app/OfficeProvider';
import { useUserContext } from '@/app/UserProvider';

import ButtonWithSpinner from '@/components/ButtonWithSpinner';
import { buttonVariants } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

import { CurrentUser, EmployeeUser, isAdmin } from '../auth/user-utils';

export type DashboardIconProps = {
    isActive: boolean;
};

type NavLink = {
    href: string | null;
    label?: string;
    Icon: LucideIcon;
    innerLinks?: {
        href: string;
        title: string;
        label?: string;
    }[];
    userCanAccess?: (user: CurrentUser) => boolean;
};

const MAIN_LINKS: NavLink[] = [
    { href: '/', label: 'Dashboard', Icon: LayoutDashboardIcon },
    { href: '/reportes', label: 'Reportes', Icon: ClipboardPlus },
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
    {
        href: null,
        label: 'Pedidos internos',
        Icon: ClipboardPenLineIcon,
        innerLinks: [
            {
                href: '/pedidos-internos/entrantes',
                title: 'Entrantes',
            },
            {
                href: '/pedidos-internos/salientes',
                title: 'Salientes',
            },
        ],
    },
    { href: '/contratos', label: 'Contratos', Icon: FileTextIcon },
];

type NavigationLinkProps = PropsWithChildren<{
    href: string | null;
    Icon: NavLink['Icon'];
    label?: string;
    innerLinks?: NavLink['innerLinks'];
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
    innerLinks,
}) => {
    const currentPath = usePathname();
    const currenLinkIsActive =
        href && (href === '/' ? currentPath === href : currentPath.startsWith(href));
    const variant = currenLinkIsActive ? 'default' : 'ghost';

    if (href === null) {
        return (
            <div className="space-y-1">
                <span
                    className={cn(
                        buttonVariants({
                            variant: variant,
                            size: 'sm',
                        }),
                        'pointer-events-none flex justify-start',
                    )}
                >
                    <Icon className="mr-2 size-4" />
                    {children}
                    {label && (
                        <span
                            className={cn(
                                'ml-auto',
                                variant === 'default' &&
                                    'text-background dark:text-white',
                            )}
                        >
                            {label}
                        </span>
                    )}
                </span>

                <div className="flex flex-col space-y-2 pl-6">
                    {innerLinks?.map((innerLinkItem) => {
                        const currenLinkIsActive =
                            innerLinkItem.href === '/'
                                ? currentPath === innerLinkItem.href
                                : currentPath.startsWith(innerLinkItem.href);

                        const variant = currenLinkIsActive ? 'default' : 'ghost';

                        return (
                            <Link
                                key={innerLinkItem.href}
                                href={innerLinkItem.href}
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
                                {innerLinkItem.title}

                                {innerLinkItem.label && (
                                    <span
                                        className={cn(
                                            'ml-auto',
                                            variant === 'default' &&
                                                'text-background dark:text-white',
                                        )}
                                    >
                                        {innerLinkItem.label}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        );
    }

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
            <Icon className="mr-2 size-4" />
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

type BasicInfoFormValues = Partial<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}>;

const BasicInfoForm: React.FC = () => {
    const { user } = useUserContext<EmployeeUser>();
    const formMethods = useForm<BasicInfoFormValues>({
        defaultValues: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        },
    });

    const updateInfoMutation = useUpdateMyBasicInfo();

    const onSubmit = (values: BasicInfoFormValues) => {
        if (!values.firstName || !values.lastName || !values.email) {
            return;
        }

        updateInfoMutation.mutate(
            {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
            },
            {
                onSuccess: (data) => {
                    if (data.updateMyBasicInfo?.error) {
                        toast.error(data.updateMyBasicInfo.error);
                    }

                    if (data.updateMyBasicInfo?.success) {
                        toast.success('Información actualizada con éxito');
                    }
                },
                onError: () => {
                    toast.error('Hubo un error al actualizar la información');
                },
            },
        );
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <DialogTitle>Información básica</DialogTitle>
                <DialogDescription>
                    Aquí podrás ver y editar tu información personal.
                </DialogDescription>
            </div>

            <Form {...formMethods}>
                <form
                    className="flex flex-col space-y-4"
                    onSubmit={formMethods.handleSubmit(onSubmit)}
                >
                    <FormField
                        name="firstName"
                        control={formMethods.control}
                        rules={{ required: 'Este campo es requerido' }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel required>Nombre</FormLabel>

                                <Input {...field} value={field.value || ''} />

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="lastName"
                        control={formMethods.control}
                        rules={{ required: 'Este campo es requerido' }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel required>Apellido</FormLabel>

                                <Input {...field} value={field.value || ''} />

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="email"
                        control={formMethods.control}
                        rules={{ required: 'Este campo es requerido' }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel required>Email</FormLabel>

                                <Input {...field} value={field.value || ''} />

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <DialogFooter>
                        <ButtonWithSpinner
                            showSpinner={updateInfoMutation.isPending}
                            type="submit"
                        >
                            Guardar cambios
                        </ButtonWithSpinner>
                    </DialogFooter>
                </form>
            </Form>
        </div>
    );
};

type PasswordFormValues = Partial<{
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}>;

const PasswordForm: React.FC = () => {
    const formMethods = useForm<PasswordFormValues>();
    const { watch: formWatch, trigger: formTrigger } = formMethods;
    const changePasswordMutation = useChangePasswordLoggedIn();

    const onSubmit = (values: PasswordFormValues) => {
        if (!values.currentPassword || !values.newPassword || !values.confirmPassword) {
            return;
        }

        changePasswordMutation.mutate(
            {
                oldPassword: values.currentPassword,
                newPassword: values.newPassword,
            },
            {
                onSuccess: (data) => {
                    if (
                        data.changePasswordLoggedIn?.error ===
                        'La contraseña actual es incorrecta'
                    ) {
                        formMethods.setError('currentPassword', {
                            type: 'manual',
                            message: 'La contraseña actual es incorrecta',
                        });
                    }

                    if (data.changePasswordLoggedIn?.success) {
                        toast.success('Contraseña cambiada con éxito');
                        formMethods.reset();
                    }
                },
                onError: () => {
                    toast.error('Hubo un error al cambiar la contraseña');
                },
            },
        );
    };

    useEffect(() => {
        const subscription = formWatch((values, { name, type }) => {
            if (type !== 'change') return;

            if (
                (name === 'newPassword' || name === 'confirmPassword') &&
                values.newPassword &&
                values.confirmPassword
            ) {
                formTrigger('confirmPassword');
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [formWatch, formTrigger]);

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <DialogTitle>Cambiar contraseña</DialogTitle>
                <DialogDescription>Aquí podrás cambiar tu contraseña.</DialogDescription>
            </div>

            <Form {...formMethods}>
                <form
                    className="flex flex-col space-y-4"
                    onSubmit={formMethods.handleSubmit(onSubmit)}
                >
                    <FormField
                        name="currentPassword"
                        control={formMethods.control}
                        rules={{ required: 'Este campo es requerido' }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel required>Contraseña actual</FormLabel>

                                <Input
                                    {...field}
                                    value={field.value || ''}
                                    type="password"
                                />

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Separator />

                    <FormField
                        name="newPassword"
                        control={formMethods.control}
                        rules={{
                            required: 'Este campo es requerido',
                            validate: (value) => {
                                if (value && value.length < 8) {
                                    return 'La contraseña debe tener al menos 8 caracteres';
                                }
                            },
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel required>Nueva contraseña</FormLabel>

                                <Input
                                    {...field}
                                    value={field.value || ''}
                                    type="password"
                                />

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="confirmPassword"
                        control={formMethods.control}
                        rules={{
                            required: 'Este campo es requerido',
                            validate: (value) => {
                                if (value !== formMethods.watch('newPassword')) {
                                    return 'Las contraseñas no coinciden';
                                }
                            },
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel required>Confirmar contraseña</FormLabel>

                                <Input
                                    {...field}
                                    value={field.value || ''}
                                    type="password"
                                />

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <DialogFooter>
                        <ButtonWithSpinner
                            showSpinner={changePasswordMutation.isPending}
                            type="submit"
                        >
                            Cambiar contraseña
                        </ButtonWithSpinner>
                    </DialogFooter>
                </form>
            </Form>
        </div>
    );
};

enum TabValue {
    BasicInfo = 'basicInfo',
    Password = 'password',
}

/**
 * DashboardLayout component.
 * Represents the main dashboard layout structure with a sidebar.
 */
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, header }) => {
    const { user } = useUserContext<EmployeeUser>();
    const { office, resetOffice } = useOfficeContext();
    const internalOrdersQuery = useQuery({
        queryKey: ['NumberOfPendingOutgoingInternalOrdersDocument'],
        queryFn: () => {
            return fetchClient(NumberOfPendingOutgoingInternalOrdersDocument, {});
        },
    });

    const [currentTab, setCurrentTab] = useState<TabValue>(TabValue.BasicInfo);

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
                                innerLinks={link.innerLinks?.map((innerLink) => ({
                                    href: innerLink.href,
                                    title: innerLink.title,
                                    label:
                                        innerLink.href === '/pedidos-internos/salientes'
                                            ? (internalOrdersQuery.data
                                                  ?.numberOfPendingOutgoingInternalOrders
                                                  ? `(${internalOrdersQuery.data.numberOfPendingOutgoingInternalOrders} pendientes)`
                                                  : '') || undefined
                                            : undefined,
                                }))}
                            >
                                {link.label}
                            </NavigationLink>
                        ))}
                    </nav>

                    <div className="pl-container mt-auto border-t border-border">
                        <Dialog>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="w-full space-y-2 rounded py-4 pr-4 duration-200 hover:opacity-70">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex size-9 items-center justify-center rounded-full border border-border">
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

                                                <ChevronsUpDownIcon className="size-4" />
                                            </div>
                                        </div>
                                    </button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="start" className="w-56">
                                    <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem onClick={resetOffice}>
                                            <Settings className="mr-2 size-4" />
                                            <span>Cambiar de sucursal</span>
                                        </DropdownMenuItem>

                                        <DialogTrigger asChild>
                                            <DropdownMenuItem>
                                                <UserIcon className="mr-2 size-4" />
                                                <span>Mi perfil</span>
                                            </DropdownMenuItem>
                                        </DialogTrigger>
                                    </DropdownMenuGroup>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem
                                        onClick={() => {
                                            signOut({
                                                callbackUrl: '/login',
                                            });
                                        }}
                                    >
                                        <LogOut className="mr-2 size-4" />
                                        <span>Cerrar sesión</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DialogContent className="w-7/12 max-w-full p-0">
                                <Tabs
                                    value={currentTab}
                                    onValueChange={(value) =>
                                        setCurrentTab(value as TabValue)
                                    }
                                >
                                    <div className="flex">
                                        <div className="min-h-[75vh] w-[220px] space-y-4 border-r border-border bg-gray-200 p-6">
                                            <div>
                                                <h2 className="font-bold">Mi cuenta</h2>

                                                <p className="text-sm text-muted-foreground">
                                                    Administra tu información personal
                                                </p>
                                            </div>

                                            <TabsPrimitive.List className="space-y-2">
                                                <TabsPrimitive.Trigger
                                                    className="w-full"
                                                    value={TabValue.BasicInfo}
                                                >
                                                    <button
                                                        className={cn(
                                                            'w-full rounded px-3 py-2 text-left text-sm',
                                                            currentTab ===
                                                                TabValue.BasicInfo
                                                                ? 'bg-gray-300 font-medium text-violet-600'
                                                                : 'text-muted-foreground',
                                                        )}
                                                    >
                                                        Información básica
                                                    </button>
                                                </TabsPrimitive.Trigger>

                                                <TabsPrimitive.Trigger
                                                    className="w-full"
                                                    value={TabValue.Password}
                                                >
                                                    <button
                                                        className={cn(
                                                            'w-full rounded px-3 py-2 text-left text-sm',
                                                            currentTab ===
                                                                TabValue.Password
                                                                ? 'bg-gray-300 font-medium text-violet-600'
                                                                : 'text-muted-foreground',
                                                        )}
                                                    >
                                                        Cambiar contraseña
                                                    </button>
                                                </TabsPrimitive.Trigger>
                                            </TabsPrimitive.List>
                                        </div>

                                        <div className="flex-1 p-6">
                                            <TabsContent value={TabValue.BasicInfo}>
                                                <BasicInfoForm />
                                            </TabsContent>

                                            <TabsContent value={TabValue.Password}>
                                                <PasswordForm />
                                            </TabsContent>
                                        </div>
                                    </div>
                                </Tabs>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </aside>

            <Separator orientation="vertical" className="h-screen" />

            <main className="flex flex-1 flex-col pt-20 lg:h-screen lg:pt-0">
                {header && (
                    <header className="lg:pr-container flex h-[75px] items-center border-b border-border py-4 lg:px-8">
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
