<template>
    <validation-observer id="source-editor" #default="{ handleSubmit }" tag="div" class="modal-card">
        <div class="navbar is-primary">
            <div class="navbar-brand">
                <a class="navbar-item" @click="$modals.cancel()"><b-icon icon="arrow-left"/></a>
                <div class="navbar-item">{{ title }}</div>
            </div>
            <div class="navbar-menu">
                <div class="navbar-end">
                    <a class="navbar-item" @click="handleSubmit(onSaveClicked)">{{ confirmText }}</a>
                </div>
            </div>
        </div>
        <main class="modal-card-body">
            <validation-provider #default="{ errors }" name="title" rules="required" slim>
                <b-field label="Title" expanded v-bind="{ ...validationStatus(errors) }">
                    <b-input v-model="source.title" placeholder="Required"/>
                </b-field>
            </validation-provider>
            <validation-provider #default="{ errors }" name="file" rules="required" slim>
                <b-field label="Icon" expanded v-bind="{ ...validationStatus(errors) }">
                    <b-upload v-model="source.image" drag-drop @input="updateImage">
                        <div v-if="imageUrl" class="content has-text-centered">
                            <div class="is-flex is-justify-center">
                                <figure class="image icon preview is-96x96 is-centered">
                                    <img :src="imageUrl" alt="icon">
                                </figure>
                            </div>
                            <p>Drop an image or tap to select</p>
                        </div>
                        <div v-else class="content has-text-centered">
                            <div class="is-flex is-justify-center">
                                <svg-icon name="mdiUpload" class="is-centered" size="is-96x96"/>
                            </div>
                            <p>Drop an image or tap to select</p>
                        </div>
                    </b-upload>
                </b-field>
            </validation-provider>
        </main>
    </validation-observer>
</template>

<script lang="ts">
    import { cloneDeep } from "lodash";
    import Component, { mixins } from "vue-class-component";
    import { Prop } from "vue-property-decorator";
    import { is, prop } from "../../../foundation/validation/valid";
    import DoesValidation from "../../concerns/does-validation";
    import type { Source } from "../../store/modules/sources";
    import SvgIcon from "../SvgIcon.vue";

    @Component<SourceModal>({
        name:       "SourceModal",
        components: {
            "svg-icon": SvgIcon,
        },
    })
    export default class SourceModal extends mixins(DoesValidation) {
        @Prop(prop(is.object<Partial<Source>>()))
        readonly item!: Partial<Source>;

        source = cloneDeep(this.item);
        imageUrl = this.item.image ? URL.createObjectURL(this.item.image) : null;

        get title(): string {
            return this.source._id ? "Edit source" : "Add source";
        }

        get confirmText(): string {
            return this.source._id ? "Save" : "Create";
        }

        beforeDestroy(): void {
            if (this.imageUrl) {
                URL.revokeObjectURL(this.imageUrl);
            }
        }

        updateImage(image: File|File[]): void {
            if (this.imageUrl) {
                URL.revokeObjectURL(this.imageUrl);
                this.imageUrl = null;
            }

            if (image instanceof Array) {
                image = image[0];
            }

            this.imageUrl = URL.createObjectURL(image);
        }

        onSaveClicked(): void {
            this.$modals.confirm(this.source);
        }
    }
</script>
