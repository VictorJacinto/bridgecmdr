import { cloneDeep } from "lodash";
import { VNode } from "vue";
import * as tsx from "vue-tsx-support";
import { BField, BIcon, BInput, BUpload } from "../../../foundation/components/buefy-tsx";
import { ValidationObserver, ValidationProvider } from "../../../foundation/components/vee-validate-tsx";
import { is, prop } from "../../../foundation/validation/valid";
import { Source } from "../../store/modules/sources";
import { validationStatus } from "../../support/validation";
import SvgIcon from "../SvgIcon";

// @vue/component
const SourceModal = tsx.component({
    name:  "SourceModal",
    props: {
        item: prop(is.object<Partial<Source>>()),
    },
    data: function () {
        return {
            source:   cloneDeep(this.item),
            imageUrl: this.item.image ? URL.createObjectURL(this.item.image) : null,
        };
    },
    computed: {
        title(): string {
            return this.source._id ? "Edit source" : "Add source";
        },
        confirmText(): string {
            return this.source._id ? "Save" : "Create";
        },
    },
    beforeDestroy() {
        if (this.imageUrl) {
            URL.revokeObjectURL(this.imageUrl);
        }
    },
    methods: {
        updateImage(image: File|File[]) {
            if (this.imageUrl) {
                URL.revokeObjectURL(this.imageUrl);
                this.imageUrl = null;
            }

            if (image instanceof Array) {
                image = image[0];
            }

            this.imageUrl = URL.createObjectURL(image);
        },
        onSaveClicked() {
            this.$modals.confirm(this.source);
        },
    },
    render(): VNode {
        return (
            <ValidationObserver tag="div" id="source-editor" class="modal-card" scopedSlots={{
                default: ({ handleSubmit }) => [
                    <div class="navbar is-primary">
                        <div class="navbar-brand">
                            <a class="navbar-item" onClick={() => this.$modals.cancel()}>
                                <BIcon icon="arrow-left"/>
                            </a>
                            <div class="navbar-item">{this.title}</div>
                        </div>
                        <div class="navbar-menu">
                            <div class="navbar-end">
                                <a class="navbar-item" onClick={() => handleSubmit(() => this.onSaveClicked())}>Save</a>
                            </div>
                        </div>
                    </div>,
                    <main class="modal-card-body">
                        <ValidationProvider name="title" rules="required" slim scopedSlots={{
                            default: ({ errors }) => (
                                <BField label="Title" expanded {...validationStatus(errors)}>
                                    <BInput v-model={this.source.title} placeholder="Required"/>
                                </BField>
                            ),
                        }}/>
                        <ValidationProvider name="file" rules="required" slim scopedSlots={{
                            default: ({ errors }) => (
                                <BField label="Icon" expanded {...validationStatus(errors)}>
                                    <BUpload v-model={this.source.image} dragDrop
                                        onInput={image => this.updateImage(image)}>{
                                            this.imageUrl ? (
                                                <div class="content has-text-centered">
                                                    <p class="is-flex is-justify-center">
                                                        <figure class="image icon preview is-96x96 is-centered">
                                                            <img src={this.imageUrl} alt="icon"/>
                                                        </figure>
                                                    </p>
                                                    <p>Drop an image or tap to select</p>
                                                </div>
                                            ) : (
                                                <div class="content has-text-centered">
                                                    <p class="is-flex is-justify-center">
                                                        <SvgIcon name="mdiUpload" class="is-centered"
                                                            size="is-96x96"/>
                                                    </p>
                                                    <p>Drop an image or tap to select</p>
                                                </div>
                                            )
                                        }</BUpload>
                                </BField>
                            ),
                        }}/>
                    </main>,
                ],
            }}/>
        );
    },
});

type SourceModal = InstanceType<typeof SourceModal>;
export default SourceModal;
