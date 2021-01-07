// import Vue from 'vue/dist/vue'//引入完整版
import Vue from 'vue'; //引入运行时版本
import App from "./App.vue";
import router from "./router";

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
