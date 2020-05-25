import { isNil, tap } from "lodash";
import { ModuleState } from "../../../foundation/helpers/vuex";
import { Document, ExistingDocument } from "../../support/data/database";
import Model from "../../support/data/model";
import Store from "../../support/data/store";
import { RootState } from "../root-state";

export interface Source extends Model {
    title: string;
    image: File;
}

type SourceDocument = Document<{
    title: string;
    image: string;
}>;

const translate = {
    one(doc: ExistingDocument<SourceDocument>): null|Source {
        if (!isNil(doc._attachments) && !isNil(doc._attachments[doc.image])) {
            const attachment = doc._attachments[doc.image] as PouchDB.Core.FullAttachment;
            if (!isNil(attachment.data)) {
                return {
                    _id:   doc._id,
                    title: doc.title,
                    image: new File([attachment.data as Blob], doc.image, { type: attachment.content_type }),
                };
            }
        }

        return null;
    },
    many(docs: ExistingDocument<SourceDocument>[]): Source[] {
        const records = [] as Source[];
        for (const doc of docs) {
            const record = translate.one(doc);
            if (record) {
                records.push(record);
            }
        }

        return records;
    },
};

const sources = Store.of<Source, RootState, SourceDocument>({
    name:  "sources",
    empty: () => ({
        _id:   null,
        image: null,
        title: "",
    }),
    actions: {
        all: async ({ commit, database }) => {
            const docs = await database.all();

            commit("refresh", translate.many(docs));
        },
        get: async ({ commit, database }, id: string) => {
            const record = translate.one(await database.get(id));
            if (record) {
                commit("show", record);
            } else {
                throw new ReferenceError(`Source "${id}" not found`);
            }
        },

        find: async ({ commit, database }, selector: PouchDB.Find.FindRequest<Source>) => {
            const docs = await database.query(async function (db) {
                const response = await db.find({ selector });

                return response.docs;
            });

            commit("refresh", translate.many(docs));
        },

        add: async ({ commit, database }, record: Source) => {
            const doc = await database.add({
                _id:   record._id,
                title: record.title,
                image: record.image.name,
            }, record.image);

            commit("append", {
                _id:   doc._id,
                title: doc.title,
                image: record.image,
            });
        },

        update: async ({ commit, database }, record: Source) => {
            let doc = await database.get(record._id);
            doc = await database.update(tap(doc, value => {
                value.title = record.title;
                value.image = record.image.name;
            }), record.image);

            commit("replace", {
                _rev:  doc._rev,
                _id:   doc._id,
                title: doc.title,
                image: record.image,
            });
        },

        remove: async ({ commit, dispatch, rootState, database }, id: string) => {
            await database.remove(id);
            commit("delete", id);

            await dispatch("ties/find", { switchId: id }, { root: true });

            await Promise.all(rootState.ties.items.map(item => dispatch("ties/remove", item._id, { root: true })));
        },
    },
});

export type SourcesState = ModuleState<typeof sources>;

export default sources;
