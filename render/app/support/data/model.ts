export type DocumentId = string;
export type RevisionId = string;
export default interface Model {
    _id: DocumentId;
    _rev?: RevisionId;
}
