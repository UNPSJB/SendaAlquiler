type PagePropItem = string | string[] | undefined;

export type PageProps<
    Params extends Record<string, PagePropItem> | unknown = unknown,
    SearchParams extends Record<string, PagePropItem> | unknown = unknown,
> = {
    params: Params;
    searchParams: SearchParams;
};
