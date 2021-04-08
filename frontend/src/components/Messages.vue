<template>
    <div>
        <div v-for="message in messages" :key="message.id">
            <MyMessage
                v-if="message.user_id == user_id"
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
        </div>
    </div>
</template>

<script>
import AnotherUserMessage from "../components/AnotherUserMessage.vue";
import MyMessage from "../components/MyMessage.vue";
export default {
    name: "Messages",
    components: {
        AnotherUserMessage,
        MyMessage
    },
    props: {
        messages: {
            type: Array
        },
        user_id: {
            type: String,required: true
        }
    }
};
</script>