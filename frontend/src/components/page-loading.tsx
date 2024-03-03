import Spinner from './Spinner/Spinner';

export const PageLoading = () => {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <Spinner className="border-b-primary" />
        </div>
    );
};

export const DashboardLayoutContentLoading = () => {
    return (
        <div className="pr-container flex w-full flex-1 items-center justify-center pl-8">
            <Spinner className="border-b-primary" />
        </div>
    );
};
