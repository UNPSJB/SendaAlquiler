import { UseMutationOptions, useMutation, useQuery } from '@tanstack/react-query';

import {
    ClientsDocument,
    LoginDocument,
    LoginMutation,
    LoginMutationVariables,
} from './graphql';
import { clientGraphqlQuery } from './graphqlclient';

/**
 * Type definition for the options when using the login hook.
 */
type UseLoginOptions = UseMutationOptions<LoginMutation, Error, LoginMutationVariables>;

/**
 * Custom hook to execute the login mutation.
 *
 * @param options - Options for the mutation.
 * @returns The result object from the useMutation hook.
 */
export const useLogin = (options: UseLoginOptions = {}) => {
    return useMutation<LoginMutation, Error, LoginMutationVariables>((data) => {
        return clientGraphqlQuery(LoginDocument, data);
    }, options);
};

export const useClients = () => {
    return useQuery(['clients'], () => {
        return clientGraphqlQuery(ClientsDocument, {});
    });
};
