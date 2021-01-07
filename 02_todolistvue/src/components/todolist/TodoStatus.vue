<template>
    <div class="border border-secondary p-3">
        代办事项：{{ tododata.length }}，完成：{{
            completelist.length
        }}，未完成：{{ uncompletelist.length }}
    </div>
</template>

<script>
export default {
    name:'TodoStatis',
    props: ["tododata"],
    computed: {
        completelist: function () {
            return this.tododata.filter((item) => item.complete);
        },
        uncompletelist: function () {
            return this.tododata.filter((item) => !item.complete);
        },
    },
};
</script>

<style scoped lang='scss'>
</style>