<template>
    <div class="talk-input">
        <div class="columns is-centered chat-wrapper">
            <div class="column is-four-fifths">
                <div v-for="message in messages" :key="message.id">

                    <!--
                    <MyMessage
                        v-if="message.user_id == this_user.me.user.id"
                        :message="message.message"
                        :user_name="message.user_name"
                        :key="message.message_id"
                        :created_at="message.created_at"
                    />
                    <AnotherUserMessage
                        v-else
                        :message="message.message"
                        :user_name="message.user_name"
                        :key="message.message_id"
                        :created_at="message.created_at"
                    />
                    -->

                    <SystemMessage
                        :message="message.message"
                        :user_name="message.user_name"
                        :key="message.message_id"
                        :created_at="message.created_at"
                    />

                </div>
                <Typing/>
            </div>
        </div>
        <InputArea @message-send="send" @typing="typing" />
    </div>
</template>

<script lang="ts">
import AnotherUserMessage from "../components/AnotherUserMessage.vue";
import MyMessage from "../components/MyMessage.vue";
import SystemMessage from "../components/SystemMessage.vue";
import InputArea from "../components/InputArea.vue";
import Typing from "../components/Typing.vue";
import user from "../Domain/User/User";
import message from "../Domain/Message/Message";
import room from "../Domain/Room/Room";
import acceptMessageObserver from "../Domain/Message/Observer/AcceptMessageObserver";
import arrowedToEnterRoomObserver from "../Domain/Room/Observer/ArrowedToEnterRoomObserver";
import deniedToEnterRoomObserver from "../Domain/Room/Observer/DeniedToEnterRoomObserver";
import {onScroll,toBottom} from '../util/window';
import apply from '../Domain/Apply/Apply';

import { defineComponent } from "vue";

export default defineComponent({
    name: "TalkRoom",
    components: {
        AnotherUserMessage,
        MyMessage,
        SystemMessage,
        InputArea,
        Typing
    },
    data() {
        return {
            messages: [] as any[],
            this_user: user
        };
    },
    methods: {
        send(msg: string) {
            message.send(msg, user.me.user, room.current);
        },
        typing() {
            message.typing(user.me.user,room.current);
        },
        includeTalkroomPath(path: string) {
            return new RegExp(/^\/talk/).test(path);
        },
        observeScrollTopEvent(room_id: string) {
            window.onscroll = () => onScroll(room_id);
        },
        clear(room_id: string){
            message.clearMessages(room_id);
            this.messages = [];
        }
    },
    mounted() {

        //ユーザーがこのroomに入場できるか検証
        const room_id = this.$route.params.room_id ? this.$route.params.room_id as string : room.current;
        room.attemptToEnter(room_id, user.me.user);

        //入場出来る場合の処理
        arrowedToEnterRoomObserver.handler = (room_id: string)=>{
            message.requireFirstMessages(room_id);
        };

        //入場出来ない場合の処理
        deniedToEnterRoomObserver.handler = (target_id: string)=>{
            const basicInfo: UserBasicInfo = { user: user.me.user, credentials: user.me.credentials};
            apply.showApplyForm(target_id,basicInfo);
            this.$router.push({name: 'TalkRoom',params: {room_id: 'everybody'}});
        };

        //メッセージ受信時の処理
        acceptMessageObserver.handler = (messages: any[]) => {
            this.messages = messages.filter(
                message => message.room_id == room.current
            );
        };

        //スクロールが最上部まで到達したか監視 到達したらメッセージ追加要求イベント発動
        this.observeScrollTopEvent(room_id);
        //入場したら最下部に移動
        toBottom();

    },
    watch: {
        $route(to) {
            if (this.includeTalkroomPath(to.path)) {
                const room_id: string = this.$route.params.room_id as string;
                this.clear(room_id);
                room.attemptToEnter(room_id,user.me.user);
            }
        }
    },
    unmounted(){
        message.deleteAll();
    }
});
</script>
