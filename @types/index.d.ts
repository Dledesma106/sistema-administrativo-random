declare namespace NodeJS {
    interface ProcessEnv {
        NEXT_PUBLIC_API_HOST: string;
    }
}

type ArrayElement<ArrayType extends readonly unknown[]> =
    ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

/** Make readonly object writable */
type Writable<T> = { -readonly [P in keyof T]: T[P] };

/** Like Writable but recursive */
type DeepWritable<T> = T extends Record<string, any>
    ? { -readonly [K in keyof T]: DeepWritable<T[K]> }
    : T;
