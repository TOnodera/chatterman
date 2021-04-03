<template>
    <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <a class="navbar-item" href="https://bulma.io">
                <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28" />
            </a>

            <a
                role="button"
                class="navbar-burger"
                aria-label="menu"
                aria-expanded="false"
                data-target="navbarBasicExample"
                @click="toggleMenu"
                :class="{'is-active': isToggleMenu}"
            >
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>

        <div id="navbarBasicExample" class="navbar-menu">
            <div class="navbar-start">

            </div>

            <div class="navbar-end">
                <div class="navbar-item">
                    <div class="buttons">
                        <a class="button is-light" @click="logout">ログアウト</a>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import user from '../Domain/User/User';

export default defineComponent({
  name: 'Header',
  data () {
    return {
      isToggleMenu: false
    };
  },
  methods: {
    toggleMenu () {
      this.isToggleMenu = !this.isToggleMenu;
      this.$emit('menu-clicked', this.isToggleMenu);
    },
    async logout () {
      await user.logout(user.me.user.id,user.me.credentials);
      this.$router.push({name: 'Login'});
    }
  }
});
</script>
