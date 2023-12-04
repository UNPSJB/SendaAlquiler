import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import { fetchClient } from '../fetch-client';
import {
    LoginDocument,
    LoginMutation,
    LoginMutationVariables,
    SetSessionOfficeCookieDocument,
    SetSessionOfficeCookieMutation,
} from '../graphql';

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
        return fetchClient(LoginDocument, data);
    }, options);
};

type UseSetSessionOfficeCookieOptions = UseMutationOptions<
    SetSessionOfficeCookieMutation,
    Error,
    string
>;

export const useSetSessionOfficeCookie = (
    options: UseSetSessionOfficeCookieOptions = {},
) => {
    return useMutation<SetSessionOfficeCookieMutation, Error, string>((id: string) => {
        return fetchClient(SetSessionOfficeCookieDocument, {
            officeId: id,
            clearCookie: false,
        });
    }, options);
};
