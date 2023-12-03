import { CurrentUserQuery } from '@/api/graphql';

export type CurrentUser = NonNullable<CurrentUserQuery['user']>;

type BuildUserType<T extends keyof CurrentUser> = Omit<CurrentUser, T> & {
    [k in T]: NonNullable<CurrentUser[T]>;
};

export type EmployeeUser = BuildUserType<'employee'>;

export const isEmployee = (user: CurrentUser): user is EmployeeUser =>
    !!user.employee?.offices;
