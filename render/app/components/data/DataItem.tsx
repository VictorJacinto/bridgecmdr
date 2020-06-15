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

import { identity } from "lodash";
import { ReadonlyDeep } from "type-fest";
import { VNode } from "vue";
import * as tsx from "vue-tsx-support";
import { normalizeScopedSlot } from "../../../foundation/helpers/vue";
import { mapModuleActions, mapModuleState } from "../../../foundation/helpers/vuex";
import { is, maybe, prop } from "../../../foundation/validation/valid";
import IndicatesLoading from "../../concerns/indicates-loading";
import Model from "../../support/data/model";
import { BaseDataModule } from "../../support/data/module";
import { IDPattern } from "../../support/validation";

type DataItemEvents<M extends Model> = {
    onInput(value: ReadonlyDeep<M>|null): void;
};

type DataItemSlots<M extends Model> = {
    loading?: { loading: true };
    default: { current: ReadonlyDeep<M>; refresh: () => Promise<void> };
    error?: { error: Error; refresh: () => Promise<void> };
};

const dataItem = identity(
    <M extends Model>(namespace: string, module: BaseDataModule<M>) =>
        // @vue/component
        tsx.componentFactoryOf<DataItemEvents<M>, DataItemSlots<M>>().mixin(IndicatesLoading).create({
            name:  "DataItem",
            props: {
                id:   prop(is.string.matches(IDPattern)),
                tag:  prop(is.string.notEmpty, "div"),
                slim: prop(maybe.boolean),
            },
            data: function () {
                return {
                    error: null as Error|null,
                };
            },
            computed: {
                ...mapModuleState(module, namespace, ["current"]),
            },
            watch: {
                id() {
                    this.refresh();
                },
            },
            mounted() {
                this.refresh();
            },
            methods: {
                ...mapModuleActions(module, namespace, { getItem: "get" }),
                async refresh() {
                    try {
                        await this.loadingWhile(this.getItem(this.id));
                        this.$emit("input", this.current);
                        this.error = null;
                    } catch (error) {
                        console.error(error);
                        this.error = error;
                    }
                },
            },
            render(): VNode {
                const RootTag = this.tag;
                const loading = (): VNode => {
                    const children = normalizeScopedSlot(this, "loading", { loading: true }, []);

                    return this.slim && children.length <= 1 ? children[0] : (<RootTag>{children}</RootTag>);
                };

                if (this.loading) {
                    // Short-circuit as loading, since is has priority.
                    return loading();
                }

                if (this.error) {
                    const children = normalizeScopedSlot(this, "error", {
                        error:   this.error,
                        refresh: () => this.refresh(),
                    }, []);

                    return this.slim && children.length <= 1 ? children[0] : (<RootTag>{children}</RootTag>);
                }

                if (this.current) {
                    const children = normalizeScopedSlot(this, "default", {
                        current: this.current,
                        refresh: () => this.refresh(),
                    }, []);

                    return this.slim && children.length <= 1 ? children[0] : (<RootTag>{children}</RootTag>);
                }

                // Initial state, is loading.
                return loading();
            },
        }),
);

export default dataItem;
