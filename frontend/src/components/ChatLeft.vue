<template>
    <div class="left-balloon-wrapper">
        <div class="balloon1-left">
            <p>{{message}}</p>
        </div>
        <div class="info">
            <p class="is-size-7">{{user_name}}<br><span>{{created_at}}</span></p>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "ChatLeft",
    props: ["message", "user_name", "created_at"]
});
</script>

<style lang="scss">
.left-balloon-wrapper {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-end;
    p {
        word-break: break-word;
        white-space: pre-wrap;
    }
    .info {
        display: flex;
        justify-content: center; /*左右中央揃え*/
        align-items: center;
    }
}
.balloon1-left {
    position: relative;
    display: inline-block;
    margin: 1.5em 0 1.5em 15px;
    padding: 7px 10px;
    min-width: 120px;
    max-width: 100%;
    color: #555;
    font-size: 16px;
    background: #e0edff;
}

.balloon1-left:before {
    content: "";
    position: absolute;
    top: 50%;
    left: -30px;
    margin-top: -15px;
    border: 15px solid transparent;
    border-right: 15px solid #e0edff;
}

.balloon1-left p {
    margin: 0;
    padding: 0;
}
</style>
