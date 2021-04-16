<template>
    <div class="is-clickable" @click="clicked">
        <fontawesome class="info-icon" icon="info-circle" />
        <span class="info-title">お知らせ</span>
    </div>
</template>

<script>
export default {
  name: 'FlashIcon',
  methods: {
    clicked () {
      this.$emit('info-clicked');
    }
  }
};
</script>

<style lang="scss">
.info-icon {
    color: #3e8ed0;
    animation: flash 2s linear infinite;
}
.info-title{
    font-weight: bold;
}
@keyframes flash {
    0% {
        opacity: 1;
    }
    50% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
</style>
