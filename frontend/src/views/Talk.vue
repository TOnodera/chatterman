<template>
    <div class="talk-input">
        <div class="columns is-centered chat-wrapper">
            <div class="column is-four-fifths">
                <ChatLeft />
                <ChatRight />
                <ChatLeft />
                <ChatRight />
            </div>
        </div>
        <InputArea @message-send="send" />
    </div>
</template>

<script lang="ts">
import ChatLeft from "../components/ChatLeft.vue";
import ChatRight from "../components/ChatRight.vue";
import InputArea from "../components/InputArea.vue";
import user from "../Domain/User";
import message from "../Domain/Message";
import room from "../Domain/Room";

import { defineComponent } from "vue";
export default defineComponent({
    name: "Talk",
    components: {
        ChatLeft,
        ChatRight,
        InputArea
    },
    data() {
        return {
            room_id: "" as any
        };
    },
    methods: {
        send(msg: string) {
            message.send(
                msg,
                user.me.user,
                this.$route.params.room_id as string
            );
        }
    },
    mounted() {
        console.log(this.room_id);
        //ユーザーがこのroomに入場できるか検証
        //OKならjoinイベントを発生させる。
        room.attemptToEnter(this.$route.params.room_id as string, user.me.user);
        //user.isEnterable()?
        //退出した場合は退出イベントを発生させる
        //user.hasLeft()?
    },
    watch: {
        $route(to, from) {
            const regExp = new RegExp(/^\/talk/);
            console.log(to.path, from.path);
            if (regExp.test(to.path)) {
                if (regExp.test(from.path)) {
                    room.leaveCurrent(user.me.user);
                }
                room.attemptToEnter(
                    this.$route.params.room_id as string,
                    user.me.user
                );
            }
        }
    }
});
</script>
