import { cloneDeep } from "lodash";
import type { VueConstructor } from "vue";
import Vue from "vue";
import Component from "vue-class-component";
import type DataModule from "../../store/base/data-module";
import type { ModelType } from "../../store/base/data-module";
import type Model from "../../support/data/model";

@Component({ name: "ManagesData" })
export default class ManagesData<D extends DataModule<M, Model>, M extends Model = ModelType<D>> extends Vue {
    readonly module!: () => D;

    readonly modal!: () => VueConstructor;

    get modelTerm(): string {
        return this.module().term;
    }

    getEmpty(): Partial<M> {
        return cloneDeep(this.module().empty);
    }

    async doAdd(record: M): Promise<M> {
        return this.module().add(record);
    }

    async doUpdate(record: M): Promise<M> {
        return this.module().update(record);
    }

    async doRemove(id: string): Promise<string> {
        return this.module().remove(id);
    }

    async showModal(item: Partial<M>): Promise<null|M> {
        return this.$modals.open<M>(this.modal(), {
            props:       { item },
            canCancel:   false,
            fullScreen:  true,
            customClass: "dialog-like",
        });
    }

    showEditModal(item: M): Promise<null|M> {
        return this.showModal(item);
    }

    showAddModal(defaults: Partial<M> = {}): Promise<null|M> {
        return this.showModal({ ...this.getEmpty(), ...defaults });
    }

    async removeItem(item: M): Promise<boolean> {
        const remove = await this.$dialogs.confirm({
            message:     `Do you to remove this ${this.modelTerm}?`,
            type:        "is-danger",
            confirmText: "Remove",
            focusOn:     "cancel",
        });

        if (remove) {
            try {
                await this.doRemove(item._id);

                return true;
            } catch (error: unknown) {
                await this.$dialogs.error(error);
            }
        }

        return false;
    }

    async updateItem(source: M): Promise<null|M> {
        const item = await this.showEditModal(source);
        if (item) {
            try {
                return await this.doUpdate(item);
            } catch (error: unknown) {
                await this.$dialogs.error(error);
            }
        }

        return null;
    }

    async createItem(defaults: Partial<M> = {}): Promise<null|M> {
        const item = await this.showAddModal(defaults);
        if (item) {
            try {
                return await this.doAdd(item);
            } catch (error: unknown) {
                await this.$dialogs.error(error);
            }
        }

        return null;
    }
}
