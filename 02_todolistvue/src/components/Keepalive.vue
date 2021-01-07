<template>
    <div>
        <h1>keep-alive</h1>
        <keep-alive>
            <User username="gun" v-if="show" />
        </keep-alive>
        <button class="btn btn-success" @click="show = !show">
            show:{{ show }}
        </button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            show: true,
        };
    },

    components: {
        User: {
            name: "user",
            props: ["username"],
            /*  components:{
                MyComponent:{
                    name:'mycomponent',
                    render(h){
                        return h('span','mycomponent')
                    }
                }
            }, */
            render(createElement) {
                return createElement("div", [
                    "先写一些文字",
                    createElement("h1", "一则头条"),
                    createElement("input", {
                        class: 'ipt',
                        attrs:{type:'password'}
                    }),
                ]);
            },
            created() {
                console.log(this.username, "created");
            },
            destroyed() {
                console.log(this.username, "destoryed");
            },
        },
    },

    methods: {},
};
</script>

<style scoped lang='scss'>
</style>