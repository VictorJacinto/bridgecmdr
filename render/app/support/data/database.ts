import { isNil } from "lodash";
import PouchDB from "pouchdb-browser";
import Find from "pouchdb-find";
import { v4 as uuid } from "uuid";

type IndexFields  = string[];
type IndexList    = IndexFields[];
type NamedIndices = Record<string, IndexFields>;

export type Indices             = IndexList|NamedIndices;
export type ExistingDocument<T> = PouchDB.Core.ExistingDocument<T & PouchDB.Core.AllDocsMeta>;
export type GetDocument<T>      = PouchDB.Core.Document<T> & PouchDB.Core.GetMeta;
export type Document<T>         = PouchDB.Core.Document<T>;

// Install the find plug-in.
PouchDB.plugin(Find);

export default class Database<Doc> {
    private readonly handle: PouchDB.Database<Doc>;

    private constructor(name: string) {
        this.handle = new PouchDB<Doc>(name);
    }

    /**
     * Connects to a named database.
     */
    static async connect<NewDoc>(name: string, indicesBlocks: Indices[]): Promise<Database<NewDoc>> {
        const database = new Database<NewDoc>(name);

        const waits = [] as Promise<void>[];
        for (const indices of indicesBlocks) {
            if (indices instanceof Array) {
                for (const fields of indices) {
                    waits.push(database.handle.createIndex({ index: { fields } }).then(() => undefined));
                }
            } else {
                for (const [ key, fields ] of Object.entries(indices)) {
                    waits.push(database.handle.createIndex({ index: { fields, name: key } }).then(() => undefined));
                }
            }
        }

        await Promise.all(waits);

        return database;
    }

    /**
     * Compacts the database.
     */
    compact(): Promise<void> {
        return this.handle.compact().then(() => undefined);
    }

    /**
     * Provides a means to tap into the database interface directly.
     */
    query<Result>(callback: (db: PouchDB.Database<Doc>) => Promise<Result>): Promise<Result> {
        return callback(this.handle);
    }

    /**
     * Gets all document from the database.
     */
    async all(): Promise<ExistingDocument<Doc>[]> {
        const response = await this.handle.allDocs({
            include_docs: true,
            attachments:  true,
            binary:       true,
            // Since we use GUIDs, the first character will be between these values.
            startkey:     "0",
            endkey:       "Z",
        });

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return response.rows.filter(row => !isNil(row.doc)).map(row => row.doc!);
    }

    /**
     * Gets the specified document from the database.
     */
    get(id: string, attachments = true): Promise<GetDocument<Doc>> {
        return this.handle.get<Doc>(id, attachments ? {
            attachments: true,
            binary:      true,
        } : {});
    }

    /**
     * Adds a document to the database.
     */
    async add(doc: Document<Doc>, ...attachments: File[]): Promise<GetDocument<Doc>> {
        doc._id = uuid().toUpperCase();

        await this.handle.put(doc);
        if (attachments.length > 0) {
            await this.addAttachments(doc._id, attachments);
        }

        return this.get(doc._id);
    }

    /**
     * Updates an existing document in the database.
     */
    async update(doc: GetDocument<Doc>, ...attachments: File[]): Promise<GetDocument<Doc>> {
        const id  = doc._id;
        await this.handle.put(doc);
        if (attachments.length > 0) {
            await this.addAttachments(id, attachments);
        }

        return this.get(id);
    }

    /**
     * Removes a document from the database.
     */
    async remove(id: string): Promise<void> {
        const doc = await this.get(id, false);
        await this.handle.remove(doc);
    }

    /**
     * Adds attachments to a document.
     */
    protected async addAttachments(id: string, attachments: File[]): Promise<void> {
        // Add each attachment one-at-a-time, this must be serial.
        for (const attachment of attachments) {
            // eslint-disable-next-line no-await-in-loop
            const doc = await this.get(id, false);
            // eslint-disable-next-line no-await-in-loop
            await this.handle.putAttachment(id, attachment.name, doc._rev, attachment, attachment.type);
        }
    }
}