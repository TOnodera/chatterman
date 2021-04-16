<template>
    <div class="another-users-message-wrapper">
        <div class="another-users-message">
            <div>
                <p class="another-users-comment has-text-white has-background-info">{{message}}</p>
                <p class="user-info is-size-7">
                    <span>{{user_name}}</span>
                    <span>{{created_at}}</span>
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AnotherUserMessage',
  props: ['message', 'user_name', 'created_at']
});
</script>

<style lang="scss" scope>
.another-users-message-wrapper {
    display: flex;
    justify-content: flex-start;
    .another-users-message {
        display: flex;
        justify-content: flex-start;
        margin-bottom: 20px;
        width: 50%;
        .user-info {
            white-space: nowrap;
            span {
                display: inline-block;
                margin-left: 10px;
            }
        }
        .another-users-comment {
            word-break: break-all;
            border-radius: 10px;
            padding: 10px;
        }
    }
}
</style>
