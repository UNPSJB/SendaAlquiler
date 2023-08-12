declare namespace NodeJS {
    interface ProcessEnv {
        NEXT_PUBLIC_API_HOST: string;
        NEXT_PUBLIC_MEDIA_URL: string;
    }
}

type ArrayElement<ArrayType extends readonly unknown[]> =
    ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
