<template>
    <div class="input-wrapper">
        <div class="input-area columns is-centered m-0">
            <div class="textarea column">
                <textarea class="textarea is-primary" rows="1" v-model="message" @keyup="typing"></textarea>
                <button
                    type="button"
                    class="button is-primary is-pulled-right mt-2"
                    @click="send"
                >送信</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'InputArea',
    data(){
        return {
            message: ''
        };
    },
    methods: {
        send(){
            this.$emit('message-send',this.message);
            this.message = '';
        },
        typing(){
            this.$emit('typing');
        }
    },
};
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
