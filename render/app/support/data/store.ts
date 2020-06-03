import { assign, findIndex, identity, iteratee, tap } from "lodash";
import { ReadonlyDeep } from "type-fest";
import { ActionContext,  Module, Store as StoreBase } from "vuex";
import Database, { Document, GetDocument, Indices } from "./database";
import Model from "./model";

export interface StateEx<M extends Model> {
    items: ReadonlyDeep<M>[];
    current: ReadonlyDeep<M>|null;
}

type Injectee<M extends Model, R extends object> = ActionContext<StateEx<M>, R>;

export interface ModuleEx<M extends Model, R extends object> extends Module<StateEx<M>, R> {
    readonly namespaced: true;
    state: StateEx<M>;
    readonly getters: {
        empty(): Partial<M>;
    };
    readonly mutations: {
        refresh(state: StateEx<M>, items: ReadonlyDeep<M>[]): void;
        show(state: StateEx<M>, current: ReadonlyDeep<M>|null): void;
        append(state: StateEx<M>, item: ReadonlyDeep<M>): void;
        replace(state: StateEx<M>, item: ReadonlyDeep<M>): void;
        delete(state: StateEx<M>, id: string): void;
    };
    readonly actions: {
        compact(): Promise<void>;
        all(injectee: Injectee<M, R>): Promise<void>;
        get(injectee: Injectee<M, R>, id: string): Promise<void>;
        find(injectee: Injectee<M, R>, selector: PouchDB.Find.FindRequest<M>): Promise<void>;
        add(injectee: Injectee<M, R>, record: M): Promise<void>;
        update(injectee: Injectee<M, R>, record: M): Promise<void>;
        remove(injectee: Injectee<M, R>, id: string): Promise<void>;
    };
}

export type ActionContextEx<M extends Model, R extends object, Doc extends M | Document<object> = M> =
    ActionContext<StateEx<M>, R> & { database: Database<Doc> };

export type ActionHandlerEx<M extends Model, R extends object, Doc extends M | Document<object> = M> =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this: StoreBase<R>, injectee: ActionContextEx<M, R, Doc>, payload?: any) => Promise<any>;

export type ActionTreeEx<M extends Model, R extends object, Doc extends M | Document<object> = M> = Omit<{
    [K in keyof ModuleEx<M, R>["actions"]]?: ActionHandlerEx<M, R, Doc>;
}, "compact">;

export interface ModuleOptionsEx<M extends Model, R extends object, Doc extends M | Document<object> = M> {
    name: string;
    indices?: Indices[];
    empty: () => Partial<M>;
    actions?: ActionTreeEx<M, R, Doc>;
}

function replaceItem<M extends Model>(_state: StateEx<M>, item: ReadonlyDeep<M>): void {
    const index = findIndex(_state.items, iteratee({ _id: item._id }));
    if (index !== -1) {
        _state.items.splice(index, 1, item);
    }
}

function removeItem<M extends Model>(_state: StateEx<M>, id: string): void {
    const index = findIndex(_state.items, iteratee({ _id: id }));
    if (index !== -1) {
        _state.items.splice(index, 1);
    }
}

const Store = {
    of<M extends Model, R extends object, Doc extends M | Document<object> = M>(options: ModuleOptionsEx<M, R, Doc>): ModuleEx<M, R> {
        const database = Database.connect<Doc>(options.name, options.indices || []);
        const state: StateEx<M> = {
            items:   [],
            current: null,
        };

        const getters: ModuleEx<M, R>["getters"] = {
            empty: options.empty,
        };

        const mutations: ModuleEx<M, R>["mutations"] = {
            /** Replaces the items in the store, refreshing the data. */
            refresh: (_state, items) => { _state.items = items },

            /** Updates the current item in the store, show the data.  */
            show: (_state, current) => { _state.current = current },

            /** Appends an item to the store.  */
            append: (_state, item) => { _state.items.push(item) },

            /** Replaces an item in the store, updating it.  */
            replace: (_state, item) => { replaceItem(_state, item) },

            /** Deletes an item from the store.  */
            delete: (_state, id) => { removeItem(_state, id) },
        };

        const actions: ModuleEx<M, R>["actions"] = {
            /** Compacts the database. */
            compact: async () => {
                const connection = await database;

                await connection.compact();
            },

            /** Gets all records from the database. */
            all: async ({ commit }) => {
                const connection = await database;

                commit("refresh", []);
                commit("refresh", await connection.all());
            },

            /** Gets the specified record from the database. */
            get: async ({ commit }, id) => {
                const connection = await database;

                commit("show", null);
                commit("show", await connection.get(id));
            },

            find: async ({ commit }, selector) => {
                const connection = await database;

                commit("refresh", []);
                const docs = await connection.query(async function (db) {
                    const response = await db.find({ selector });

                    return response.docs;
                });

                commit("refresh", docs);
            },

            /** Adds a new record to the database. */
            add: async ({ commit }, record) => {
                const connection = await database;

                commit("append", await connection.add(record as Doc));
            },

            /** Updates a record in the database. */
            update: async ({ commit }, record) => {
                const connection = await database;
                const doc = await connection.get(record._id);

                commit("replace", await connection.update(tap(record as GetDocument<Doc>, value => {
                    value._rev = doc._rev;
                })));
            },

            /** Removes a record from the database. */
            remove: async ({ commit }, id) => {
                const connection = await database;

                await connection.remove(id);

                commit("delete", id);
            },
        };

        const wrapOverride = identity(<H extends ActionHandlerEx<M, R, Doc>>(overrider: H) =>
            async function (this: StoreBase<R>, injectee: Injectee<M, R>, payload?: unknown) {
                const connection = await database;

                await overrider.call(this, assign(injectee, { database: connection }), payload);
            },
        );

        // Attach any custom actions passing the database in as part of the injectee.
        if (options.actions) {
            const all = options.actions.all;
            if (all) {
                actions.all = wrapOverride(all);
            }

            const get = options.actions.get;
            if (get) {
                actions.get = wrapOverride(get);
            }

            const find = options.actions.find;
            if (find) {
                actions.find = wrapOverride(find);
            }

            const add = options.actions.add;
            if (add) {
                actions.find = wrapOverride(add);
            }

            const update = options.actions.update;
            if (update) {
                actions.find = wrapOverride(update);
            }

            const remove = options.actions.remove;
            if (remove) {
                actions.find = wrapOverride(remove);
            }
        }

        return {
            namespaced: true,
            state,
            getters,
            mutations,
            actions,
        };
    },
};

export default Store;
