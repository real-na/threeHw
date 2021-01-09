<template>
    <div id="app">
        <!-- <button @click="$router.back()">上一页</button>
    <button @click="$router.forward()">下一页</button>
    <ul>
        <li v-for="item in nav" :key="item.name" @click="goto(item.path)"
        :class="{'active':currentPath===item.path}">{{item.text}}</li>
    </ul> -->
        <el-row class="nav">
            <el-col :span="18">
                <el-menu
                    :default-active="currentPath"
                    mode="horizontal"
                    background-color="#545c64"
                    text-color="#fff"
                    active-text-color="#ffd04b"
                    router
                >
                    <el-menu-item
                        :index="item.path"
                        v-for="item in nav"
                        :key="item.name"
                        @click="goto(item.path)"
                    >
                        <i :class="item.icon"></i>{{ item.text }}
                    </el-menu-item>
                </el-menu>
            </el-col>
            <el-col :span="6" class="btn">
                <el-button type="text" @click="goto('/reg')">注册</el-button>
                <el-button type="text" @click="goto('/login')">登录</el-button>
            </el-col>
        </el-row>
        <!-- 一级路由出口 -->
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: "App",
    data() {
        return {
            nav: [
                {
                    name: "home",
                    path: "/home",
                    text: "首页",
                    icon: "el-icon-s-home",
                },
                {
                    name: "discover",
                    path: "/discover",
                    text: "发现",
                    icon: "el-icon-view",
                },
                {
                    name: "cart",
                    path: "/cart",
                    text: "购物车",
                    icon: "el-icon-shopping-cart-2",
                },
            ],
            currentPath: "/home",
        };
    },
    methods: {
        goto(path) {
            this.$router.push(path);
            // this.currentPath = this.$route.path;
            // 在这里拿到的是旧值，所以要使用watch拿到最新的值
            console.log("goto=", this.$route.path);
        },
    },
    watch: {
        "$route.path": function (newVal, oldVal) {
            console.log(newVal, oldVal);
            this.currentPath = newVal;
        },
    },
    components: {},
    created() {
        // 页面刷新的时候高亮样式根据当前路由来
        this.currentPath = this.$route.path;
    },
};
</script>

<style lang='scss'>
@import './assets/scss/base.scss';
</style>
