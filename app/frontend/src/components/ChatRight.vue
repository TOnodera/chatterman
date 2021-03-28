<template>
    <div class="right-balloon-wrapper">
        <div class="balloon1-right">
            <p>こんにちは。これは例です。こんにちは。これは例です。</p>
        </div>
        <div class="info">
            <p>yu-za-mei</p>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ChatRight'
});
</script>

<style lang="scss">
.right-balloon-wrapper {
    display: flex;
    justify-content: flex-end;
    .info {
        display: flex;
        justify-content: center; /*左右中央揃え*/
        align-items: center;
    }
}
.balloon1-right {
    position: relative;
    display: inline-block;
    margin: 1.5em 15px 1.5em 0;
    padding: 7px 10px;
    min-width: 120px;
    max-width: 100%;
    color: #555;
    font-size: 16px;
    background: #daefd8;
}
.balloon1-right:before {
    content: "";
    position: absolute;
    top: 50%;
    left: 100%;
    margin-top: -15px;
    border: 15px solid transparent;
    border-left: 15px solid #daefd8;
}
.balloon1-right p {
    margin: 0;
    padding: 0;
}
</style>
