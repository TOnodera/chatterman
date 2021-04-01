<template>
    <div class="app-wrapper">
        <div class="app-header">
            <Header @menu-clicked="menuClicked" />
        </div>
        <div class="app-contents">
            <router-view :isMenuClicked="isClicked" />
        </div>
        <div class="app-footer">
            <Footer />
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import serverException from '@/Domain/Exception/ServerException';

export default {
  name: 'App',
  components: {
    Header,
    Footer
  },
  data () {
    return {
      isClicked: false
    };
  },
  methods: {
    menuClicked (isClicked) {
      this.isClicked = isClicked;
    }
  },
  mounted() {
    //サーバーから送信される例外のリスナー
    serverException.launchListener(); 
  }
};
</script>

<style lang="scss" scoped>
.app-wrapper {
    .app-header {
        box-shadow: 1px 0px 2px 2px rgba(0, 0, 0, 0.5);
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
