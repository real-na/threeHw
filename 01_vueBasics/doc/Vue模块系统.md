[TOC]

# 模块系统

## 前言

在很多 Vue 项目开发中，常规做法：
1. 定义组件 
2. 使用组件（如下代码）

```javascript
    //定义全局组件
    Vue.component('my-component',{});

    // 在模板中使用组件
    new Vue({
        el: '#app '
        template:'<div><my-component></my-component></div>'
    });
```

> 这种方式在很多中小规模的项目中运作的很好，但在复杂的项目中，就有以下缺点:

* 缺点
    * **全局定义 (Global definitions)** 强制要求每个 component 中的命名不得重复
    * **字符串模板 (String templates)** 缺乏语法高亮，在 HTML 有多行的时候，需要用到丑陋的 \
    * **不支持 CSS (No CSS support)** 意味着当 HTML 和 JavaScript 组件化时，CSS 明显被遗漏
    * **没有构建步骤 (No build step)** 限制只能使用 HTML 和 ES5 JavaScript, 而不能使用预处理器，如 Pug (formerly Jade) 和 Babel

## vue单文件组件
> Vue**单文件组件**(扩展名为 .vue)，由于浏览器不支持.vue文件，和ES6的模块化(import,export)开发,必须利用babel和webpack工具来辅助实现编译成浏览器支持的格式

* vue单文件优点
    - 完整语法高亮
    - CommonJS 模块
    - 组件作用域的 CSS


### vue单文件组件开发流程
> 单文件组件浏览器并不支持，需要经过webpack编译和打包

#### 定义目录

* 安装必要模块（脚手架都配置好了）
```json
    "devDependencies": {
        "html-webpack-plugin": "^3.2.0",
        "vue": "^2.5.17",
        "vue-loader": "^15.4.2",
        "vue-template-compiler": "^2.5.17",
        "webpack": "^4.18.0",
        "webpack-cli": "^3.2.3"
      }
```

* 设置webpack配置文件（webpack.config.js）
```javascript
    const path = require('path');
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    const { VueLoaderPlugin } = require('vue-loader');

    // 导出配置模块
    module.exports = {
        // 设置入口文件
        entry:'./src/app.js',

        // 输出配置
        output:{
            path:path.resolve(__dirname,'./dist'),
            filename:'js/[name]-bundle.js'
        },
        module:{
            rules:[
                // 匹配.vue单文件模板，并利用vue-loader、vue-template-compiler进行编译
                {
                    test:/\.vue$/,
                    loader:['vue-loader']
                }
            ]
        },
        plugins:[
            // 依据html模板生成一个自动引用你打包后的文件（js或css）的新的html页面
            new HtmlWebpackPlugin({
                template:'./src/index.html'
            }),

            // Vue-loader 15.x之后的版本都需要伴随 VueLoaderPlugin， 否则报错
		    new VueLoaderPlugin(),
        ]
    }
```

* 应用入口文件（app.js）
```javascript
    //ES6 引入其他模块（可以是js,css,vue单文件等）
    import Vue from 'vue';
    import App from './app.vue';

    new Vue({
        el:'#app',

        // render 函数若存在，则忽略 template 或 el 元素中的内容
        // el -> template -> render
        //创建虚拟DOM
        render(create){
            return create(App);
        }
    });
```

* 单文件组件（app.vue）
  后缀名为 .vue的组件：把结构行为和样式写到一起，用ESModule来实现导入导出
  * 引入的组件可以首字母大写、可以写成单标签，因为webpack编译了

```html
    <template>
        <div class="container">
            <h1>Hello {{name}}</h1>
            <button class="btn btn-success">点击进入</button>
        </div>
    </template>

    <script>
        // 导出当前组件配置选项
        export default{
            data(){
                return{
                    name:'Vue单文件组件'
                }
            }
        }
    </script>
    
    <!-- 设置具有组件作用域的样式 -->
    <style scoped>
        h1{color:#58bc58;}
    </style>
```


## ES Module
历史上，JavaScript一直没有模块体系（module），无法将一个大程序拆分成互相依赖的小文件，再用简单的方法拼装起来。其他语言都有这项功能，唯独javascript没有，在这之前我们都是借助第三方工具（request.js等）来实现模块化开发，直到ES6 module的出现，成为浏览器和服务器通用的模块解决方案，完全可以取代 CommonJS 和 AMD 规范

### 基本特点
* 每一个模块只加载一次， 并执行一次，再次加载同一文件，直接从内存中读取；
* 每一个模块内声明的变量都是局部变量， 不会污染全局作用域；
* 通过export导出模块，通过import导入模块
* ES6模块只支持静态导入和导出，只可以在模块的最外层作用域使用import和export

#### 模块对象

esmodule把每一个文件当作一个模块，一个模块就有一个模块对象，export就是给模块对象添加属性

### export
> export命令用于规定模块的对外接口，只允许导出最外层函数、类以及var、let或const声明的变量，可多次export，export出去后自动成为**模块对象的属性**
* PS: export后只能跟`function`、`class`、`var`、`let`、`const`、`default`、`{}`

