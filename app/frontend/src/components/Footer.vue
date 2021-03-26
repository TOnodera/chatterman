<template>
    <footer class="footer">
        <div class="content has-text-centered">
            <p>
                @copyright takeshi. {{year}}
            </p>
        </div>
    </footer>
</template>

<script>
export default {
    name: 'Footer',
    data(){
        return {
            year: 2021
        }
    }
}
</script>

