<template>
    <div>
        <h1>动态组件</h1>
        <!-- <keep-alive include="com1"> -->
        <keep-alive :include="/com[12]/">
            <component :is="currentComponent"></component>
        </keep-alive>
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
            let componentName = 'com' + i;
            this.$options.components[componentName] = {
                name: componentName,
                // template: "<div>组件" + i + "</div>",
                render(createElement){
                    return createElement('div','组件'+i)
                },
                data(){
                    return {
                        name:componentName
                    }
                },
                created(){
                    console.log("create",this.name);
                },
                destroyed(){
                    console.log("destoryed",this.name);
                }
            };
        }
    },
};
</script>

<style scoped lang='scss'>
</style>