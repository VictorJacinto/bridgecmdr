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
import { ActionObject, mapActions as baseMapActions, mapGetters as baseMapGetters, mapState as baseMapState, Module } from "vuex";

export type ModuleState<M extends Module<any, any>> = M extends Module<infer S, any> ? S : never;
export type ModuleRootState<M extends Module<any, any>> = M extends Module<any, infer R> ? R : never;

type InlineComputed<T extends Function> = T extends (...args: any[]) => infer R ? () => R : never;

type StateMapHandler<S extends object> = (state: S) => any;
type StateMapTargets<S extends object> =
    (keyof S)[]|
    Record<string, keyof S>|
    Record<string, StateMapHandler<S>>;

type ResolvedStateMappings<S extends object, Map extends StateMapTargets<S>> =
    Map extends Record<string, StateMapHandler<S>> ? { [P in keyof Map]: InlineComputed<Map[P]> } :
    Map extends Record<string, keyof S> ? { [P in keyof Map]: () => S[Map[P]] } :
    Map extends (keyof S)[] ? { [K in Map[number]]: () => S[K] } :
    never;

interface StateMapper<S extends object> {
    <Targets extends StateMapTargets<S>>(targets: Targets): ResolvedStateMappings<S, Targets>;
    <Targets extends StateMapTargets<S>>(namespace: string, targets: Targets): ResolvedStateMappings<S, Targets>;
}

export function mapState<S extends object>(): StateMapper<S> {
    return baseMapState;
}

type AnyVuexModule = Module<any, any>;

type ResolvedState<M extends AnyVuexModule> =
    M extends { state: () => infer S } ? S :
    M extends { state: infer S } ? S :
    never;

type VuexModuleWithGetters = SetRequired<AnyVuexModule, "getters">;

type GetterMapHandler<M extends VuexModuleWithGetters> = ((state: ResolvedState<M>) => any);
type GetterMapTargets<M extends VuexModuleWithGetters> =
    (keyof M["getters"])[]|
    Record<string, keyof M["getters"]>|
    Record<string, GetterMapHandler<M>>;

type ResolvedGetterMappings<M extends VuexModuleWithGetters, Map extends GetterMapTargets<M>> =
    Map extends (keyof M["getters"])[] ? { [K in Map[number]]: InlineComputed<M["getters"][K]> } :
    Map extends Record<string, keyof M["getters"]> ? { [P in keyof Map]: InlineComputed<M["getters"][Map[P]]> } :
    Map extends Record<string, GetterMapHandler<M>> ? { [K in keyof Map]: InlineComputed<Map[K]> } :
    never;

interface GetterMapper<M extends VuexModuleWithGetters> {
    <Targets extends GetterMapTargets<M>>(targets: Targets): ResolvedGetterMappings<M, Targets>;
    <Targets extends GetterMapTargets<M>>(namespace: string, targets: Targets): ResolvedGetterMappings<M, Targets>;
}

export function mapGetters<M extends VuexModuleWithGetters>(): GetterMapper<M> {
    return baseMapGetters;
}

type VuexModuleWithActions = SetRequired<AnyVuexModule, "actions">;

type ActionMapperTargets<M extends VuexModuleWithActions> =
    (keyof M["actions"])[]|
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

type ResolvedActionMappings<M extends VuexModuleWithActions, Map extends ActionMapperTargets<M>> =
    Map extends (keyof M["actions"])[] ? { [K in Map[number]]: Actionable<M["actions"][K]> } :
    Map extends Record<string, keyof M["actions"]> ? { [P in keyof Map]: Actionable<M["actions"][Map[P]]> } :
    never;

interface ActionMapper<M extends VuexModuleWithActions> {
    <Targets extends ActionMapperTargets<M>>(targets: Targets): ResolvedActionMappings<M, Targets>;
    <Targets extends ActionMapperTargets<M>>(namespace: string, targets: Targets): ResolvedActionMappings<M, Targets>;
}

export function mapActions<M extends VuexModuleWithActions>(): ActionMapper<M> {
    return baseMapActions as ActionMapper<M>;
}
