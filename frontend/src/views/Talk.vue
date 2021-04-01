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
                    />
                    <ChatLeft
                        v-else
                        :message="message.message"
                        :user_name="message.user_name"
                        :key="message.message_id"
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
import user from "../Domain/User";
import message from "../Domain/Message";
import room from "../Domain/Room";

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
            message.send(msg, user.me.user, this.current_room as string);
        },
        typing() {
            message.typing(user.me.user);
        },
        includeTalkroomPath(path: string) {
            return (new RegExp(/^\/talk/)).test(path);
        },
        typingHandler(user: User){
            if (this.isTyping == false) {
                this.isTyping = true;
                this.typingUser = user.name;
                const id = setTimeout(() => {
                    this.isTyping = false;
                    clearTimeout(id);
                }, this.typingTimer);
            }
        }
    },
    mounted() {
        console.log("mounted...");
        this.current_room = this.$route.params.room_id as string;
        //ユーザーがこのroomに入場できるか検証
        room.attemptToEnter(this.current_room as string, user.me.user);
        //リスナ設定
        message.addAcceptMessageHandler((newMessages: any[]) => {
            this.messages = newMessages.filter(
                message => message.room_id == this.current_room
            );
        });
        //別のルームに移動した際に移動先のメッセージを取得
        message.addChangeRoomHandler((newMessages: any[]) => {
            this.messages = newMessages;
        });
        //タイピングイベント受信時の処理
        message.addTypingEventHandler(this.typingHandler);
    },
    destroyed(){
        console.log("destroyed...");
    },
    watch: {
        $route(to, from) {
            if (this.includeTalkroomPath(to.path)) {

                this.current_room = this.$route.params.room_id as string;

                if (this.includeTalkroomPath(from.path)) {
                    room.leaveCurrent(user.me.user);
                }

                //ルーム移動
                room.attemptToEnter(this.current_room, user.me.user);
                //移動先ルームのメッセージを取得する為のリスナ
                message.changeRoomListener(this.current_room);
                //再描画
                this.messages = this.messages.filter(
                    message => message.room_id == this.current_room
                );

            }
        }
    }
});
</script>
