<template>
    <div class="dashboard-wrapper columns">
        <Sidebar
            class="sidebar column"
            :class="{
                'is-hidden-touch is-2': !isMenuClicked,
                'is-4': isMenuClicked,
            }"
        />
        <div
            class="dashboard-content column"
            :class="{ 'is-8': isMenuClicked, 'is-10': !isMenuClicked }"
        >
            <div class="columns is-centered">
                <div class="column mt-5">
                    <router-view />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Sidebar from '@/components/Sidebar.vue';
import { defineComponent } from 'vue';
import { launchAtLoggedIn as listen } from '../Domain/Listener';
import { emitAtLoggedIn } from '../Domain/InitEmitter';

export default defineComponent({
  name: 'Main',
  components: {
    Sidebar
  },
  props: {
    isMenuClicked: {
      type: Boolean, reuqired: true
    }
  },
  mounted() {
      //ログイン後に送信するイベント
      emitAtLoggedIn();
      //ログイン後に必要になるサーバーからイベントリスナ設定
      listen();
  },
});
</script>

<style lang="scss">
.dashboard-content{
    margin-top: 50px;
}    
</style>