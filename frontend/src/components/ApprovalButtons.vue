<template>
    <div class="buttons mb-0 mt-2">
        <button
            class="button is-success is-light"
            @click="reaction(APPLY_REACTIONS.APPROVE)"
        >
            承認
        </button>
        <button
            class="button is-danger is-light"
            @click="reaction(APPLY_REACTIONS.DENY)"
        >
            拒否
        </button>
    </div>
</template>

<script lang="ts">
import reactionDomain from "../Domain/Apply/Reaction";
import { APPLY_REACTIONS } from "../Enum";
import { defineComponent } from "vue";
import swal from "../util/swal";

export default defineComponent({
    name: "ApprovalButtons",
    props: {
        unique_id: {
            required: true,
            type: Number,
        },
        user_id: {
            required: true,
            type: String,
        },
    },
    data() {
        return {
            APPLY_REACTIONS: APPLY_REACTIONS,
        };
    },
    methods: {
        async reaction(reaction: APPLY_REACTIONS) {
            await reactionDomain.send(this.unique_id, this.user_id, reaction);
            if (reaction == APPLY_REACTIONS.APPROVE) {
                await swal.success("承認しました。");
            } else {
                await swal.warning("拒否しました。");
            }
        },
    },
});
</script>
