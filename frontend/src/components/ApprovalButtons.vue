<template>
    <div class="buttons mb-0 mt-2">
        <button class="button is-success is-light" @click="approve">承認</button>
        <button class="button is-danger is-light" @click="deny">拒否</button>
    </div>
</template>

<script>
import swal from '../util/swal';
import reaction from '../Domain/Apply/Reaction';

export default {
    name: 'ApprovalButtons',
    props: {
        unique_id: {
            required: true, type: Number
        },
        user_id: {
            required: true, type: String
        }
    },
    methods: {
        approve(){
            reaction.approve(this.unique_id,this.user_id);
            swal.success("許可しました。");
        },
        deny(){
            reaction.deny(this.unique_id,this.user_id);
            swal.warning("申請を拒否しました。");
        }
    },
    mounted() {
        console.log(this.user_id);
    },
};
</script>