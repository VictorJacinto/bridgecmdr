import { assign, findIndex, iteratee, tap } from "lodash";
import { ReadonlyDeep } from "type-fest";
import { ActionContext, ActionTree,  GetterTree, Module, MutationTree, Store as StoreBase } from "vuex";
import { GetDocument } from "../store";
import Database, { Document, Indices } from "./database";
import Model from "./model";

export interface StateEx<M extends Model> {
    items: ReadonlyDeep<M>[];
    current: ReadonlyDeep<M>|null;
}

export interface ModuleEx<M extends Model, R extends object> extends Module<StateEx<M>, R> {
    readonly namespace: true;
    readonly state: StateEx<M>;
    readonly getters: GetterTree<StateEx<M>, R>;
    readonly mutations: MutationTree<StateEx<M>>;
    readonly actions: ActionTree<StateEx<M>, R>;
}

export type ActionContextEx<M extends Model, R extends object, Doc extends M | Document<object> = M> =
    ActionContext<StateEx<M>, R> & { database: Database<Doc> };

export type ActionHandlerEx<M extends Model, R extends object, Doc extends M | Document<object> = M> =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this: StoreBase<R>, injectee: ActionContextEx<M, R, Doc>, payload?: any) => Promise<any>;

export interface ActionTreeEx<M extends Model, R extends object, Doc extends M | Document<object> = M> {
    [key: string]: ActionHandlerEx<M, R, Doc>;
}

export interface ModuleOptionsEx<M extends Model, R extends object, Doc extends M | Document<object> = M> {
    name: string;
    indices?: Indices[];
    actions?: ActionTreeEx<M, R, Doc>;
}

function replaceItem<M extends Model>(_state: StateEx<M>, item: ReadonlyDeep<M>): void {
    const index = findIndex(_state.items, iteratee({ _id: item._id }));
    if (index !== -1) {
        _state.items[index] = item;
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

        const getters: GetterTree<StateEx<M>, R> = {
            // Nothing right now...
        };

        const mutations: MutationTree<StateEx<M>> = {
            /** Replaces the items in the store, refreshing the data. */
            refresh: (_state, items: ReadonlyDeep<M>[]) => { _state.items = items },

            /** Updates the current item in the store, show the data.  */
            show: (_state, current: ReadonlyDeep<M>) => { _state.current = current },

            /** Appends an item to the store.  */
            append: (_state, item: ReadonlyDeep<M>) => { _state.items.push(item) },

            /** Replaces an item in the store, updating it.  */
            replace: (_state, item: ReadonlyDeep<M>) => { replaceItem(_state, item) },

            /** Deletes an item from the store.  */
            delete: (_state, id: string) => { removeItem(_state, id) },
        };

        const actions: ActionTree<StateEx<M>, R> = {
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
            get: async ({ commit }, id: string) => {
                const connection = await database;

                commit("show", await connection.get(id));
            },

            find: async ({ commit }, selector: PouchDB.Find.FindRequest<M>) => {
                const connection = await database;

                const docs = await connection.query(async function (db) {
                    const response = await db.find({ selector });

                    return response.docs;
                });

                commit("refresh", docs);
            },

            /** Adds a new record to the database. */
            add: async ({ commit }, record: M) => {
                const connection = await database;

                commit("append", await connection.add(record as Doc));
            },

            /** Updates a record in the database. */
            update: async ({ commit }, record: M) => {
                const connection = await database;
                const doc = await connection.get(record._id);

                commit("replace", await connection.update(tap(record as GetDocument<Doc>, value => {
                    value._rev = doc._rev;
                })));
            },

            /** Removes a record from the database. */
            remove: async ({ commit }, id: string) => {
                const connection = await database;

                await connection.remove(id);

                commit("delete", id);
            },
        };

        // Attach any custom actions passing the database in as part of the injectee.
        if (options.actions) {
            for (const [ name, handler ] of Object.entries(options.actions)) {
                actions[name] = async function (this: StoreBase<R>, injectee, payload) {
                    const connection = await database;

                    await handler.call(this, assign(injectee, { database: connection }), payload);
                };
            }
        }

        return {
            namespace: true,
            state,
            getters,
            mutations,
            actions,
        };
    },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ModuleState<M extends Module<any, any>> = M extends Module<infer S, any> ? S : never;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ModuleRootState<M extends Module<any, any>> = M extends Module<any, infer R> ? R : never;

export default Store;
