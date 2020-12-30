/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/ban-types */

import type { SetRequired } from "type-fest";
import type { Module, ActionObject } from "vuex";
import { mapActions, mapGetters, mapState } from "vuex";

type AnyVuexModule = Module<any, any>;

type ProperState<S> = S extends object ? S : never;
type ResolvedModuleState<M extends AnyVuexModule> =
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

export function mapModuleState<M extends VuexModuleWithState, Targets extends StateMapTargets<ResolvedModuleState<M>>>(
    _module: M, namespace: string, targets: Targets): ResolvedStateMappings<ResolvedModuleState<M>, Targets>;
export function mapModuleState<M extends VuexModuleWithState, Targets extends StateMapTargets<ResolvedModuleState<M>>>(
    _module: M, targets: Targets): ResolvedStateMappings<ResolvedModuleState<M>, Targets>;
export function mapModuleState(_module: any, namespace: any, targets?: any): any {
    return mapState(namespace, targets);
}

type VuexModuleWithGetters = SetRequired<AnyVuexModule, "getters">;

type GetterMapHandler<M extends VuexModuleWithGetters> = ((state: ResolvedModuleState<M>) => any);
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
    _module: M, namespace: string, targets: Targets): ResolvedGetterMappings<M, Targets>;
export function mapModuleGetters<M extends VuexModuleWithGetters, Targets extends GetterMapTargets<M>>(
    _module: M, targets: Targets): ResolvedGetterMappings<M, Targets>;
export function mapModuleGetters(_module: any, namespace: any, targets?: any): any {
    return mapGetters(namespace, targets);
}

type VuexModuleWithActions = SetRequired<AnyVuexModule, "actions">;

type Dispatch<M extends VuexModuleWithActions> = (type: keyof M["actions"], payload?: any) => void;
type InlineAction<F extends Function, M extends VuexModuleWithActions> =
    F extends (dispatch: Dispatch<M>) => void ? () => void :
    F extends (dispatch: Dispatch<M>, payload: infer P) => void ? (payload: P) => void :
    never;

type ActionMapHandler<M extends VuexModuleWithActions> = (dispatch: Dispatch<M>, payload?: any) => void;

type ActionMapTargets<M extends VuexModuleWithActions> =
    readonly (keyof M["actions"])[]|
    Record<string, keyof M["actions"]>|
    Record<string, ActionMapHandler<M>>;

type DefinedActionable<F extends (...args: any) => any> =
    F extends () => Promise<infer R> ? () => Promise<R> :
    F extends () => infer R ? () => Promise<R> :
    F extends (injectee: any) => Promise<infer R> ? () => Promise<R> :
    F extends (injectee: any) => infer R ? () => Promise<R> :
    F extends (injectee: any, payload: infer P) => Promise<infer R> ? (payload: P) => Promise<R> :
    F extends (injectee: any, payload: infer P) => infer R ? (payload: P) => Promise<R> :
    never;

type Actionable<H> =
    H extends (...args: any) => any ? DefinedActionable<H> :
    H extends ActionObject<any, any> ? DefinedActionable<H["handler"]> :
    never;

type ResolvedActionMappings<M extends VuexModuleWithActions, Map extends ActionMapTargets<M>> =
    Map extends Record<string, ActionMapHandler<M>> ? { [P in keyof Map]: InlineAction<Map[P], M> } :
    Map extends Record<string, keyof M["actions"]> ? { [P in keyof Map]: Actionable<M["actions"][Map[P]]> } :
    Map extends readonly (keyof M["actions"])[] ? { [K in Map[number]]: Actionable<M["actions"][K]> } :
    never;

export function mapModuleActions<M extends VuexModuleWithActions, Targets extends ActionMapTargets<M>>(
    _module: M, namespace: string, targets: Targets): ResolvedActionMappings<M, Targets>;
export function mapModuleActions<M extends VuexModuleWithActions, Targets extends ActionMapTargets<M>>(
    _module: M, targets: Targets): ResolvedActionMappings<M, Targets>;
export function mapModuleActions(_module: any, namespace: any, targets?: any): any {
    return mapActions(namespace, targets);
}
