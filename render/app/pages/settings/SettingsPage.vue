<!--
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
-->

<template>
    <div id="settings-page">
        <b-navbar fixed-top type="is-primary" :mobile-burger="false">
            <template #brand>
                <b-navbar-item tag="div">Settings</b-navbar-item>
            </template>
        </b-navbar>
        <card-list #default="{ entry }" has-icons :entries="list">
            <card-list-entry>
                <template #icon>
                    <figure class="image is-48x48">
                        <!--suppress HtmlUnknownTarget -->
                        <img :src="entry.icon" alt=""/>
                    </figure>
                </template>
                <p class="is-strong">{{ entry.name }}</p>
                <p>{{ entry.sub }}</p>
            </card-list-entry>
        </card-list>
    </div>
</template>

<script lang="ts">
    import antennaIcon from "@mdi/svg/svg/video-input-antenna.svg";
    import componentIcon from "@mdi/svg/svg/video-input-component.svg";
    import hdmiIcon from "@mdi/svg/svg/video-input-hdmi.svg";
    import scartIcon from "@mdi/svg/svg/video-input-scart.svg";
    import sVideoIcon from "@mdi/svg/svg/video-input-svideo.svg";
    import Vue from "vue";
    import Component from "vue-class-component";

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

    @Component
    export default class SettingsPage extends Vue {
        list = list;
    }
</script>
