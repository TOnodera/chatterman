<template>
    <div>
        <div class="mb-1">
            <h2 class="is-size-5">トークルーム作成</h2>
        </div>
        <div class="columns">
            <div class="column is-half">
                <div class="field">
                    <label class="label">ルーム名</label>
                    <div class="control">
                        <input class="input" type="text" placeholder="ユーザー名" />
                    </div>
                </div>

                <div class="field is-grouped">
                    <div class="control">
                        <button class="button is-link">登録</button>
                    </div>
                    <div class="control">
                        <button class="button is-link is-light">キャンセル</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'User'
});
</script>
