<template>
    <tr :id="item.id" :class="{ 'table-success': item.complete }"
     @click="selectItem1(item.id)">
        <th><input type="checkbox" :checked="item.checked"></th>
        <th scope="row">{{ idx + 1 }}</th>
        <td>{{ item.event }}</td>
        <td>{{ item.complete ? "是" : "否" }}</td>
        <td>
            <!-- <button
                class="btn btn-outline-primary btn-sm"
                @click.stop="complete1(item.id)">完成
            </button> -->
            <!-- <button
                class="btn btn-outline-danger btn-sm"
                @click.stop="remove1(item.id)">删除
            </button> -->
            
            <!-- 子组件没有接收的props属性，会自动添加到子组件的根节点上 -->
            <TodoButton class="btn-outline-primary btn-sm" @click.native.stop="complete1(item.id)">完成</TodoButton>
            <TodoButton class="btn-outline-danger btn-sm" @click.native.stop="remove1(item.id)">删除</TodoButton>

        </td>
    </tr>
</template>

<script>
import TodoButton from './TodoButton.vue';
export default {
    props: ["item", "idx"],
    methods: {
        complete1(id) {
            this.$root.$emit("complete", id);
        },
        remove1(id) {
            this.$root.$emit("remove", id);
        },
        selectItem1(id){
            this.$root.$emit('selectItem',id);
        }
    },
    components:{
        TodoButton,
    }
};
</script>

<style scoped lang='scss'>
</style>