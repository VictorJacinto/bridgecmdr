<template>
    <div id="settings-page">
        <b-navbar fixed-top type="is-primary" :mobile-burger="false">
            <template #brand>
                <b-navbar-item tag="div">Settings</b-navbar-item>
            </template>
        </b-navbar>
        <div class="media-list">
            <article v-for="entry of list" :key="entry.name" class="media">
                <div class="media-left">
                    <figure class="image is-48x48">
                        <img :src="entry.icon" alt=""/>
                    </figure>
                </div>
                <div class="media-content">
                    <p class="is-strong">{{ entry.name }}</p>
                    <p>{{ entry.sub }}</p>
                </div>
            </article>
        </div>
    </div>
</template>

<script lang="ts">
    import antennaIcon from "@mdi/svg/svg/video-input-antenna.svg";
    import componentIcon from "@mdi/svg/svg/video-input-component.svg";
    import hdmiIcon from "@mdi/svg/svg/video-input-hdmi.svg";
    import scartIcon from "@mdi/svg/svg/video-input-scart.svg";
    import sVideoIcon from "@mdi/svg/svg/video-input-svideo.svg";
    import Vue from "vue";

    type ListItems = {
        name: string;
        sub: string;
        icon: unknown;
    };

    const list: ListItems[] = [
        {
            name: "Antenna",
            sub:  "Rabbit ears",
            icon: antennaIcon,
        },
        {
            name: "Component",
            sub:  "Early, and analog, high definition",
            icon: componentIcon,
        },
        {
            name: "HDMI",
            sub:  "Modern digital high definition and beyond",
            icon: hdmiIcon,
        },
        {
            name: "SCART",
            sub:  "European analog RGB component and more",
            icon: scartIcon,
        },
        {
            name: "S-Video",
            sub:  "Better than composite",
            icon: sVideoIcon,
        },
    ];

    list.push(...list);

    const SettingsPage = Vue.extend({
        name: "SettingsPage",
        data: function () {
            return {
                list,
            };
        },
    });

    export type SettingsPageConstructor = typeof SettingsPage;
    export type SettingsPage = InstanceType<SettingsPageConstructor>;
    export default SettingsPage;
</script>

<style lang="scss" scoped>

</style>
