<template>
    <div class="app-contents">
        <div class="dashboard-wrapper columns">
            <div class="dashboard-content column">
                <div class="columns is-centered">
                    <div class="column mt-5">
                        <div class="login-wrapper">
                            <div class="login-contents">
                                <h1 class="subtitle">ログインして下さい。</h1>
                                <div class="field">
                                    <p
                                        class="control has-icons-left has-icons-right"
                                    >
                                        <input
                                            class="input"
                                            type="email"
                                            placeholder="Email"
                                            v-model="credentials.email"
                                        />
                                        <span class="icon is-small is-left">
                                            <i class="fas fa-envelope"></i>
                                        </span>
                                        <span class="icon is-small is-right">
                                            <i class="fas fa-check"></i>
                                        </span>
                                    </p>
                                </div>
                                <div class="field">
                                    <p class="control has-icons-left">
                                        <input
                                            class="input"
                                            type="password"
                                            placeholder="Password"
                                            v-model="credentials.password"
                                        />
                                        <span class="icon is-small is-left">
                                            <i class="fas fa-lock"></i>
                                        </span>
                                    </p>
                                </div>
                                <div class="buttons is-pulled-right">
                                    <button
                                        class="button is-primary"
                                        @click="attempt">
                                        ログイン
                                    </button>
                                </div>
                                <div class="buttons is-pulled-right mr-2">
                                    <button
                                        class="button is-info"
                                        @click="toRegisterPage"
                                    >
                                        登録
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import user from '../Domain/User';
import swal from '../util/swal';

export default defineComponent({
  name: 'Login',
  data () {
    return {
      credentials: {
          email: '',
          password: ''
      } as Credentials
    };
  },
  methods: {
    async attempt () {
        user.attemptLogin(this.credentials);
    },
    toRegisterPage () {
      this.$router.push({ name: 'User' });
    }
  },
  mounted(){
      user.addLoginSuccessHandler(()=>{
          console.log(user.me.isLogin);
          swal.fire('ログインしました。');
          this.$router.push({name: 'Talk' ,params: {room_id: 'everybody'}});
      });
      user.addLoginFailureHandler(()=>{
          swal.fire('ログイン情報が間違っています。');
      });
  }
});
</script>

<style lang="scss">
.login-wrapper {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    .login-contents {
        background-color: #fff;
        padding: 30px;
    }
}
</style>
