/* eslint-disable @typescript-eslint/no-explicit-any */

import { assign, findIndex, identity, iteratee, tap } from "lodash";
import { PromiseValue, ReadonlyDeep } from "type-fest";
import { ActionContext,  Module, Store } from "vuex";
import { RootState } from "../../store/root-state";
import Database, { Document, GetDocument, Indices } from "./database";
import Model from "./model";

export interface DataState<M extends Model> {
    items: ReadonlyDeep<M>[];
    current: ReadonlyDeep<M>|null;
}

type Injectee<M extends Model, R extends object> = ActionContext<DataState<M>, R>;

export interface DataModule<M extends Model, R extends object, Empty extends Partial<M>> extends Module<DataState<M>, R> {
    readonly namespaced: true;
    state: DataState<M>;
    readonly getters: {
        empty(): Empty;
    };
    readonly mutations: {
        refresh(state: DataState<M>, items: ReadonlyDeep<M>[]): void;
        show(state: DataState<M>, current: ReadonlyDeep<M>|null): void;
        append(state: DataState<M>, item: ReadonlyDeep<M>): void;
        replace(state: DataState<M>, item: ReadonlyDeep<M>): void;
        delete(state: DataState<M>, id: string): void;
    };
    readonly actions: {
        compact(): Promise<void>;
        all(injectee: Injectee<M, R>): Promise<void>;
        get(injectee: Injectee<M, R>, id: string): Promise<void>;
        find(injectee: Injectee<M, R>, selector: PouchDB.Find.Selector): Promise<void>;
        add(injectee: Injectee<M, R>, record: M): Promise<ReadonlyDeep<M>>;
        update(injectee: Injectee<M, R>, record: M): Promise<ReadonlyDeep<M>>;
        remove(injectee: Injectee<M, R>, id: string): Promise<string>;
    };
}

type ModelDocument<M extends Model> = M | Document<object>;

export type DataActionContext<M extends Model, R extends object, Doc extends ModelDocument<M>> =
    ActionContext<DataState<M>, R> & { database: Database<Doc> };

export type DataActionHandler<M extends Model, R extends object, Doc extends ModelDocument<M>, P = any> =
    (this: Store<R>, injectee: DataActionContext<M, R, Doc>, payload?: any) => Promise<P>;

export type DataActionTree<M extends Model, R extends object, Doc extends ModelDocument<M>, Empty extends Partial<M>> =
    Omit<{
        [K in keyof DataModule<M, R, Empty>["actions"]]?: DataActionHandler<M, R, Doc, PromiseValue<ReturnType<DataModule<M, R, Empty>["actions"][K]>>>;
    }, "compact">;

export interface DataModuleOptions<M extends Model, R extends object, Doc extends ModelDocument<M>, Empty extends Partial<M>> {
    name: string;
    indices?: Indices[];
    empty: () => Empty;
    actions?: DataActionTree<M, R, Doc, Empty>;
}

function replaceItem<M extends Model>(_state: DataState<M>, item: ReadonlyDeep<M>): void {
    const index = findIndex(_state.items, iteratee({ _id: item._id }));
    if (index !== -1) {
        _state.items.splice(index, 1, item);
    }

    // If the current item is also the item being update, replace it as well.
    if (_state.current && _state.current._id === item._id) {
        _state.current = item;
    }
}

function removeItem<M extends Model>(_state: DataState<M>, id: string): void {
    const index = findIndex(_state.items, iteratee({ _id: id }));
    if (index !== -1) {
        _state.items.splice(index, 1);
    }
}

const Module = {
    of<M extends Model, R extends object, Doc extends ModelDocument<M> = M, Empty extends Partial<M> = Partial<M>>(
        options: DataModuleOptions<M, R, Doc, Empty>,
    ): DataModule<M, R, Empty> {
        const database = Database.connect<Doc>(options.name, options.indices || []);
        const state: DataState<M> = {
            items:   [],
            current: null,
        };

        const getters: DataModule<M, R, Empty>["getters"] = {
            empty: options.empty,
        };

        const mutations: DataModule<M, R, Empty>["mutations"] = {
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

        const actions: DataModule<M, R, Empty>["actions"] = {
            /** Compacts the database. */
            compact: async () => {
                const connection = await database;

                await connection.compact();
            },

            /** Gets all records from the database. */
            all: async ({ commit }) => {
                const connection = await database;

                commit("refresh", await connection.all());
            },

            /** Gets the specified record from the database. */
            get: async ({ commit }, id) => {
                const connection = await database;

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
                const result = await connection.add(record as Doc);
                commit("append", result);

                return result as ReadonlyDeep<M>;
            },

            /** Updates a record in the database. */
            update: async ({ commit }, record) => {
                const connection = await database;
                const doc = await connection.get(record._id);
                const result = await connection.update(tap(record as GetDocument<Doc>, value => {
                    value._rev = doc._rev;
                }));

                commit("replace", result);

                return result as ReadonlyDeep<M>;
            },

            /** Removes a record from the database. */
            remove: async ({ commit }, id) => {
                const connection = await database;
                await connection.remove(id);
                commit("delete", id);

                return id;
            },
        };

        const wrapOverride = identity(<H extends DataActionHandler<M, R, Doc>>(overrider: H) =>
            async function (this: Store<R>, injectee: Injectee<M, R>, payload?: unknown) {
                const connection = await database;

                return overrider.call(this, assign(injectee, { database: connection }), payload);
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
                actions.add = wrapOverride(add);
            }

            const update = options.actions.update;
            if (update) {
                actions.update = wrapOverride(update);
            }

            const remove = options.actions.remove;
            if (remove) {
                actions.remove = wrapOverride(remove);
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

export type BaseDataModule<M extends Model> = DataModule<M, RootState, Partial<M>>;

export default Module;
