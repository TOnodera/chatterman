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
                                            v-model="email"
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
                                            v-model="password"
                                        />
                                        <span class="icon is-small is-left">
                                            <i class="fas fa-lock"></i>
                                        </span>
                                    </p>
                                </div>
                                <div class="buttons is-pulled-right">
                                    <button
                                        class="button is-primary"
                                        @click="attempt"
                                    >
                                        ログイン
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

<script>
/*
import userStore from '@/store/User';
import Const from '@/util/Const';
*/
export default {
    name: "Login",
    /*
    data() {
        return {
            email: null,
            password: null,
        };
    },
    methods: {
        async attempt() {
            try{
                const result = await userStore.loginAttempt(this.email,this.password);
                if(result){
                    localStorage.login = Const.LOGIN_VALUE;
                    this.$router.push({name: 'DashBoard'});
                }
            }catch(e){
                this.$swal(e.message);
            }

        },
    },
    */
};
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