* 基本用法
```javascript
//base.js
var myName = 'laoxie';
var age = 1995;

// 多次export
export {myName};
export let gender="男";
export function show(){ 
    console.log(666); 
}
export {
    request,
    baseUrl
};                      //批量给模块对象添加属性（不是对象）
export default request; //给模块对象添加default属性，值为request
export default {};      // 导出default属性，属性值为一个对象，里面就不能as了
```

* as
通常情况下，export输出的变量就是本来的名字，但是可以使用as关键字重命名
```javascript
function show(){
    console.log('my name is show');
}
let show2 = 'offgun';
    
export {show as showName};
export {
	show as showName,
    show2
}
```

* default
> 为模块指定默认输出，这样就可以在使用 import 令的时候，不必知道所要加载的变量名或函数名

```javascript
    export default {
        data:{
            path:'/src/'
        }
    }
```

* `*` 作为中转模块导出，把某个模块的所有相属性/方法导出
```javascript
    export * from './md.js';
```

### import

具有缓存特性，多次导入不会影响性能

> import命令用于导入其他模块提供的功能，格式：`import <module> from <url>` 

导入的时候除了default属性都要加`{}`

* url 支持格式
```js
// 支持
import base from 'http://laoxie.com/js/base.js';
import base from './js/base.js';
import base from './base.js';
import base from '../base.js';

// 不支持
import base from 'base.js';
import base from 'js/base.js';
```

* 导入default属性
```javascript
export default request    
//从<模块对象>中导入属性为default的值，并赋值给变量res，无则得到undefined
import res from './base.js';
```

* 导入除default属性以外的其他
```js
//导入模块对象中属性为myName的值并赋值给变量myName
import {myName} from './base.js';
console.log(myName,res);
```

* as 修改变量名（一般用于变量冲突）
```javascript
//导入模块对象中属性为myName的值并赋值给变量username
import {myName as username} from './base.js';
```

* `*` 导入整个模块对象
```javascript
//导入模块对象中的所有属性，并赋值给myModule变量
import * as myModule from './base.js';
```

### 在html中使用ES Module

* 浏览器支持ES Module
> 在`<script>`标签中指定`type="module"`

```html
//script标签的type属性默认为  text/javascript
<script type="module">
        import res from './base.js';
        console.log(res)
    </script>

    <script type="module" src="js/base.js"></script>
```

* 浏览器不支持ES Module
> 利用webpack等工具转换成ES5后引入（推荐）

### 直接import一个文件夹

如果直接import了一个文件夹，会自动去找该文件夹下面有没有`package.json`文件

会自动去找文件里面的有没有配置：`main(commonjs)`  ||  `module(ESmodule)`      ||   `index`

然后引入的就是上述两个配置的属性值对应的文件



## 虚拟DOM

+ 虚拟DOM：虚拟节点的集合（结构类似于真实DOM节点的js对象）
  + vue里面用来减少节点操作的
+ 真实DOM：浏览器在解析html结构时，按照层级把每个元素渲染成node节点，所有节点组合成一个树状结构的形状 **DOM树**
  + 节点的频繁操作会影响页面性能

```html
<div class="datalist">
    <h1>xxx</h1>
    <ul class="list">
        <li></li>
        <li></li>
    </ul>
</div>
```

上述**HTML结构**拿到浏览器的时候会被解析成**node节点对象**

+ 点语法（prop）作用于节点对象
+ getAttribute()和setAttribute() 作用于HTML结构

```js
{
    type:'div',
    props:{className:'datalist'},
    children:[
        {type:'h1',props:null,children:[]},
        {type:'ul',props:{className:'list'},children:[
            //同目录下同类型标签就需要加key
            {type:'li',props:null,children:'',key:1} 
            {type:'li',props:null,children:'',key:2}
        ]}
    ]
}
```

+ js代码操作真实DOM节点
+ 真实DOM节点再渲染HTML结构

vue会在HTML结构和node节点对象中间加入一个叫虚拟DOM的东西

+ js代码操作虚拟DOM节点
+ 虚拟DOM节点里面有diff算法：会计算js操作有没有必要修改真实DOM
  + diff算法：在一个更新周期内，对比虚拟DOM前后状态(对比两个js对象)，找出差异项
  + diff算法的作用：过滤或规避一些没必要的更新
+ 有差异项就修改真实DOM

#### key

唯一且稳定

Vue 识别DOM节点的一个通用机制（用于diff算法）

同目录下同类型标签就需要加key

> Vue对相同的元素进行展示排序等操作时，遵循“就地复用”原则，因为这样更加高效，性能更好
> 但对于依赖子组件状态或临时 DOM 状态 (如：表单输入值、复选框选中等)的列表，会出现操作混乱的问题，
> 指定key属性后，意为去掉“就地复用”特性（建议尽可能在使用 v-for 时提供 key）

