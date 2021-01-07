import Vue from 'vue';
//1、引入
import VueRouter from 'vue-router';
// import Home from '../views/Home.vue';
// import Discover from '../views/Discover.vue';
// import Cart from '../views/Cart.vue';
// import Login from '../views/Login.vue';
// import Reg from '../views/Reg.vue';

// 2、使用
Vue.use(VueRouter);

//路由导航冗余报错（路由重复）
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location) {
    return originalReplace.call(this, location).catch(err => err)
}

// 3、配置路由信息表
const routes = [{
    path: '/',
    redirect: '/home'
}, {
    path: '/home',
    component: () => import("../views/Home.vue"),
}, {
    path: '/cart',
    component: () => import("../views/Cart.vue"),
}, {
    path: '/Reg',
    component: () => import("../views/Reg.vue"),
}, {
    path: '/Login',
    component: () => import("../views/Login.vue"),
}, {
    path: '/discover',
    component: () => import("../views/Discover.vue"),
}];

// 4、实例化
const router = new VueRouter({
    mode: 'hash',
    routes,
});

// 5、导出注入根实例
export default router;