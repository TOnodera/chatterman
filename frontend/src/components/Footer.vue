<template>
    <footer class="footer">
        <div class="content has-text-centered">
            <p>
                @copyright takeshi. {{year}}
            </p>
        </div>
    </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Footer',
  data () {
    return {
      year: 2021
    };
  }
});
</script>
