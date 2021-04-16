<template>
    <div class="my-message-wrapper">
        <div class="my-message">
            <div>
                <p class="my-comment has-text-white has-background-primary">{{message}}</p>
                <p class="user-info is-size-7">
                    <span>{{user_name}}</span>
                    <span>{{created_at}}</span>
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MyMessage',
  props: ['message', 'user_name', 'created_at']
})
</script>

<style lang="scss" scope>
.my-message-wrapper {
    display: flex;
    justify-content: flex-end;
    .my-message {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 20px;
        max-width: 50%;
        .user-info {
            white-space: nowrap;
            span {
                display: inline-block;
                margin-left: 10px;
            }
        }
        .my-comment {
            word-break: break-all;
            border-radius: 10px;
            padding: 10px;
        }
    }
}
</style>
