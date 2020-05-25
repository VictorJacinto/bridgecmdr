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

import { mapActions as baseMapActions, mapGetters as baseMapGetters, mapState as baseMapState, Module } from "vuex";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ModuleState<M extends Module<any, any>> = M extends Module<infer S, any> ? S : never;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ModuleRootState<M extends Module<any, any>> = M extends Module<any, infer R> ? R : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StateMapperResolver<S extends object> = (state: S) => any;
type StateMapperTargets<S extends object> = (keyof S)[]|Record<string, keyof S>|Record<string, StateMapperResolver<S>>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InlineComputed<T extends Function> = T extends (...args: any[]) => infer R ? () => R : never;
type ResolvedStateMappings<S extends object, Map extends StateMapperTargets<S>> =
    Map extends Record<string, StateMapperResolver<S>> ? { [P in keyof Map]: InlineComputed<Map[P]> } :
    Map extends Record<string, keyof S> ? { [P in keyof Map]: () => S[Map[P]] } :
    Map extends (keyof S)[] ? { [K in Map[number]]: () => S[K] } :
    never;
interface StateMapper<S extends object> {
    <Targets extends StateMapperTargets<S>>(targets: Targets): ResolvedStateMappings<S, Targets>;
    <Targets extends StateMapperTargets<S>>(namespace: string, targets: Targets): ResolvedStateMappings<S, Targets>;
}

export function mapState<S extends object>(): StateMapper<S> {
    return baseMapState;
}

interface VuexModuleWithState {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    state: any|(() => any);
}

type ResolvedState<M extends VuexModuleWithState> =
    M extends { state: () => infer S } ? S :
    M extends { state: infer S } ? S :
    never;

interface VuexModuleWithGetters extends VuexModuleWithState {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getters: { [key: string]: (...args: any[]) => any };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GetterMapperResolver<M extends VuexModuleWithGetters> = ((state: ResolvedState<M>) => any);
type GetterMapperTargets<M extends VuexModuleWithGetters> =
    (keyof M["getters"])[]|
    Record<string, keyof M["getters"]>|
    Record<string, GetterMapperResolver<M>>;

type ResolvedGetterMappings<M extends VuexModuleWithGetters, Map extends GetterMapperTargets<M>> =
    Map extends (keyof M["getters"])[] ? { [K in Map[number]]: () => ReturnType<M["getters"][K]> } :
    Map extends Record<string, keyof M["getters"]> ? { [P in keyof Map]: () => ReturnType<M["getters"][Map[P]]> } :
    Map extends Record<string, GetterMapperResolver<M>> ? { [K in keyof Map]: InlineComputed<Map[K]> } :
    never;

interface GetterMapper<M extends VuexModuleWithGetters> {
    <Targets extends GetterMapperTargets<M>>(targets: Targets): ResolvedGetterMappings<M, Targets>;
    <Targets extends GetterMapperTargets<M>>(namespace: string, targets: Targets): ResolvedGetterMappings<M, Targets>;
}

export function mapGetters<M extends VuexModuleWithGetters>(): GetterMapper<M> {
    return baseMapGetters;
}

interface VuexModuleWithActions {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    actions: { [key: string]: (...args: any[]) => Promise<any> };
}

type ActionMapperTargets<M extends VuexModuleWithActions> =
    (keyof M["actions"])[]|
    Record<string, keyof M["actions"]>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyAyncFunction = (...args: any[]) => Promise<any>;
type AnyActionHandler<F extends AnyAyncFunction> =
    F extends () => Promise<infer R> ? () => Promise<R> :
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    F extends (injectee: any) => Promise<infer R> ? () => Promise<R> :
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    F extends (injectee: any, payload: infer P) => Promise<infer R> ? (payload: P) => Promise<R> :
    never;

// type Z = Parameters<(x: number) => number>[0];

type ResolvedActionMappings<M extends VuexModuleWithActions, Map extends ActionMapperTargets<M>> =
    Map extends (keyof M["actions"])[] ? { [K in Map[number]]: AnyActionHandler<M["actions"][K]> } :
    Map extends Record<string, keyof M["actions"]> ? { [P in keyof Map]: AnyActionHandler<M["actions"][Map[P]]> } :
    never;

interface ActionMapper<M extends VuexModuleWithActions> {
    <Targets extends ActionMapperTargets<M>>(targets: Targets): ResolvedActionMappings<M, Targets>;
    <Targets extends ActionMapperTargets<M>>(namespace: string, targets: Targets): ResolvedActionMappings<M, Targets>;
}

export function mapActions<M extends VuexModuleWithActions>(): ActionMapper<M> {
    return baseMapActions as ActionMapper<M>;
}
