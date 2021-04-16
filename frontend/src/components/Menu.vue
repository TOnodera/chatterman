<template>
    <aside class="menu">
        <div class="ml-5 mt-4 touch-info">
            <div
                class="is-centered"
                :class="{ 'is-hidden': isHiddenFlashIcon }"
            >
                <FlashIcon @click="lookAtInformationRoom" />
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
                        <span class>{{ room.name }}</span>
                    </router-link>
                </li>
            </ul>
        </div>
        <div class="menu-label is-size-6 mt-3">
            <fontawesome icon="user" />メンバー
        </div>
        <ul class="menu-list" v-if="users.length > 0">
            <li v-for="user in users" :key="user.id">
                <router-link :to="/talk/ + user.room_id">
                    <fontawesome
                        :class="{
                            'login-color': user.isLogin,
                            'logout-color': !user.isLogin,
                        }"
                        icon="circle"
                    />
                    <span class="ml-1">{{ user.name }}</span>
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
</template>

<script lang="ts">
import { defineComponent } from "vue";
import user from "../Domain/User/User";
import AcceptUsersObserver from "../Domain/User/Observer/AcceptUsersObserver";
import LogoutObserver from "../Domain/User/Observer/LogoutObserver";
import AnotherUserLoginObserver from "../Domain/User/Observer/AnotherUserLoginObserver";
import FlashIcon from "./FlashIcon.vue";
import AcceptRoomsObserver from "../Domain/Room/Observer/AcceptRoomsObserver";
import NoticeObserver from "../Domain/Notice/Observer/NoticeObserver";
import swal from "../util/swal";

import room from "../Domain/Room/Room";
export default defineComponent({
    name: "Menu",
    props: ["test"],
    data() {
        return {
            me: user.me.user,
            users: [] as User[],
            rooms: [] as any[],
            isHiddenFlashIcon: true,
            // debug
            isMounted: false,
        };
    },
    components: {
        FlashIcon,
    },
    methods: {
        async logout() {
            await user.logout();
            this.$router.push({ name: "Login" });
        },
        lookAtInformationRoom() {
            swal.info("新しいお知らせを受信しています。確認して下さい。");
        },
    },
    async mounted() {
        this.isMounted = true;
        /**
         * イベントハンドラ設定
         */

        // 表示用メンバーデータ受信時の処理
        AcceptUsersObserver.handler = (users: any[]) => {
            this.users = users;
        };
        // 表示用ルームデータ受信時の処理
        AcceptRoomsObserver.handler = (rooms: any[]) => {
            this.rooms = rooms;
        };
        // ログアウトイベント受信時の処理
        LogoutObserver.handler = (id: string) => {
            this.users = this.users.map((user: User) => {
                if (user.id == id) {
                    user.isLogin = false;
                }
                return user;
            });
        };
        // 別のユーザーのログインイベントの処理
        AnotherUserLoginObserver.handler = (loginUser: User) => {
            this.users = this.users.map((user: User) => {
                if (user.id == loginUser.id) {
                    user.isLogin = true;
                }
                return user;
            });
        };
        // 新規お知らせメッセージ受信時
        NoticeObserver.handler = () => {
            this.isHiddenFlashIcon = false;
        };

        console.log("mounted: ", this.users, this.rooms, this.test);
    },
    updated() {
        console.log("updated: ", this.users, this.rooms, this.test);
    },
});
</script>

<style lang="scss" scoped>
.menu {
    .touch-info {
        width: 200px;
        text-align: center;
    }
    .menu-list {
        a {
            transition: all 300ms 0s ease;
            &:hover {
                background-color: rgba(0, 0, 0, 0.2);
            }
        }
        .login-color {
            color: #01d1b2;
        }
        .logout-color {
            color: #7a7a7a;
        }
    }
}
</style>
