export type ElementType<A extends readonly unknown[]> = A extends (infer E)[] ? E : never;
