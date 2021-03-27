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
        <div class="input-wrapper">
            <div class="input-area columns is-centered m-0">
                <div class="textarea column">
                    <textarea class="textarea is-primary" rows="1"></textarea>
                    <button type="button" class="button is-primary is-pulled-right mt-2">送信</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import ChatLeft from "../components/ChatLeft.vue";
import ChatRight from "../components/ChatRight.vue";
import { defineComponent } from "vue";
export default defineComponent({
    name: "Talk",
    components: {
        ChatLeft,
        ChatRight,
    },
});
</script>

<style lang="scss">
.input-area {
    width: 100%;
    position: fixed;
    bottom: 0;
    right: 0;
    z-index: 100;
    .button-column {
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>