// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FetchedDataRendererProps<T extends any> = {
    isLoading: boolean;
    isError: boolean;
    data: T;
    Loading: React.ReactElement;
    Error: React.ReactElement | null;
    children: (data: NonNullable<T>) => React.ReactElement;
};

const FetchedDataRenderer = <T extends any>({
    isLoading,
    isError,
    data,
    Loading,
    Error,
    children,
}: FetchedDataRendererProps<T>): React.ReactElement | null => {
    if (isLoading) {
        return Loading;
    }

    if (isError) {
        return Error;
    }

    if (data) {
        return children(data);
    }

    return null;
};

export default FetchedDataRenderer;
