<template>
    <div>
        <h1>动态组件</h1>
        <component :is="currentComponent"></component>
        <div class="btn-group">
            <button class="btn btn-outline-primary"
            v-for="item in 5" :key="item"
            @click="currentComponent='com'+item"
            :class="{'btn-success':currentComponent=='com'+item}">{{item}}</button>
        </div>
    </div>
</template>

<script>
export default {
    name: "DT",
    data() {
        return {
            currentComponent:'com1',
        };
    },
    created() {
        //DT组件一创建就生成5个组件放在this.$options.components下面
        for (let i = 1; i <= 5; i++) {
            this.$options.components["com" + i] = {
                name: "com" + i,
                template: "<div>组件" + i + "</div>",
            };
        }
    },
};
</script>

<style scoped lang='scss'>
</style>