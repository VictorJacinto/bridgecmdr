<template>
    <div id="dashboard-page">
        Dashboard
        <div id="dashboard-action-buttons" class="fab-container level">
            <b-field class="level-item" position="is-centered" grouped>
                <b-button icon-left="power" type="is-danger"/>
            </b-field>
            <b-field class="level-item" position="is-centered" grouped>
                <b-button icon-left="wrench" type="is-link" @click="onSettingsClicked"/>
            </b-field>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";

    const DashboardPage = Vue.extend({
        name:    "DashboardPage",
        methods: {
            onSettingsClicked() {
                this.$router.push({ name: "settings" });
            },
        },
    });

    export type DashboardPageConstructor = typeof DashboardPage;
    export type DashboardPage = InstanceType<DashboardPageConstructor>;
    export default DashboardPage;
</script>
