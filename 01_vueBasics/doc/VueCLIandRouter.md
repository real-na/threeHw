脚手架的热刷新通过websocket来实现：相当于是服务器的东西更新，客户端实时修改

看network里面有一个叫websocket的请求

## VueCli

+ 全局安装脚手架 ： `npm i -g @vue/cli`

+ 创建项目：`vue create projectName`

+ 目录结构

  + node_modules        项目依赖（第三方模块）

  + public                        网站根目录

  + src                              源码

    + main.js                       入口文件

    ```js
    import Vue from 'vue';
    import App from './App.vue';
    
    new Vue({
        // render 函数若存在，则忽略 template 或 el 元素中的内容
        // el -> template -> render
        //创建虚拟DOM:render App.vue里面的结构
        render:function(createElement){
    		return createElement(App)
        }
    }).$mount("#app"); 
    ```

    

  + .gitignore                   git过滤清单

  + babel.config.js          babel的配置文件(压缩的配置)

  + package.json            项目配置文件

  + package-lock.json    记录当前状态下实际安装的各个包的具体来源和版本号 

    + 指定版本号：比如 3.5.2 ，只安装指定版本。遵循 “大版本.次要版本.小版本”的格式规定。

    + ~ 波浪号 + 指定版本号：比如 ~3.5.2 

      安装 3.5.x 的最新版本（不低于 3.5.2），但是不安装 3.6.x，也就是说安装时不改变大版本号和次要版本号。

    + ^ 插入号 + 指定版本号：比如 ^3.5.2 

      安装 3.x.x 的最新版本（不低于 3.5.2），但是不安装 4.x.x，也就是说安装时不改变大版本号。需要注意的是，如果大版本号为0，则插入号的行为与波浪号相同，这是因为此时处于开发阶段，即使是次要版本号变动，也可能带来 程序的不兼容。

    + latest ：安装最新版本

+ 启动项目

  + npm script  脚本命令：

  ```js
  "scripts": {
      "serve": "vue-cli-service serve",
      "build": "vue-cli-service build",
      "lint": "vue-cli-service lint"
    },
  ```

  + 运行：`npm run xxx`     xxx为左边的属性，运行就会执行右边的

#### CLI里面使用Bus总线

新建一个Bus.js文件

```js
import Vue from 'vue';
const Bus = new Vue();
export default Bus;
```

+ 父组件引入

```js
import Bus from './Bus';
created(){
    //绑定事件
}
```

+ 子组件引入

```js
import Bus from './Bus';
Bus.$emit() //调用事件
```

## 2、Router

### 2.1、引入

+ 多页面应用：MPA(Multiple Page Application)

> 通过a标签跳转

+ 单页面应用：SPA(Single Page Application)

> 整个应用只有一个index.html页面

### 2.2、使用

script标签引入：先引入vue，再引入vue-Router

#### npm方式：

+ 安装：`npm install vue-router -D` 
+ 入口文件引入：`import VueRouter from 'vue-router'`
+ 使用：`Vue.use(VueRouter)`
+ 实例化router并配置参数：`routes:路由信息表`

```js
const router = new VueRouter({
    routes:[
        //根据路径不同渲染不同的组件
        {path:'/home',component:()=>import("../views/Home.vue"),},{},{}
    ]
})
```

+ 注入到Vue的配置中(根实例)

```js
new Vue({
	router:router,
    render:h=>h(App)
}).$mount('#app')
```

+ 设置路由出口：一级路由出口一般在根组件里面

```html
<router-view></router-view>
```

> 做完以上操作就可以实现地址栏输入不同的路由显示不同的页面内容

### 2.3、配置导航：

> 实现路由跳转

#### 2.3.1、声明式导航

+ `router-link`：默认会被渲染成a标签
  + to(String|Object)：
  + tag：router-link会被渲染成什么标签
  + active-class：当前匹配组件显示的样式
  + exact-active-class：精确匹配路由时使用的类名
  + replace：加上replace的路由就不会产生历史记录
  + event：触发路由的事件，默认event

#### 2.3.2、编程式导航

> 利用Router实例：

##### $router：路由对象

一般用于路由跳转

+ `this.$router.push(‘path’)`
  + path：

+ `this.$router.replace(‘path’)`

  + > 类似于router.push()，唯一不同的是它不会向 history 添加新记录

+ `this.$router.back()`

+ `this.$router.forward()`

+ `this.$router.go(n)`

##### $route：当前路由信息

保存当前页面的路由信息

```js
//1、给导航绑定点击事件
<ul>
    <li v-for="item in nav" :key="item.name" @click="goto(item.path)"
        :class="{'active':currentPath===item.path}">{{item.text}}</li>
</ul>

//2、定义默认当前路径为home,高亮样式也为home
currentPath:'/home',
    
//3、点击的时候触发goto事件处理函数，在里面实现页面的跳转
goto(path){
  this.$router.push(path);
  // this.currentPath = this.$route.path;
  // 在这里拿到的是旧值，所以要使用watch拿到最新的值
  console.log("goto=",this.$route.path);
}

//4、监听$route.path的变化，可以拿到页面的当前路由，实现高亮样式跟着路由改变
watch:{
  "$route.path":function(newVal,oldVal){
    console.log(newVal,oldVal);
    this.currentPath = newVal;
  }
},
    
//5、组件创建的时候拿到当前路由赋值给currentPath：实现页面刷新的时候高亮不乱
created(){
  this.currentPath = this.$route.path;
}
```

### 路由内置组件

都是全局组件

+ 显示路由内容：`<router-view>`
+ 跳转页面：``router-link``