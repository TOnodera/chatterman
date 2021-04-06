<template>
    <div class="talk-input">
        <div class="columns is-centered chat-wrapper">
            <div class="column is-four-fifths">
                <template v-for="message in messages">
                    <ChatRight
                        v-if="message.user_id == user_id"
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
                <Typing :class="{'is-hidden': !isTyping}" :user_name="typingUser" />
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
import AcceptMessageObserver from "../Domain/Message/Observer/AcceptMessageObserver";
import TypingEventObserver from "../Domain/Message/Observer/TypingEventObserver";
import { defineComponent } from "vue";
export default defineComponent({
    name: "Talk",
    components: {
        ChatLeft,
        ChatRight,
        InputArea,
        Typing
    },
    data() {
        return {
            messages: [] as any[],
            isTyping: false,
            typingUser: "",
            current_room: "",
            user_id: user.me.user.id,
            typingTimer: 3000 //タイピングアイコンの表示時間
        };
    },
    methods: {
        send(msg: string) {
            message.send(msg, user.me.user, this.current_room);
        },
        typing() {
            message.typing(user.me.user);
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
                    message.requireMoreMessages(this.current_room);
                }
            };
        }
    },
    mounted() {
        this.current_room = this.$route.params.room_id as string;
        //ユーザーがこのroomに入場できるか検証
        room.attemptToEnter(this.current_room as string, user.me.user);
        //メッセージ受信時の処理
        AcceptMessageObserver.handler = (messages: any[]) => {
            this.messages = messages.filter(
                message => message.room_id == this.current_room
            );
        };
        //タイピングイベント受信時の処理
        TypingEventObserver.handle = (user: User) => {
            if (this.isTyping == false) {
                this.isTyping = true;
                this.typingUser = user.name;
                const id = setTimeout(() => {
                    this.isTyping = false;
                    clearTimeout(id);
                }, this.typingTimer);
            }
        };
        message.requireFirstMessages(this.current_room);
        this.observeScrollTopEvent();
        this.toBottom();
    },
    watch: {
        $route(to, from) {
            if (this.includeTalkroomPath(to.path)) {
                console.log("room changed...");
                //前のルームのメッセージを削除
                message.clearMessages(this.current_room);
                this.messages = [];
                //新しいroom_idを設定
                this.current_room = this.$route.params.room_id as string;
                //退出処理（いらないかもしれない、あとでけすかも）
                if (this.includeTalkroomPath(from.path)) {
                    room.leaveCurrent(user.me.user);
                }
                room.attemptToEnter(this.current_room,user.me.user);
                message.requireFirstMessages(this.current_room);
            }
        }
    }
});
</script>
