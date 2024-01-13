import { CurrentUserQuery } from '@/api/graphql';

export type CurrentUser = NonNullable<CurrentUserQuery['user']>;

type BuildUserType<T extends keyof CurrentUser> = Omit<CurrentUser, T> & {
    [k in T]: NonNullable<CurrentUser[T]>;
};

export type EmployeeUser = BuildUserType<'employee'>;
export type AdminUser = BuildUserType<'admin'>;

export const isEmployee = (user: CurrentUser): user is EmployeeUser => !!user.employee;

export const isAdmin = (user: CurrentUser): user is AdminUser => !!user.admin;
