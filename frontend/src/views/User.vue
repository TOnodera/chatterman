<template>
    <div class="app-contents">
        <div class="dashboard-wrapper columns">
            <div class="dashboard-content column">
                <div class="columns is-centered">
                    <div class="column mt-5">
                        <div>
                            <div class="columns mt-5 is-centered">
                                <div class="column is-half">
                                    <div class="field">
                                        <label class="label">ユーザー名</label>
                                        <div class="control">
                                            <input class="input" type="text" placeholder="ユーザー名" v-model="newUser.name"/>
                                        </div>
                                    </div>

                                    <div class="field">
                                        <label class="label">メールアドレス</label>
                                        <div class="control has-icons-left has-icons-right">
                                            <input class="input" type="text" placeholder="Email" v-model="newUser.credentials.email"/>
                                            <span class="icon is-small is-left">
                                                <fontawesome icon="user" />
                                            </span>
                                        </div>
                                        <!--<p class="help is-success">This username is available</p>-->
                                    </div>

                                    <div class="field">
                                        <label class="label">パスワード</label>
                                        <div class="control has-icons-left has-icons-right">
                                            <input
                                                class="input"
                                                type="email"
                                                placeholder="Email input"
                                                v-model="newUser.credentials.password"
                                            />
                                            <span class="icon is-small is-left">
                                                <fontawesome icon="key" />
                                            </span>
                                        </div>
                                        <!--<p class="help is-danger">This email is invalid</p>-->
                                    </div>

                                    <div class="field is-grouped is-pulled-right">
                                        <div class="control">
                                            <button class="button is-link" @click="register">登録</button>
                                        </div>
                                        <div class="control">
                                            <button class="button is-link is-light" @click="toLoginPage">キャンセル</button>
                                        </div>
                                    </div>
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
import swal from '../util/swal';
import user from '../Domain/User/User';
import { defineComponent } from 'vue';
import RegisterObserver from '../Domain/User/Observer/RegisterObserver';

export default defineComponent({
  name: 'User',
  data () {
    return {
      newUser: {
        name: '',
        credentials: {
          email: '',
          password: ''
        }
      } as UserRegisteInfo
    };
  },
  methods: {
    toLoginPage () {
      this.$router.push({ name: 'Login' });
    },
    register () {
      user.registe(this.newUser);
    }
  },
  mounted () {
    RegisterObserver.handler = (msg: string)=>{ 
        swal.fire(msg);
        this.$router.push({name: 'Login'});
    };
  }
});
</script>
