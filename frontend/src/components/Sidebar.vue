<template>
    <div class="sidebar-wrapper p-2 ml-3 is-touch-position-fixed" :class="{'is-hidden-touch': !isMenuShow,'z-index-1': isMenuShow}">
        <Menu class="menu" test="fromsidebar"/>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Menu from './Menu.vue';
import viewStore from '../store/view';

export default defineComponent({
    name: "Sidebar",
    components: {
        Menu
    },
    data(){
        return {
            isMenuShow: false
        };
    },
    mounted(){
        viewStore.handler = (isMenuButtonClicked: boolean) => {
            this.isMenuShow = isMenuButtonClicked;
        };
    }
});
</script>

<style lang="scss" scoped>
.sidebar-wrapper {
    .menu{
        padding-top: 50px;
    }
    min-height: 100vh;
    background-color: #fff;
    box-shadow: 0px 1px 2px 2px rgba(0, 0, 0, 0.5);
}
</style>
