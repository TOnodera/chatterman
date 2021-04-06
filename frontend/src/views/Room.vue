<template>
    <div>
        <div class="columns is-centered">
            <div class="column is-half">
                <div class="field">
                    <h2 class="is-size-5 mt-5 mb-2">ルーム作成画面</h2>
                    <p class="mb-2">ルーム名を入力して登録ボタンを押して下さい。</p>
                    <div class="control">
                        <input class="input" type="text" placeholder="ルーム名" v-model="name"/>
                    </div>
                </div>
                <div class="field is-grouped">
                    <div class="control">
                        <button class="button is-link" @click="register">登録</button>
                    </div>
                    <div class="control">
                        <button class="button is-link is-light" @click="cancel">キャンセル</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import swal from '../util/swal';
import room from '../Domain/Room/Room';
import user from '../Domain/User/User';

export default defineComponent({
  name: 'User',
  data(){
      return {
          name: ''
      };
  },
  methods: {
      cancel(){
          this.$router.go(-1);
      },
      register(){
          if(!this.name){
              swal.fire('ルーム名を入力して下さい。');
              return;
          }
          room.createRoom(this.name,user.me.user.id);
      }
  }
});
</script>
