<template>
    <div class="dashboard-wrapper columns">
        <div class="app-header">
            <Header/>
        </div>
        <Sidebar class="is-2"/>
        <div class="dashboard-content column is-10">
            <div class="columns is-centered">
                <div class="column mt-5">
                    <router-view />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Header from '@/components/Header.vue';
import Sidebar from '@/components/Sidebar.vue';
import { defineComponent } from 'vue';
import { launchAtLoggedIn as listen } from '../Domain/Listener';
import { emitAtLoggedIn } from '../Domain/InitEmitter';

export default defineComponent({
  name: 'Main',
  components: {
    Header,
    Sidebar
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
    padding-top: 40px !important; 
}    
</style>