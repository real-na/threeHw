脚手架的热刷新通过websocket来实现：相当于是服务器的东西更新，客户端实时修改

看network里面有一个叫websocket的请求

## 步骤

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

