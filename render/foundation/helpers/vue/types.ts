// import validate from "../validation/valid";
// import {is, maybe} from "../../validation/valid";

type StyleClassObjectSyntax = Record<string, boolean>;
type StyleClassArraySyntax  = (undefined|string|StyleClassObjectSyntax)[];

export type StyleClassMap = string|StyleClassArraySyntax|StyleClassObjectSyntax|undefined;

// TODO: Implement `recordOf` so this may be used.
// const styleClassObjectSyntaxShape = is.object.recordOf(is.boolean);
// const styleClassArraySyntaxShape = is.array.ofType(maybe(is.string, styleClassObjectSyntaxShape));
// export const styleClassMapShape = maybe(is.string, styleClassArraySyntaxShape, styleClassObjectSyntaxShape);
