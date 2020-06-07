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
/* eslint-disable @typescript-eslint/no-explicit-any */

import { SetRequired } from "type-fest";
import { ActionObject, Module, mapActions, mapMutations, mapGetters, mapState } from "vuex";

// noinspection JSUnusedGlobalSymbols
export type ModuleState<M extends Module<any, any>> = M extends Module<infer S, any> ? S : never;
// noinspection JSUnusedGlobalSymbols
export type ModuleRootState<M extends Module<any, any>> = M extends Module<any, infer R> ? R : never;

type AnyVuexModule = Module<any, any>;

type ProperState<S> = S extends object ? S : never;
type ResolvedState<M extends AnyVuexModule> =
    M extends { state: () => infer S } ? ProperState<S> :
    M extends { state: infer S } ? ProperState<S> :
    never;

type VuexModuleWithState = SetRequired<AnyVuexModule, "state">;

type InlineComputed<T extends Function> = T extends (...args: any[]) => infer R ? () => R : never;

type StateMapHandler<S extends object> = (state: S) => any;
type StateMapTargets<S extends object> =
    readonly (keyof S)[]|
    Record<string, keyof S>|
    Record<string, StateMapHandler<S>>;

type ResolvedStateMappings<S extends object, Map extends StateMapTargets<S>> =
    Map extends Record<string, StateMapHandler<S>> ? { [P in keyof Map]: InlineComputed<Map[P]> } :
    Map extends Record<string, keyof S> ? { [P in keyof Map]: () => S[Map[P]] } :
    Map extends readonly (keyof S)[] ? { [K in Map[number]]: () => S[K] } :
    never;

export function mapModuleState<M extends VuexModuleWithState, Targets extends StateMapTargets<ResolvedState<M>>>(
    module: M, namespace: string, targets: Targets): ResolvedStateMappings<ResolvedState<M>, Targets>;
export function mapModuleState<M extends VuexModuleWithState, Targets extends StateMapTargets<ResolvedState<M>>>(
    module: M, targets: Targets): ResolvedStateMappings<ResolvedState<M>, Targets>;
export function mapModuleState(_module: any, namespace: any, targets?: any): any {
    return mapState(namespace, targets);
}

type VuexModuleWithGetters = SetRequired<AnyVuexModule, "getters">;

type GetterMapHandler<M extends VuexModuleWithGetters> = ((state: ResolvedState<M>) => any);
type GetterMapTargets<M extends VuexModuleWithGetters> =
    readonly (keyof M["getters"])[]|
    Record<string, keyof M["getters"]>|
    Record<string, GetterMapHandler<M>>;

type ResolvedGetterMappings<M extends VuexModuleWithGetters, Map extends GetterMapTargets<M>> =
    Map extends Record<string, GetterMapHandler<M>> ? { [K in keyof Map]: InlineComputed<Map[K]> } :
    Map extends Record<string, keyof M["getters"]> ? { [P in keyof Map]: InlineComputed<M["getters"][Map[P]]> } :
    Map extends readonly (keyof M["getters"])[] ? { [K in Map[number]]: InlineComputed<M["getters"][K]> } :
    never;

export function mapModuleGetters<M extends VuexModuleWithGetters, Targets extends GetterMapTargets<M>>(
    module: M, namespace: string, targets: Targets): ResolvedGetterMappings<M, Targets>;
export function mapModuleGetters<M extends VuexModuleWithGetters, Targets extends GetterMapTargets<M>>(
    module: M, targets: Targets): ResolvedGetterMappings<M, Targets>;
export function mapModuleGetters(_module: any, namespace: any, targets?: any): any {
    return mapGetters(namespace, targets);
}

type VuexModuleWithMutations = SetRequired<AnyVuexModule, "mutations">;

type MutationMapTargets<M extends VuexModuleWithMutations> =
    readonly (keyof M["mutations"])[]|
    Record<string, keyof M["mutations"]>;

type InlineMutation<F extends (...args: any) => any> =
    F extends () => void ? () => void :
    F extends (injectee: any) => void ? () => void :
    F extends (injectee: any, payload: infer P) => void ? (payload: P) => void :
    never;

type ResolvedMutationMappings<M extends VuexModuleWithMutations, Map extends MutationMapTargets<M>> =
    Map extends Record<string, keyof M["mutations"]> ? { [P in keyof Map]: InlineMutation<M["mutations"][Map[P]]> } :
    Map extends readonly (keyof M["mutations"])[] ? { [K in Map[number]]: InlineMutation<M["mutations"][K]> } :
    never;

export function mapModuleMutations<M extends VuexModuleWithMutations, Targets extends MutationMapTargets<M>>(
    module: M, namespace: string, targets: Targets): ResolvedMutationMappings<M, Targets>;
export function mapModuleMutations<M extends VuexModuleWithMutations, Targets extends MutationMapTargets<M>>(
    module: M, targets: Targets): ResolvedMutationMappings<M, Targets>;
export function mapModuleMutations(_module: any, namespace: any, targets?: any): any {
    return mapMutations(namespace, targets);
}

type VuexModuleWithActions = SetRequired<AnyVuexModule, "actions">;

type ActionMapTargets<M extends VuexModuleWithActions> =
    readonly (keyof M["actions"])[]|
    Record<string, keyof M["actions"]>;

type InlineActionable<F extends (...args: any) => any> =
    F extends () => Promise<infer R> ? () => Promise<R> :
    F extends () => infer R ? () => Promise<R> :
    F extends (injectee: any) => Promise<infer R> ? () => Promise<R> :
    F extends (injectee: any) => infer R ? () => Promise<R> :
    F extends (injectee: any, payload: infer P) => Promise<infer R> ? (payload: P) => Promise<R> :
    F extends (injectee: any, payload: infer P) => infer R ? (payload: P) => Promise<R> :
    never;

type Actionable<H> =
    H extends (...args: any) => any ? InlineActionable<H> :
    H extends ActionObject<any, any> ? InlineActionable<H["handler"]> :
    never;

type ResolvedActionMappings<M extends VuexModuleWithActions, Map extends ActionMapTargets<M>> =
    Map extends Record<string, keyof M["actions"]> ? { [P in keyof Map]: Actionable<M["actions"][Map[P]]> } :
    Map extends readonly (keyof M["actions"])[] ? { [K in Map[number]]: Actionable<M["actions"][K]> } :
    never;

export function mapModuleActions<M extends VuexModuleWithActions, Targets extends ActionMapTargets<M>>(
    module: M, namespace: string, targets: Targets): ResolvedActionMappings<M, Targets>;
export function mapModuleActions<M extends VuexModuleWithActions, Targets extends ActionMapTargets<M>>(
    module: M, targets: Targets): ResolvedActionMappings<M, Targets>;
export function mapModuleActions(_module: any, namespace: any, targets?: any): any {
    return mapActions(namespace, targets);
}
