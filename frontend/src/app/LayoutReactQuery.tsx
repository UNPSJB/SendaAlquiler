'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
//import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

type Props = {
    children: React.ReactNode;
};

const LayoutReactQuery = ({ children }: Props) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
// <ReactQueryDevtools initialIsOpen={false} />

export default LayoutReactQuery;
