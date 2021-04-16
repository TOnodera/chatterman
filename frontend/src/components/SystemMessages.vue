<template>
    <div>
        <div v-for="message in messages" :key="message.id">
            <SystemMessage
                :message="message.message"
                :user_name="message.user_name"
                :key="message.message_id"
                :created_at="message.created_at"
                :options="message.options"
            />
        </div>
    </div>
</template>

<script>
import SystemMessage from '../components/SystemMessage.vue'
export default {
  name: 'SystemMessages',
  components: {
    SystemMessage
  },
  props: {
    messages: {
      type: Array
    }
  }
}
</script>
