<template>
    <table class="table">
        <thead>
            <tr>
                <th scope="col"><input type="checkbox" v-model="allChecked"></th>
                <th scope="col">#</th>
                <th scope="col">代办事项</th>
                <th scope="col">是否完成</th>
                <th scope="col">操作</th>
            </tr>
        </thead>
        <tbody>
            <todo-item
                v-for="(item, idx) in tododata"
                :key="item.id"
                :item="item"
                :idx="idx"
            ></todo-item>
        </tbody>
    </table>
</template>

<script>
import TodoItem from "./TodoItem.vue";
export default {
    name:'todoContent',
    props: ["tododata"],
    computed:{
        allChecked:{
            //根据每一个item判断全选按钮的状态
            get(){
                return this.tododata.every(item=>item.checked);
            },
            //根据全选按钮的状态改变每一个item的状态
            set(newVal){
                this.tododata.forEach(item=>item.checked = newVal);
            }
        }
    },
    components: {
        TodoItem,
    },
};
</script>

<style scoped lang='scss'>
</style>