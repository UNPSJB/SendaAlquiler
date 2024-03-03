import {
    UseMutationOptions,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

import usePaginatedQuery from '@/modules/usePaginatedQuery';

import { queryDomains, queryKeys } from './constants';

import { fetchClient } from '../fetch-client';
import {
    EmployeesDocument,
    EmployeeByIdDocument,
    CreateEmployeeMutation,
    CreateEmployeeMutationVariables,
    CreateEmployeeDocument,
    DeleteEmployeeDocument,
    DeleteEmployeeMutation,
    UpdateEmployeeDocument,
    UpdateEmployeeMutation,
    UpdateEmployeeMutationVariables,
} from '../graphql';

export const useEmployees = () => {
    return usePaginatedQuery(
        queryKeys.employeesPaginatedList,
        EmployeesDocument,
        'employees',
        {
            query: null,
        },
        {
            page: {
                type: 'int',
            },
            query: {
                type: 'string',
            },
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

    return useMutation<CreateEmployeeMutation, Error, CreateEmployeeMutationVariables>({
        mutationFn: (data) => {
            return fetchClient(CreateEmployeeDocument, data);
        },
        onSuccess: (data, context, variables) => {
            if (data.createEmployee?.employee) {
                client.invalidateQueries({
                    queryKey: [queryDomains.employees],
                    type: 'all',
                    refetchType: 'all',
                });
            }

            if (onSuccess) {
                onSuccess(data, context, variables);
            }
        },
        ...options,
    });
};

export const useEmployeeById = (id: string | undefined) => {
    return useQuery({
        queryKey: queryKeys.employeeDetailsById(id),
        queryFn: () => {
            return fetchClient(EmployeeByIdDocument, {
                id: id as string,
            });
        },
        enabled: typeof id === 'string',
    });
};

export const useDeleteEmployee = ({
    onSuccess,
    ...options
}: UseMutationOptions<DeleteEmployeeMutation, Error, string> = {}) => {
    const client = useQueryClient();

    return useMutation<DeleteEmployeeMutation, Error, string>({
        mutationFn: (id: string) => {
            return fetchClient(DeleteEmployeeDocument, {
                id,
            });
        },
        onSuccess: (data, variables, context) => {
            client.invalidateQueries({
                queryKey: [queryDomains.employees],
                type: 'all',
                refetchType: 'all',
            });

            if (onSuccess) {
                onSuccess(data, variables, context);
            }
        },
        ...options,
    });
};

type UseUpdateEmployeeOptions = UseMutationOptions<
    UpdateEmployeeMutation,
    Error,
    UpdateEmployeeMutationVariables
>;

export const useUpdateEmployee = ({
    onSuccess,
    ...options
}: UseUpdateEmployeeOptions = {}) => {
    const client = useQueryClient();

    return useMutation<UpdateEmployeeMutation, Error, UpdateEmployeeMutationVariables>({
        mutationFn: (data) => {
            return fetchClient(UpdateEmployeeDocument, data);
        },
        onSuccess: (data, context, variables) => {
            if (data.updateEmployee?.employee) {
                client.invalidateQueries({
                    queryKey: queryKeys.employeesPaginatedList(),
                });
            }

            if (onSuccess) {
                onSuccess(data, context, variables);
            }
        },
        ...options,
    });
};
