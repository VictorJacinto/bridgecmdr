import type { StoreModuleClass, StoreModuleInterface } from "./details";
import { IS_PROXY } from "./details";
import type { ModuleOptions, RegisterOptions } from "./options";
import { StoreProxyFactory } from "./proxy-factory";
import type { StoreModule } from "./store-modules";

function isConstructor(arg: unknown): arg is StoreModuleClass {
    return typeof arg === "function";
}

type StoreModuleConstructor = new (options: RegisterOptions) => StoreModule;

function moduleDecorator(moduleOptions?: ModuleOptions): ClassDecorator {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return <C extends Function>(constructor: C): C => {
        const accessor = function (registerOptions: RegisterOptions, ...args: unknown[]): StoreModuleInterface {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
            const instance = new constructor.prototype.constructor(registerOptions, ...args) as StoreModuleInterface;
            Object.setPrototypeOf(instance, accessor.prototype);

            const factory = new StoreProxyFactory(
                constructor as unknown as StoreModuleClass,
                instance,
                moduleOptions || {},
                registerOptions,
            );

            return factory.makePublicProxy();
        };

        Object.defineProperties(accessor, {
            name: {
                configurable: true,
                enumerable:   false,
                writable:     false,
                value:        `${constructor.name}Accessor`,
            },
            prototype: {
                configurable: false,
                enumerable:   false,
                writable:     false,
                value:        Object.create(constructor.prototype, {
                    constructor: {
                        configurable: true,
                        enumerable:   false,
                        writable:     true,
                        value:        constructor,
                    },
                }) as unknown,
            },
        });

        Object.defineProperty(accessor, IS_PROXY, {
            configurable: false,
            enumerable:   false,
            writable:     false,
            value:        true,
        });

        return accessor as unknown as C;
    };
}

export function Module<C extends StoreModuleConstructor>(constructor: C): C;
export function Module(options?: ModuleOptions): ClassDecorator;
export function Module(arg?: ModuleOptions|StoreModuleConstructor): ClassDecorator|StoreModuleConstructor {
    return isConstructor(arg) ?
        moduleDecorator()(arg) as StoreModuleConstructor :
        moduleDecorator(arg as ModuleOptions);
}
