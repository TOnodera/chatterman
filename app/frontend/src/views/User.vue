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
                                            <input class="input" type="text" placeholder="ユーザー名" v-model="name"/>
                                        </div>
                                    </div>

                                    <div class="field">
                                        <label class="label">メールアドレス</label>
                                        <div class="control has-icons-left has-icons-right">
                                            <input class="input" type="text" placeholder="Email" v-model="email"/>
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
                                                v-model="password"
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
import io from 'socket.io-client';
import swal from '../util/swal';
import userStore from '../store/user';
import { defineComponent } from 'vue';
export default defineComponent({
    name: "User",
    data(){
        return {
            name: '',
            email: '',
            password: ''
        };
    },
    methods: {
        toLoginPage(){
            this.$router.push({name: 'Login'});
        },
        register(){
            if(!this.name){
                swal.fire('ユーザー名が未入力です。');
                return;
            }
            if(!this.email){
                swal.fire('メールアドレスが未入力です。');
                return;
            }
            if(!this.password){
                swal.fire('パスワードが未入力です。');
                return;
            }
            const registInfo = {
                name: this.name,
                credentials: {
                    email: this.email,
                    password: this.password
                }
            };
            userStore.registe(registInfo);
        }
    },
    mounted() {
        userStore.addRegisterExceptionHandler((msg: string)=>swal.fire(msg));
    },
});
</script>