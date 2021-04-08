<template>
    <nav class="navbar is-fixed-top is-transparent" role="navigation" aria-label="main navigation">
        <div class="">
            <div class="navbar-brand">
                <a class="navbar-item ml-2" href="/">
                    <img
                        src="@/assets/logo.png"
                        alt="ロゴ"
                    />
                </a>

                <a
                    role="button"
                    class="navbar-burger burger has-text-black"
                    aria-label="menu"
                    aria-expanded="false"
                    data-target="navbar-menu"
                    @click="toggle"
                >
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>
        </div>
    </nav>
    
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FlashIcon from "./FlashIcon.vue";
import Menu from './Menu.vue';
import viewStore from '../store/view';

export default defineComponent({
    name: "Header",
    components: {
        FlashIcon,
        Menu
    },
    data() {
        return {
            isMenuButtonClicked: false
        };
    },
    methods: {
        toggle() {
            this.isMenuButtonClicked = !this.isMenuButtonClicked;
            viewStore.set(this.isMenuButtonClicked);
        }
    }
});
</script>

<style lang="scss">
.navbar {
    height: auto !important;
    box-shadow: 1px 0px 2px 2px rgba(0, 0, 0, 0.5);
    position: fixed !important;
    width: 100%;
    .navbar-item{
        padding: 0;
        img{
            height: 50px;
        }
    }
}
</style>
