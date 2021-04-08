<template>
    <div class="buttons mb-0 mt-2">
        <button class="button is-success is-light" @click="approve">承認</button>
        <button class="button is-danger is-light" @click="deny">拒否</button>
    </div>
</template>

<script>
import swal from '../util/swal';
export default {
    name: 'ApprovalButtons',
    props: {
        apply_id: {
            required: true, type: Number
        },
        user_id: {
            required: true, type: String
        }
    },
    methods: {
        approve(){
            swal.success("承認しました。");
        },
        deny(){
            swal.warning("申請を拒否しました。");
        }
    },
    mounted() {
        console.log(this.user_id);
    },
};
</script>