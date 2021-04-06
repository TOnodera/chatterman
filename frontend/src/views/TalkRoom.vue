<template>
    <div class="talk-input">
        <div class="columns is-centered chat-wrapper">
            <div class="column is-four-fifths">
                <template v-for="message in messages">
                    <ChatRight
                        v-if="message.user_id == user.me.user.id"
                        :message="message.message"
                        :user_name="message.user_name"
                        :key="message.message_id"
                        :created_at="message.created_at"
                    />
                    <ChatLeft
                        v-else
                        :message="message.message"
                        :user_name="message.user_name"
                        :key="message.message_id"
                        :created_at="message.created_at"
                    />
                </template>
                <Typing :user_name="typingUserInfo.user_name" :room_id="typingUserInfo.room_id"/>
            </div>
        </div>
        <InputArea @message-send="send" @typing="typing" />
    </div>
</template>

<script lang="ts">
import ChatLeft from "../components/ChatLeft.vue";
import ChatRight from "../components/ChatRight.vue";
import InputArea from "../components/InputArea.vue";
import Typing from "../components/Typing.vue";
import user from "../Domain/User/User";
import message from "../Domain/Message/Message";
import room from "../Domain/Room/Room";
import acceptMessageObserver from "../Domain/Message/Observer/AcceptMessageObserver";
import typingEventObserver from "../Domain/Message/Observer/TypingEventObserver";
import arrowedToEnterRoomObserver from "../Domain/Room/Observer/ArrowedToEnterRoomObserver";
import deniedToEnterRoomObserver from "../Domain/Room/Observer/DeniedToEnterRoomObserver";
import swal from '../util/swal';

import { defineComponent } from "vue";

export default defineComponent({
    name: "TalkRoom",
    components: {
        ChatLeft,
        ChatRight,
        InputArea,
        Typing
    },
    data() {
        return {
            messages: [] as any[],
            user: user,
            typingUserInfo: {
                user_name: '',
                room_id: ''
            }
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
        toBottom() {
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                left: 0
            });
        },
        observeScrollTopEvent() {
            window.onscroll = () => {
                const scrollTop = document.documentElement.scrollTop;
                if (scrollTop == 0) {
                    message.requireMoreMessages(room.current);
                }
            };
        },
        clear(room_id: string){
            message.clearMessages(room_id);
            this.messages = [];
        }
    },
    mounted() {
        //ユーザーがこのroomに入場できるか検証
        room.attemptToEnter(this.$route.params.room_id as string, user.me.user);
        //入場出来る場合の処理
        arrowedToEnterRoomObserver.handler = (room_id: string)=>{
            console.log("入室許可...");
            message.requireFirstMessages(room_id);
        };
        //入場出来ない場合の処理
        deniedToEnterRoomObserver.handler = (msg: string)=>{
            swal.fire(msg);
            this.$router.back();
        };
        //メッセージ受信時の処理
        acceptMessageObserver.handler = (messages: any[]) => {
            this.messages = messages.filter(
                message => message.room_id == room.current
            );
        };
        //タイピングイベント受信時の処理
        typingEventObserver.handle = (info: {user_name: string,room_id: string}) => {
            this.typingUserInfo = info;
        };
        //スクロールが最上部まで到達したか監視
        this.observeScrollTopEvent();
        //入場したら最下部に移動
        this.toBottom();
    },
    watch: {
        $route(to,from) {
            if (this.includeTalkroomPath(to.path)) {
                const room_id: string = this.$route.params.room_id as string;
                this.clear(room_id);
                console.log(from);
                console.log('before room.attemptToEnter...');
                room.attemptToEnter(room_id,user.me.user);
            }
        }
    },
    unmounted(){
        message.deleteAll();
    }
});
</script>
