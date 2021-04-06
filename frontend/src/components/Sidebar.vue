<template>
    <div class="sidebar-wrapper ml-3">
        <aside class="menu">
            <div class="ml-5 mt-4 is-hidden-desktop touch-info">
                <div class="is-centered">
                    <FlashIcon/>
                </div>
            </div>
            <div class="mb-5">
                <div class="menu-label is-size-6 mt-3">
                    <fontawesome icon="coffee" />ルーム
                    <div class="is-pulled-right is-clickable">
                        <router-link to="/room">
                            <fontawesome icon="plus-square" />追加
                        </router-link>
                    </div>
                </div>
                <ul class="menu-list">
                    <li v-for="room in rooms" :key="room.room_id">
                        <router-link :to="/talk/ + room.room_id">
                            <span class>{{room.name}}</span>
                        </router-link>
                    </li>
                </ul>
            </div>
            <div class="menu-label is-size-6 mt-3">
                <fontawesome icon="user" />メンバー
            </div>
            <ul class="menu-list" v-if="users.length > 0">
                <li v-for="user in users" :key="user.id">
                    <router-link :to="/talk/ + user.room_id + '-' + me.id">
                        <fontawesome
                            :class="{'login-color': user.isLogin,'logout-color': !user.isLogin}"
                            icon="circle"
                        />
                        <span class="ml-1">{{user.name}}</span>
                    </router-link>
                </li>
            </ul>
            <div class="is-pulled-left mt-5">
                <div class>
                    <div class="buttons">
                        <a class="button is-size-7" @click="logout">ログアウト</a>
                    </div>
                </div>
            </div>
        </aside>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import user from "../Domain/User/User";
import AcceptUsersObserver from "../Domain/User/Observer/AcceptUsersObserver";
import LogoutObserver from "../Domain/User/Observer/LogoutObserver";
import AnotherUserLoginObserver from "../Domain/User/Observer/AnotherUserLoginObserver";
import FlashIcon from './FlashIcon.vue';
import AcceptRoomsObserver from '../Domain/Room/Observer/AcceptRoomsObserver';
import room from '../Domain/Room/Room';

export default defineComponent({
    name: "Sidebar",
    data() {
        return {
            me: user.me.user,
            users: [] as User[],
            rooms: [] as any[]
        };
    },
    components: {
        FlashIcon
    },
    methods: {
        async logout() {
            await user.logout(this.me.id, user.me.credentials);
            this.$router.push({ name: "Login" });
        }
    },
    async mounted() {
        AcceptUsersObserver.handler = (users: any[]) => {
            this.users = users;
        };
        AcceptRoomsObserver.handler = (rooms: any[]) => {
            this.rooms = rooms;
        };
        LogoutObserver.handler = (id: string) => {
            this.users = this.users.map((user: User) => {
                if (user.id == id) {
                    user.isLogin = false;
                }
                return user;
            });
        };
        AnotherUserLoginObserver.handler = (loginUser: User) => {
            this.users = this.users.map((user: User) => {
                if (user.id == loginUser.id) {
                    user.isLogin = true;
                }
                return user;
            });
        };
        //ユーザーデータ送信要求
        user.getUsers();
        //ルームデータ送信要求
        room.getAllRooms(user.me.user.id);
    }
});
</script>

<style lang="scss" scoped>
.menu {
    position: fixed;
    top: 50px;
}
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
.login-color {
    color: #01d1b2;
}
.logout-color {
    color: #7a7a7a;
}
.touch-info {
    width: 200px;
    margin-top: 50px;
    text-align: center;
}
</style>
