<template>
    <div class="sidebar-wrapper ml-3">
        <aside class="menu">
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
                    <li>
                        <router-link to="/talk/everybody">
                            <span class>ミーティングルーム</span>
                        </router-link>
                    </li>
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
                    <router-link :to="/talk/ + user.id">
                        <fontawesome :class="{'login-color': user.isLogin,'logout-color': !user.isLogin}" icon="circle" />
                        <span class="ml-1">{{user.name}}</span>
                    </router-link>
                </li>
            </ul>
        </aside>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import user from "../Domain/User/User";
import acceptUsersObserver from "../Domain/User/Observer/AcceptUsersObserver";
import room from '../Domain/Room';
import logoutObserver from '../Domain/User/Observer/LogoutObserver';
import anotherUserLoginObserver from '../Domain/User/Observer/AnotherUserLoginObserver';

export default defineComponent({
    name: "Sidebar",
    data() {
        return {
            users: [] as User[],
            rooms: [] as any[]
        };
    },
    mounted() {
        acceptUsersObserver.handler = (users: any[]) => {
            this.users = users;
        };
        room.acceptRoomsListener((rooms: any[])=>{
            this.rooms = rooms;
        });
        logoutObserver.handler = (id: string) => {
            this.users = this.users.map((user: User)=>{
                if(user.id == id){
                    user.isLogin = false;
                }
                return user;
            });
        };
        anotherUserLoginObserver.handler = (logoutUser: User)=>{
            this.users = this.users.map((user: User)=>{
                if(user.id == logoutUser.id){
                    user.isLogin = true;
                }
                return user;
            });
        };
        user.getUsers();
        room.getAllRooms(user.me.user.id);
    }
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
.login-color {
    color: #01d1b2;
}
.logout-color {
    color: #7a7a7a;
}
</style>
