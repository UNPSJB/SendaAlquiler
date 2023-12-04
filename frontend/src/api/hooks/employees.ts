import {
    UseMutationOptions,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

import usePaginatedQuery from '@/modules/usePaginatedQuery';

import { queryKeys } from './constants';

import { fetchClient } from '../fetch-client';
import {
    EmployeesDocument,
    EmployeeByIdDocument,
    CreateEmployeeMutation,
    CreateEmployeeMutationVariables,
    CreateEmployeeDocument,
    DeleteEmployeeDocument,
    DeleteEmployeeMutation,
} from '../graphql';

export const useEmployees = () => {
    return usePaginatedQuery(
        queryKeys.employeesPaginatedList,
        EmployeesDocument,
        'employees',
        {
            page: 'number',
        },
    );
};

type UseCreateEmployeeOptions = UseMutationOptions<
    CreateEmployeeMutation,
    Error,
    CreateEmployeeMutationVariables
>;

export const useCreateEmployee = ({
    onSuccess,
    ...options
}: UseCreateEmployeeOptions = {}) => {
    const client = useQueryClient();

    return useMutation<CreateEmployeeMutation, Error, CreateEmployeeMutationVariables>(
        (data) => {
            return fetchClient(CreateEmployeeDocument, data);
        },
        {
            onSuccess: (data, context, variables) => {
                if (data.createEmployee?.employee) {
                    client.invalidateQueries(queryKeys.employeesPaginatedList());
                }

                if (onSuccess) {
                    onSuccess(data, context, variables);
                }
            },
            ...options,
        },
    );
};

export const useEmployeeById = (id: string | undefined) => {
    return useQuery(
        queryKeys.employeeDetailsById(id),
        () => {
            return fetchClient(EmployeeByIdDocument, {
                id: id as string,
            });
        },
        {
            enabled: typeof id === 'string',
        },
    );
};

export const useDeleteEmployee = ({
    onSuccess,
    ...options
}: UseMutationOptions<DeleteEmployeeMutation, Error, string> = {}) => {
    const client = useQueryClient();

    return useMutation<DeleteEmployeeMutation, Error, string>(
        (id: string) => {
            return fetchClient(DeleteEmployeeDocument, {
                id,
            });
        },
        {
            onSuccess: (data, variables, context) => {
                client.invalidateQueries(queryKeys.employeesPaginatedList());

                if (onSuccess) {
                    onSuccess(data, variables, context);
                }
            },
            ...options,
        },
    );
};
