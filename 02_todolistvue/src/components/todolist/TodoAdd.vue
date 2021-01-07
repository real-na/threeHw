<template>
    <div class="input-group mt-3">
        <input
            type="text"
            class="form-control"
            ref="input"
            v-model="event"
            @keyup.enter="addItem"
        />
        <div class="input-group-append">
            <!-- <button class="btn btn-success" v-on:click="addItem">添加</button> -->
            <TodoButton class="btn-success" v-on:click="addItem">添加</TodoButton>
        </div>
    </div>
</template>

<script>
import TodoButton from './TodoButton.vue';
export default {
    data: function () {
        return {
            event: "",
        };
    },
    methods: {
        addItem() {
            this.$emit("add", this.event);
            // 清空并自动获得焦点
            this.event = "";

            this.$refs.input.focus();
        },
    },
    components:{
        TodoButton,
    }
};
</script>

<style scoped lang='scss'>
</style>