import { tuple, TupleToUnion } from "../helpers/typing";

export const KnownIconsSizes = tuple("is-16x16", "is-24x24", "is-32x32", "is-48x48", "is-64x64", "is-96x96", "is-128x128");
export type KnownIconsSizes = TupleToUnion<typeof KnownIconsSizes>;
