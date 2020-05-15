/*
BridgeCmdr - A/V switch and monitor controller
Copyright (C) 2019-2020 Matthew Holder

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

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

export default class Database<Doc extends object> {
    private readonly handle: PouchDB.Database<Doc>;

    private constructor(name: string) {
        this.handle = new PouchDB<Doc>(name);
    }

    /**
     * Connects to a named database.
     */
    public static async connect<Doc extends object>(name: string, indicesBlocks: Indices[]): Promise<Database<Doc>> {
        const database = new Database<Doc>(name);

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
    public compact(): Promise<void> {
        return this.handle.compact().then(() => undefined);
    }

    /**
     * Provides a means to tap into the database interface directly.
     */
    public query<Result>(callback: (db: PouchDB.Database<Doc>) => Promise<Result>): Promise<Result> {
        return callback(this.handle);
    }

    /**
     * Gets all document from the database.
     */
    public async all(): Promise<ExistingDocument<Doc>[]> {
        const response = await this.handle.allDocs({
            // eslint-disable-next-line @typescript-eslint/camelcase
            include_docs: true,
            attachments:  true,
            binary:       true,
            // Since we use GUIDs, the first character will be between these values.
            startkey:     "0",
            endkey:       "Z",
        });

        return response.rows.map(row => row.doc as ExistingDocument<Doc>);
    }

    /**
     * Gets the specified document from the database.
     */
    public get(id: string, attachments = true): Promise<GetDocument<Doc>> {
        return this.handle.get<Doc>(id, attachments ? {
            attachments: true,
            binary:      true,
        } : {});
    }

    /**
     * Adds a document to the database.
     */
    public async add(doc: Document<Doc>, ...attachments: File[]): Promise<GetDocument<Doc>> {
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
    public async update(doc: GetDocument<Doc>, ...attachments: File[]): Promise<GetDocument<Doc>> {
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
    public async remove(id: string): Promise<void> {
        // TODO: ow validation

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
