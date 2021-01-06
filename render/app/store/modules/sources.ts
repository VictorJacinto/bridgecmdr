import type { RegisterOptions } from "decoration-vuex";
import { Action, Module } from "decoration-vuex";
import { isNil, omit } from "lodash";
import type { Document, GetDocument } from "../../support/data/database";
import type Model from "../../support/data/model";
import type { RevisionId } from "../../support/data/model";
import type { DocumentArgs } from "../base/data-module";
import DataModule, { DATABASE } from "../base/data-module";
import store from "../store";
import ties from "./ties";

export interface Source extends Model {
    title: string;
    image: File;
}

type SourceDocument = Model & Document<{
    title: string;
    image: string;
}>;

@Module
class Sources extends DataModule<Source, SourceDocument> {
    constructor(register: RegisterOptions) {
        super(register, {
            name:  "sources",
            term:  () => "source",
            empty: () => ({
                _id:   undefined,
                image: undefined,
                title: "",
            }),
        });
    }

    @Action
    async remove(id: string): Promise<string> {
        const connection = await this[DATABASE];
        await connection.remove(id);

        await ties.find({ sourceId: id });

        await Promise.all(ties.items.map(item => ties.remove(item._id)));

        return id;
    }

    // eslint-disable-next-line class-methods-use-this
    protected toModel(doc: GetDocument<SourceDocument>): Source {
        if (!isNil(doc._attachments) && !isNil(doc._attachments[doc.image])) {
            const attachment = doc._attachments[doc.image] as PouchDB.Core.FullAttachment;
            if (!isNil(attachment.data)) {
                const image = new File([attachment.data as Blob], doc.image, { type: attachment.content_type });

                return { ...omit(doc, "_attachments"), image };
            }
        }

        throw new Error("Source missing image attachment");
    }

    protected toDocument(model: Source): DocumentArgs<SourceDocument>;
    protected toDocument(model: Source, rev: RevisionId): DocumentArgs<GetDocument<SourceDocument>>;
    // eslint-disable-next-line class-methods-use-this
    protected toDocument(model: Source, _rev?: RevisionId): DocumentArgs<SourceDocument> {
        return [ { ...model, _rev, image: model.image.name }, model.image ];
    }
}

const sources = new Sources({ store });

export default sources;
