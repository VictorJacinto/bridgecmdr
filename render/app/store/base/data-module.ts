import { findIndex, iteratee, tap } from "lodash";
import type { RegisterOptions } from "../../../foundation/support/vuex";
import { Action, Mutation, StoreModule } from "../../../foundation/support/vuex";
import Database from "../../support/data/database";
import type { Indices, GetDocument } from "../../support/data/database";
import type Model from "../../support/data/model";
import type { RevisionId } from "../../support/data/model";

export const DATABASE = Symbol.for("@@Database");
export const OPTIONS = Symbol.for("@@Options");

export interface DataModuleOptions<M extends Model, Empty extends Partial<M>> {
    name: string;
    namespace?: string;
    indices?: Indices[];
    empty: () => Empty;
    term: () => string;
}

export type DocumentArgs<Doc extends Model> = [ Doc, ...File[] ];

export type ModelType<D extends DataModule<Model>> =
    D extends DataModule<infer M> ? M : never;

export default class DataModule<M extends Model, Doc extends Model = M, Empty extends Partial<M> = Partial<M>> extends StoreModule {
    [DATABASE]: Promise<Database<Doc>>;
    [OPTIONS]: DataModuleOptions<M, Empty>;

    items = [] as M[];

    current = null as M|null;

    get empty(): Empty {
        return this[OPTIONS].empty();
    }

    get term(): string {
        return this[OPTIONS].term();
    }

    constructor(register: RegisterOptions, options: DataModuleOptions<M, Empty>) {
        super(register);
        this[DATABASE] = Database.connect<Doc>(options.name, options.indices || []);
        this[OPTIONS] = options;
    }

    @Mutation
    /** Replaces the items in the store, refreshing the data. */
    refresh(items: M[]): void {
        this.items = items;
    }

    @Mutation
    /** Updates the current item in the store, show the data.  */
    show(current: M): void {
        this.current = current;
    }

    @Mutation
    /** Appends an item to the store.  */
    append(item: M): void {
        this.items.push(item);
    }

    @Mutation
    /** Replaces an item in the store, updating it.  */
    replace(item: M): void {
        this.replaceItem(item);
    }

    @Mutation
    /** Deletes an item from the store.  */
    delete(id: string): void {
        this.removeItem(id);
    }

    @Action
    async compact(): Promise<void> {
        const connection = await this[DATABASE];

        await connection.compact();
    }

    @Action
    async all(): Promise<void> {
        const connection = await this[DATABASE];

        this.refresh(this.toManyModels(await connection.all()));
    }

    @Action
    async get(id: string): Promise<void> {
        const connection = await this[DATABASE];

        this.show(this.toModel(await connection.get(id)));
    }

    @Action
    async find(selector: PouchDB.Find.Selector): Promise<void> {
        const connection = await this[DATABASE];

        this.refresh([]);
        const docs = await connection.query(async function (db) {
            const response = await db.find({ selector });

            return response.docs;
        });

        this.refresh(this.toManyModels(docs));
    }

    @Action
    async add(record: M): Promise<M> {
        const connection = await this[DATABASE];
        const result = this.toModel(await connection.add(...this.toDocument(record)));
        this.append(result);

        return result;
    }

    @Action
    async update(record: M): Promise<M> {
        const connection = await this[DATABASE];
        const doc = await connection.get(record._id);

        const result = this.toModel(
            await connection.update(...this.toDocument(record, doc._rev)),
        );

        this.replace(result);

        return result;
    }

    @Action
    async remove(id: string): Promise<string> {
        const connection = await this[DATABASE];
        await connection.remove(id);
        this.delete(id);

        return id;
    }

    private toManyModels(docs: Doc[]): M[] {
        const models = [] as M[];
        docs.forEach(doc => {
            try {
                models.push(this.toModel(doc));
            } catch (error: unknown) {
                // TODO: Remove botched records?
                console.error(error);
            }
        });

        return models;
    }

    // eslint-disable-next-line class-methods-use-this
    protected toModel(doc: Doc): M {
        return doc as Model as M;
    }

    protected toDocument(model: M): DocumentArgs<Doc>;
    protected toDocument(model: M, rev: RevisionId): DocumentArgs<GetDocument<Doc>>
    // eslint-disable-next-line class-methods-use-this
    protected toDocument(model: M, rev?: RevisionId): DocumentArgs<Doc> {
        return [tap(model, value => { value._rev = rev }) as Model as Doc];
    }

    protected replaceItem(item: M): void {
        const index = findIndex(this.items, iteratee({ _id: item._id }));
        if (index !== -1) {
            this.items.splice(index, 1, item);
        }

        // If the current item is also the item being update, replace it as well.
        if (this.current && this.current._id === item._id) {
            this.current = item;
        }
    }

    protected removeItem(id: string): void {
        const index = findIndex(this.items, iteratee({ _id: id }));
        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }
}
