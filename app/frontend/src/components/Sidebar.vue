<template>
    <div class="sidebar-wrapper ml-3">
        <aside class="menu">
            <div class="mb-5">
                <div class="menu-label is-size-6 mt-3">
                    <fontawesome icon="coffee" />ルーム
                    <div class="is-pulled-right is-clickable">
                        <router-view to="/room">
                            <fontawesome icon="plus-square" />追加
                        </router-view>
                    </div>
                </div>
                <ul class="menu-list">
                    <li>
                        <router-link to="/talk">
                            <span class>あああ</span>
                        </router-link>
                    </li>
                </ul>
            </div>
            <div class="menu-label is-size-6 mt-3">
                <fontawesome icon="user" />メンバー
            </div>
            <ul class="menu-list">
                <li>
                    <router-link to="/">
                        <span class="ml-1">あああ</span>
                    </router-link>
                </li>
                <li>
                    <router-link to="/">
                        <fontawesome class="login-color" icon="circle"/>
                        <span class="ml-1">いいい</span>
                    </router-link>
                </li>
            </ul>
        </aside>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
    name: "Sidebar",
});
</script>

<style lang="scss" scoped>
.sidebar-wrapper {
    min-height: 100vh;
    background-color: #fff;
    box-shadow: 0px 1px 2px 2px rgba(0, 0, 0, 0.5);
}
.menu-list {
    a {
        transition: all 300ms 0s ease;
        &:hover {
            background-color: rgba(0, 0, 0, 0.2);
        }
    }
}
.login-color{
    color: #01d1b2;
}
</style>