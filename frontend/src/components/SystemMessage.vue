<template>
    <div class="system-message-wrapper">
        <div class="system-message">
            <div>
                <p class="system-comment has-text-white has-background-info">{{message}}</p>
                <template v-if="options">
                    <ApprovalButtons :unique_id="options.unique_id" :user_id="options.user_id"/>
                </template>
                <p class="user-info is-size-7">
                    <span>{{user_name}}</span>
                    <span>{{created_at}}</span>
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ApprovalButtons from './ApprovalButtons.vue';

export default defineComponent({
  name: 'SystemMessage',
  props: {
    message: {
      type: String
    },
    user_name: {
      type: String
    },
    created_at: {
      type: String
    },
    options: {
      type: Object
    }
  },
  components: {
    ApprovalButtons
  },
  mounted () {
    console.log(this.options);
  }
});
</script>

<style lang="scss" scope>
.system-message-wrapper {
    display: flex;
    justify-content: flex-start;
    .system-message {
        display: flex;
        justify-content: flex-start;
        margin-bottom: 20px;
        width: 80%;
        .user-info {
            white-space: nowrap;
            span {
                display: inline-block;
                margin-left: 10px;
            }
        }
        .system-comment {
            word-break: break-all;
            border-radius: 10px;
            padding: 10px;
        }
    }
}
</style>
