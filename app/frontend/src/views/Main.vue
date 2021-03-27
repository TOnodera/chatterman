<template>
    <div class="dashboard-wrapper columns">
        <Sidebar
            class="sidebar column"
            :class="{
                'is-hidden-touch is-2': !isMenuClicked,
                'is-4': isMenuClicked,
            }"
        />
        <div
            class="dashboard-content column"
            :class="{ 'is-8': isMenuClicked, 'is-10': !isMenuClicked }"
        >
            <div class="columns is-centered">
                <div class="column mt-5">
                    <router-view />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Sidebar from "@/components/Sidebar.vue";
import { defineComponent } from "vue";

export default defineComponent({
    name: "Main",
    components: {
        Sidebar
    },
    props: {
        isMenuClicked: {
            type: Boolean,reuqired: true
        }
    }
});
</script>

<style lang="scss" scoped>
.app-wrapper {
    .app-header {
        box-shadow: 1px 0px 2px 2px rgba(0, 0, 0, 0.5);
        position: relative;
    }
    .app-contents {
        min-height: 100vh;
    }
    .app-footer {
        box-shadow: -1px 0px 2px 2px rgba(0, 0, 0, 0.5);
        position: relative;
    }
};
</style>