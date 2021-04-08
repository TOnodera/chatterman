<template>
    <div class="app-wrapper">
        <div class="app-header">
            <Header/>
        </div>
        <div class="app-contents">
            <router-view/>
        </div>
        <div class="app-footer">
            <Footer />
        </div>
    </div>
</template>

<script lang="ts">
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import { launchAtAppUped } from './Domain/Listener';
import { emitAtAppUped } from './Domain/InitEmitter';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  components: {
    Header,
    Footer
  },
  mounted() {
    emitAtAppUped();//アプリ起動時に送信するイベント
    launchAtAppUped();//アプリ起動時に起動するリスナ
  }
});
</script>

<style lang="scss" scoped>
.app-wrapper {
    .app-header {
        position: relative;
    }
    .app-contents {
        min-height: 100vh;
    }
    .app-footer {
        box-shadow: -1px 0px 2px 2px rgba(0, 0, 0, 0.5);
        position: relative;
    }
}
</style>
