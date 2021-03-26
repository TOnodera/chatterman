<template>
    <div>
        <div class="mb-1">
            <h2 class="is-size-5">ユーザー登録</h2>
        </div>
        <div class="columns">
            <div class="column is-half">
                <div class="field">
                    <label class="label">ユーザー名</label>
                    <div class="control">
                        <input class="input" type="text" placeholder="ユーザー名" />
                    </div>
                </div>

                <div class="field">
                    <label class="label">メールアドレス</label>
                    <div class="control has-icons-left has-icons-right">
                        <input class="input" type="text" placeholder="Email" />
                        <span class="icon is-small is-left">
                            <fontawesome icon="user" />
                        </span>
                    </div>
                    <!--<p class="help is-success">This username is available</p>-->
                </div>

                <div class="field">
                    <label class="label">パスワード</label>
                    <div class="control has-icons-left has-icons-right">
                        <input class="input" type="email" placeholder="Email input" />
                        <span class="icon is-small is-left">
                            <fontawesome icon="key" />
                        </span>
                    </div>
                    <!--<p class="help is-danger">This email is invalid</p>-->
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

<script>
export default {
    name: "User",
};
</script>