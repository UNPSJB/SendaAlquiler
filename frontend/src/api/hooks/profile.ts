import { useMutation } from '@tanstack/react-query';

import {
    SendPasswordRecoveryEmailMutation,
    SendPasswordRecoveryEmailMutationVariables,
    SendPasswordRecoveryEmailDocument,
    ChangePasswordLoggedInDocument,
    ChangePasswordWithTokenDocument,
    ChangePasswordWithTokenMutation,
    ChangePasswordLoggedInMutation,
    ChangePasswordLoggedInMutationVariables,
    ChangePasswordWithTokenMutationVariables,
    UpdateMyBasicInfoDocument,
    UpdateMyBasicInfoMutation,
    UpdateMyBasicInfoMutationVariables,
} from '@/api/graphql';

import { useUserContext } from '@/app/UserProvider';

import fetchClient from '../fetch-client';

export const useSendPasswordRecoveryEmail = () => {
    return useMutation<
        SendPasswordRecoveryEmailMutation,
        Error,
        SendPasswordRecoveryEmailMutationVariables
    >({
        mutationFn: (data) => {
            return fetchClient(SendPasswordRecoveryEmailDocument, data);
        },
    });
};

export const useChangePasswordLoggedIn = () => {
    return useMutation<
        ChangePasswordLoggedInMutation,
        Error,
        ChangePasswordLoggedInMutationVariables
    >({
        mutationFn: (data) => {
            return fetchClient(ChangePasswordLoggedInDocument, data);
        },
    });
};

export const useChangePasswordWithToken = () => {
    return useMutation<
        ChangePasswordWithTokenMutation,
        Error,
        ChangePasswordWithTokenMutationVariables
    >({
        mutationFn: (data) => {
            return fetchClient(ChangePasswordWithTokenDocument, data);
        },
    });
};

export const useUpdateMyBasicInfo = () => {
    const { update } = useUserContext();

    return useMutation<
        UpdateMyBasicInfoMutation,
        Error,
        UpdateMyBasicInfoMutationVariables
    >({
        mutationFn: (data) => {
            return fetchClient(UpdateMyBasicInfoDocument, data);
        },
        onSuccess: (data) => {
            if (data.updateMyBasicInfo?.success) {
                update();
            }
        },
    });
};
