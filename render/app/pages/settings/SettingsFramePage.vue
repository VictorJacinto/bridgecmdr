<template>
    <div id="settings-frame-page">
        <b-navbar fixed-top type="is-primary" :mobile-burger="false">
            <template #brand>
                <b-navbar-item tag="a" @click="$router.back()">
                    <b-icon icon="arrow-left"/>
                </b-navbar-item>
                <b-navbar-item tag="div">{{ title }}</b-navbar-item>
            </template>
        </b-navbar>
        <router-view/>
    </div>
</template>

<script lang="ts">
    import Component, { mixins } from "vue-class-component";
    import UsesSettingsTitle from "../../concerns/uses-settings-title";

    @Component<SettingsFramePage>({ name: "SettingsFramePage" })
    export default class SettingsFramePage extends mixins(UsesSettingsTitle) {

    }
</script>
