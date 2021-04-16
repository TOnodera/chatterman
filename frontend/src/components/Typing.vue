<template>
    <div class="left-balloon-wrapper" :class="{'is-hidden': !isTyping}">
        <div class="balloon1-left">
            <p>{{text}}{{dot}}</p>
        </div>
        <div class="info">
            <p class="is-size-7">{{typingUser}}</p>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import room from '../Domain/Room/Room'
import typingEventObserver from '../Domain/Message/Observer/TypingEventObserver'

export default defineComponent({
  name: 'Typing',
  data () {
    return {
      text: '入力中',
      dot: '',
      isTyping: false,
      typingUser: '',
      typingTimer: 3000 // タイピングアイコンの表示時間
    }
  },
  mounted () {
    // 「入力中...」の表示
    let count = 1
    setInterval(() => {
      this.dot += '.'
      if (count > 4) {
        this.dot = ''
        count = 0
      }
      count++
    }, 300)

    // タイピングイベント受信時の処理
    typingEventObserver.handle = (info: {user_name: string, room_id: string}) => {
      if (this.isTyping == false && room.current == info.room_id) {
        this.isTyping = true
        this.typingUser = info.user_name
        const id = setTimeout(() => {
          this.isTyping = false
          clearTimeout(id)
        }, this.typingTimer)
      }
    }
  }
})
</script>

<style lang="scss">
.left-balloon-wrapper {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-end;
    .info {
        display: flex;
        justify-content: center; /*左右中央揃え*/
        align-items: center;
    }
}
.balloon1-left {
    position: relative;
    display: inline-block;
    margin: 1.5em 0 1.5em 15px;
    padding: 7px 10px;
    min-width: 120px;
    max-width: 100%;
    color: #555;
    font-size: 16px;
    background: #e0edff;
}

.balloon1-left:before {
    content: "";
    position: absolute;
    top: 50%;
    left: -30px;
    margin-top: -15px;
    border: 15px solid transparent;
    border-right: 15px solid #e0edff;
}

.balloon1-left p {
    margin: 0;
    padding: 0;
}
</style>
