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

import { VNode } from "vue";
import * as tsx from "vue-tsx-support";
import { BButton, BField, BIcon, BInput, BUpload } from "../../../foundation/components/buefy-tsx";
import { ValidationObserver, ValidationProvider } from "../../../foundation/components/vee-validate-tsx";
import { is, prop } from "../../../foundation/validation/valid";
import { Source } from "../../store/modules/sources";
import { validationStatus } from "../../support/validation";
import SvgIcon from "../SvgIcon";

const SourceModal = tsx.component({
    name:  "SourceModal",
    props: {
        item: prop(is.object<Partial<Source>>()),
    },
    data: function () {
        return {
            imageUrl: this.item.image ? URL.createObjectURL(this.item.image) : null,
        };
    },
    computed: {
        title(): string {
            return this.item._id === null ? "Add source" : "Edit source";
        },
        confirmText(): string {
            return this.item._id === null ? "Create" : "Save";
        },
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
            this.$modals.confirm(this.item);
        },
    },
    beforeDestroy() {
        if (this.imageUrl) {
            URL.revokeObjectURL(this.imageUrl);
        }
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
                    </div>,
                    <main class="modal-card-body">
                        <ValidationProvider name="title" rules="required" slim scopedSlots={{
                            default: ({ errors }) => (
                                <BField label="Title" expanded {...validationStatus(errors)}>
                                    <BInput v-model={this.item.title} placeholder="Required"/>
                                </BField>
                            ),
                        }}/>
                        <ValidationProvider name="file" rules="required" slim scopedSlots={{
                            default: ({ errors }) => (
                                <BField label="Icon" expanded {...validationStatus(errors)}>
                                    <BUpload v-model={this.item.image} dragDrop
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
                    <footer class="modal-card-foot">
                        <BButton label={this.confirmText} type="is-primary"
                            onClick={() => handleSubmit(() => this.onSaveClicked()) }/>
                    </footer>,
                ],
            }}/>
        );
    },
});

type SourceModal = InstanceType<typeof SourceModal>;
export default SourceModal;
