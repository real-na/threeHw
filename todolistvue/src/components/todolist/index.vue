<template>
    <div>
        <todo-add @add="addItem"></todo-add>
        <todo-content :tododata="tododata"></todo-content>
        <todo-Status :tododata="tododata"></todo-Status>
    </div>
</template>

<script>
import TodoAdd from './TodoAdd.vue';
import TodoContent from './TodoContent.vue';
import TodoStatus from './TodoStatus.vue';
import 'bootstrap/dist/css/bootstrap.css';
export default {
    name:'todolist',
    data: function () {
        return {
            tododata: [
                {
                    id: 1,
                    event: "定个小目标睡一整天",
                    complete: true,
                    checked:true,
                },
                {
                    id: 2,
                    event: "赚他一个亿",
                    complete: false,
                    checked:false,
                },
                {
                    id: 3,
                    event: "迎娶白富美，达到人生巅峰",
                    complete: false,
                    checked:false,
                },
                {
                    id: 4,
                    event: "出人CEO，达到疯癫状态",
                    complete: false,
                    checked:false,
                },
            ],
            maxId: 4,
        };
    },
    methods: {
        //  添加
        addItem(data) {
            let newEvent = {
                id: ++this.maxId,
                event: data,
                complete: false,
            };
            this.tododata.push(newEvent);
        },
        // 删除
        removeItem(id) {
            this.tododata = this.tododata.filter((item) => item.id != id);
        },

        // 修改
        completeItem(id) {
            this.tododata.forEach((item) => {
                if (item.id == id) {
                    item.complete = true;
                }
            });
        },
        // 改变每一个item的选中状态
        checkItem(id){
            this.tododata.map(item=>{
                if(item.id == id){
                    item.checked = !item.checked;
                }
                return item;
            })
        }
    },
    created() {
        this.$root.$on("complete", this.completeItem);
        this.$root.$on("remove", this.removeItem);
        this.$root.$on('selectItem',this.checkItem);
    },
    components: {
        TodoAdd,
        TodoContent,
        TodoStatus,
    },
};
</script>

<style scoped lang='scss'>
</style>