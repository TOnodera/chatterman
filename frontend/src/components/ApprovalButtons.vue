<template>
    <div class="buttons mb-0 mt-2">
        <button class="button is-success is-light">承認</button>
        <button class="button is-danger is-light">拒否</button>
    </div>
</template>

<script>
export default {
    name: 'ApprovalButtons',
    props: {
        apply_id: {
            required: true, type: Number
        },
        user_id: {
            required: true, type: String
        }
    }
};
</script>