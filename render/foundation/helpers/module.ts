type EsmModule<T = unknown> = { default: T };

export function defaultOf<T extends EsmModule>(module: T): T["default"] {
    return module.default;
}
