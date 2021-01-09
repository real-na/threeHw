[TOC]

# 组件Component

> 如果说指令为html属性，组件就是创建一个html标签

组件是 Vue最强大的功能之一，组件可以扩展 HTML 元素，封装可重用的代码。组件系统让我们可以用独立可复用的小组件来构建大型应用，几乎任意类型的应用的界面都可以抽象为一个组件树

* 优点
  * 代码复用
  * 便于维护


## 组件定义与使用

> 组件是可复用的 Vue 实例，带有一个名字，所以它们与 new Vue 接收相同的选项，例如 data、computed、watch、methods 以及生命周期钩子等（el选项除外）

### 组件要求

* data必须为Function类型

原因：为了保证组件的独立性 和 可 复用性，data 是一个函数，组件实例化的时候这个函数将会被调用，返回一个对象，计算机会给这个对象分配一个内存地址，你实例化几次（创建多少个组件），就分配几个内存地址，他们的地址都不一样，所以每个组件中的数据不会相互干扰，改变其中一个组件的状态，其它组件不变。

* 每个组件必须只有一个根元素,否则报错
* 注册时组件名可以是kebab-case或PascalCase，但在html页面上使用时，必须写成遵循W3C 规范中的自定义组件名 (字母全小写且必须包含一个连字符)

### 全局组件

使用Vue.component()创建的为全局组件，所有的Vue实例都可以使用
```javascript
    Vue.component('my-component', {
      // ... options ...
      template:'<p>我是全局组件</p>'
    })
//template:'<div>模板</div>', 
//配置了template以后,就会把template作为视图(替换掉el里面的内容,包括#app本身)
//如果没有配置template，就会以el里面的节点作为模板
//相当于templete是el节点的outerHTML
```
+  option:组件配置选项(和vue实例里面的配置几乎一致)
  +  定义：Vue.component('todolist',option)
  +  使用：<todolist></todolist>

### 局部组件

在某个Vue实例中通过components属性注册的组件为局部组件，只有当前实例能使用
```javascript
    var Child = {
        data(){
            return {
                name:'我是局部组件'
            }
        },
        template: '<h1>hello, {{name}}</h1>'
    }
     
    // 创建根实例
    new Vue({
      el: '#app',
      components: {
        Child
      }
    });
```
### 使用组件

> 使用组件时，组件template中的内容会替换调组件所在位置

```html
    <div id="app">
      <my-component></my-component>
      <child></child>
    </div>
```

> 注意：由于Vue 只有在浏览器解析和标准化 HTML 后才能获取模板内容，所以把组件嵌套在某些特定的元素（如table,ul,ol,select等）上时，会导致解析错误

```html
  <!-- table为已经存在html页面上的元素 -->
  <table>
    <my-row></my-row>
  </table>
```
```javascript
  Vue.component('my-row',{
    template:'<tr><td>test</td></tr>'
  });
```
>以上解析的结果为，tr被解析到了table外面，解决方式也很简单，利用特殊的is属性实现

```html
  <table>
    <tr is="my-row"></tr>
  </table>
```

## 2、组件通讯

### 2.1、组件间通信规则

1. 不要在子组件中直接修改父组件传递的数据
2. 数据初始化时，应当看初始化的数据是否用于多个组件中，如果需要被用于多个组件中，则初始化在父组件中；如果只在一个组件中使用，那就初始化在这个要使用的组件中。
3. 数据初始化在哪个组件, 更新数据的方法(函数)就应该定义在哪个组件(自己的数据自己管理) **单向数据流规则**

单项数据流

> 所有的数据传到子组件后，不能在子组件修改数据；
>
> 所以在设计数据时，要遵循**谁的数据谁修改**的原则（修改数据的方法要放在数据所在的组件）

### 2.2、通讯方式

1. props 父组件向子组件传递数据：父传子、子传父

   + props传递过去的数据如果不接收，就会自己放在根节点的属性上（自动合并）

   ```js
   举例：todoBotton
   ```

   

2. $emit 自定义事件：子传父

3. slot 插槽分发内容：父传子

#### 2.2.1、父组件->子组件

#####  props(可以传数据，也可以传递方法)

组件实例的作用域是孤立的。这意味着不能（也不应该）在子组件的模板内直接引用父组件的数据。要让子组件使用父组件的数据，需要通过子组件的props选项

* props声明属性：声明的属性会自动成为组件实例的属性（可通过this.xx访问，可以是data里面的数据，可以是methods里面的方法）
  > prop传递是单向的，当父组件的属性变化时，将传导给子组件，但是不会反过来

1、在父组件的模板中给子组件定义属性，并传递数据


```html
    <blog-post :mytitle="静态数据"></blog-post>
<!-- 传入一个对象 -->
   <blog-post v-bind:author="{ name: 'laoxie', age:18 }"></blog-post>
```
2、子组件通过props接收

> 通过props接收以后，所有的props属性会自动成为子组件实例上的属性
>
> 所以使用的时候直接就是：this.mytitle

```js
    Vue.component('blog-post', {
      props: ['mytitle','author'],
      template: '<h3>{{ mytitle }}</h3>'
    })
```

##### props传递方法

以下为深层次组件通信中的逐层传递

> 以todolist里面 完成和删除为例

+ 1、父组件传递方法

```js
<todo-content :tododata="tododata" :complete="completeItem"
            :remove="removeItem"></todo-content>
methods:{
	completeItem(id){}
    removeItem(id){}
}
```

+ 2、子组件todoContent接收（还要继续传到子组件todoItem）

tbody里面只能是tr，所以直接写成todo-item是不可以的

> 使用 is 

`<tr is="todo-item"></tr>`：表示tr是属于todo-item组件的

```js
props:['complete','remove'];
<tbody>
<tr is="todo-item" v-for="(item,idx) in tododata" 
		   :complete="completeItem"
            :remove="removeItem"
		   :item="item" :idx="idx"></tr>
</tbody>
```

+ 3、子组件todoItem接收

> 点击的时候触发接收到的complete事件，把item.id往上传

```js
props:['complete','remove'];
<button @click="complete(item.id)">完成</button>
<button @click="remove(item.id)">删除</button>
```

##### $parent.show()

可以直接用$parent.方法名()、$parent.数据

这里的$parent就相当于父组件中的this

#### 2.2.2、子组件->父组件

##### 自定义事件 + $emit()

+ $emit()：是Vue实例上的方法

> PS：Vue遵循**单向数据流**原则，不允许在子组件中直接修改props传入的父组件数据（谁的数据谁修改），可以通过自定义事件系统，利用$emit()方法触发父组件函数来达到修改的效果

* 方式一（推荐）：以todolist和todoAdd为例
  1. 在父组件模板中给 子组件 定义  自定义事件（如:add），并使用父组件的事件处理函数（handler）
  ```js
  <todo-add v-on:add="handler"> </to-add>
  ```

  2. 在子组件内部（todoAdd内部）触发自定义事件并传递参数
  >this.$emit('add',this.event) 会 通过自定义事件add  触发父组件的事件处理函数handler，从而实现数据修改

  ```js
  <button @click="addItem"></button>
  data:function(){
      return {
          event:'',
      }
  }
  methods:{
      addItem(){
          //触发父组件中的自定义事件
          this.$emit('add',this.event)
      }
  }
  ```

  

* 方式二（简单数据可采用方案）：
  1. 可以利用v-bind:xx.sync修饰符（如下color属性）
  2. 子组件调用`this.$emit('update:xx',val)`触发更新

```html
  <div id="app">
    <p :style="{fontSize:fontSize+'px'}">字体大小：{{fontSize}}</p>

    <btn-change :font-size="fontSize" @bigger="updateFontSize" :color.sync="color"></btn-change>
  </div>

  <template id="myButton">
    <button @click="changeSize">改变字体大小</button>
    <button @click="changeColor">改变字体颜色</button>
  </template>

  <script>
    new Vue({
      el:'#app',
      data:{
          fontSize:16,
          color:'red'
      },
      components:{
        btnChange:{
          props:['fontSize'],
          template:'#myButton',
          methods:{
            changeSize(){
              this.initFontSize++;

              // 手动触发自定义事件并传递修改后的值
              this.$emit('bigger',this.fontSize+1);
            },
            changeColor(){
              this.$emit('update:color','#58bc58');
            }
          }
        }
      },
      methods:{
        updateFontSize(val){
          // 触发自定义事件的事件处理函数，并修改字体大小
          this.fontSize = val;
        }
      }
    })
  </script>
```

##### $children

父组件获取子组件的数据和方法

+ $children[0].方法名()  |  $children[0].数据

  + 这里的$children[0]相当于第一个子组件的实例

+ ref

  >  给html元素设置ref属性，可以得到元素节点

  + 在父组件中给子组件设置ref属性，得到子组件实例

  ```js
  <todolist ref="list"></todolist>
  ```

  + 在父组件中使用子组件中的数据和方法

  ```js
  this.$refs.list.方法名()   ||   this.$refs.list.数据
  ```

#### 2.2.3、兄弟组件通信

* 组件A -> 父组件 -> 组件B
  > 组件A与组件B具有共同父级

#### 2.2.4、无关联/深层次组件间传参

+ 逐层传递（不推荐）：麻烦，结构的改变会导致通信失败
+ 事件Bus(总线)：也是通过自定义事件

> 利用一个Vue实例作为中间桥梁实现传参（如：组件A与组件B无任何联系或层级很深）

##### 事件总线实现步骤

以todolist中完成和删除为例：目的是把id从子组件往父组件里面传递

+ 数据接收方（父组件todolist）：创建一个Vue实例Bus，用于事件绑定与触发

  自定义事件complete（要接收传过来的id）

  + > $on(‘自定义事件’，组件中的事件处理函数)

    事件处理函数需要在该组件中才可以获取，所以写在该组件created生命周期函数里面

  ```js
  // 实例化一个Vue，用于传输数据
  let bus = new Vue();
  //给事件总线添加自定义事件，自定义事件就会被绑定给bus实例
  //写在todolist的生命周期函数里面
  created(){
      bus.$on('complete',this.completeItem);
      bus.$on('remove',this.removeItem)
  }
  ```

+ 数据传输方（组件todoItem）：通过$emit触发Bus的自定义事件，并传递参数

  + > $emit(‘自定义事件名’，要传递的参数)

```js
<button @click="complete1(item.id)"></button>
methods:{
    complete1(id){
        //触发事件并传递参数
        bus.$emit('complete',item.id); //把id传过去
    }
}
```

> 任意组件都可以绑定/触发自定义事件
>
> 在不创建Bus的前提下，可以使用$root取代Bus的作用

+ 接收方（组件B）：自定义事件（父组件要接收id）

+ 传输方（组件A）：$emit()

```javascript
    // 定义中间桥梁bus（实例化的vue）
    let bus = new Vue();

    //组件A
    let comA = {
        data(){
            return {
              msg:'I am A'
            }
        },
        template:`<div>
            <p>{{msg}}</p>
            <button @click="send">传数据到B组件</button>
        </div>`,
        methods:{
            send(){
                bus.$emit('data',this.msg);
            }
        }
    }

    // 组件B
    let comB = {
        data:()=>({
            msg:'I am B'
        }),
        mounted(){
            bus.$on('data',val=>this.msg = val)
        },
        template:`<div><p>{{this.msg}}</p></div>`
    }

    // 创建实例，并注册子组件
    new Vue({
        el:'#app',
        components:{
            comA,
            comB
        }
    });
```

### 2.3、通讯过程的数据类型校验

+ prop数据验证

> 对传入的prop属性进行校验，如：数据类型、必填、默认值等

```javascript
  Vue.component('my-component', {
    props: {
      // 基础的类型检查 (`null` 匹配任何类型)
      propA: Number,
      // 多个可能的类型
      propB: [String, Number],
      // 必填的字符串
      propC: {
        type: String,
        required: true
      },
      // 带有默认值的数字，无prop属性传入时，默认得到100
      propD: {
        type: Number,
        default: 100
      },
      // 带有默认值的对象
      propE: {
        type: Object,
        // 对象或数组默认值必须从一个工厂函数获取
        default: function () {
          return { message: 'hello' }
        }
      },
      // 自定义验证函数
      myscore: {
        validator: function (value) {
          // 这个值必须大于等于60，否则报错
          return val>=60
        }
      }
    }
  })
```

+ 非prop属性：不通过props声明的属性（在父组件定义了，子组件没有接收）

  > 此类属性会自动成为父组件根节点的属性（可通过`{inheritAttrs: false}` 关闭）

## 3、插槽内容

- 作用: 主要用于父组件向子组件传递 标签+数据 , （prop和自定义事件只是传递数据）
- 场景：一般是某个位置需要经常动态切换显示效果（如饿了么）个性化定制的地方，比如有的按钮

### 基础用法（父->子）

父组件传到子组件

> 在组件模板中利用内置组件`<slot></slot>`来承载组件内容,否则它的内容都会被忽略（被模板内容覆盖）

* 默认插槽default

  ```html
    <!-- 使用组件 -->
    <nav-link url="/home">首页</nav-link>

    <!-- 定义组件 -->
    <script>
      Vue.component('nav-link',{
        props:['url']
        //以下template写法，组件内容“首页”，会被template的内容覆盖掉，
        //最终解析为：<a href="/home"><span>Home</span></a>
        //template:`<a :href="url"><span>Home</span></a>`

        // 解决方案：可以用<slot></slot>保留内容和设置默认值
        // 最终解析为：<a href="/home">首页<span>Home</span></a>
        template:`<a :href="url"><slot></slot><span>Home</span></a>`
      });
    </script>
  ```

* 具名插槽：
  * 模板内容：给`<slot/>`组件命名（设置name属性）
  * 组件内容：设置slot属性，实现内容精准显示到模板具体位置
  > Vue2.6+已经废除slot属性，改成`v-slot:name`（只能用在template元素或组件上）

```html
  <!-- 组件模板内容 -->
  <template id="myTest">
    <div>
      <slot name="header">这是拥有命名的slot的默认内容</slot>
      <slot>这是拥有命名的slot的默认内容</slot>
      <slot name="footer">这是拥有命名的slot的默认内容</slot>
    </div>
  </template>

  <!-- 旧的用法使用组件 -->
  <my-component>
    <span slot="header">这里的内容显示到name为header的插槽</span>
    <span>这里的内容显示到默认插槽</span>
    <span slot="footer">这里的内容显示到name为footer的插槽</span>
  </my-component>

  <!-- Vue2.6+用法 -->
  <my-component>
    <template v-slot:header>这里的内容显示到name为header的插槽</template>
    <span>这里的内容显示到默认插槽</span>
    <template v-slot:footer>这里的内容显示到name为footer的插槽</template>
  </my-component>
```

### 作用域插槽（子->父）

要在父组件拿到子组件里面的数据：从组件内把数据往外传，为了实现可定制化

> Vue编译规则：父组件模板的所有东西都会在父级作用域内编译；
>
> 子组件模板的所有东西都会在子级作用域内编译

> 利用作用域插槽(slot-scope)实现把组件模板template中的数据传到组件内容中处理

+ 父组件要实现定制化，要拿到子组件的userInfo数据

```html
子组件：
<div class="slot">
    <!-- <slot :username="userInfo.username" :role="userInfo.role" :avatar="userInfo.avatar"/> -->
        <!-- 把userInfo下所有的属性写到solt组件上，等效于以上用法 -->
    <!-- 匿名插槽 -->
    <div class="default">
        <slot v-bind="userInfo"/>
    </div>

    <!-- 具名插槽 -->
    <div class="info">
        <slot name="info" v-bind="userInfo"/>
    </div>
</div>
data:function(){
    return {
        userInfo:{
            username:'jingjing',password:123,role:'vip',gender:'女',age:36,
        }
    }
}
```

1、匿名插槽也要加名字default

2、props只是一个命名，相当于把拿过来的数据赋值给props变量

3、v-slot可以简写成#

4、v-slot可以写在template或者子组件上

```html
父组件：
<ZyySlot v-slot:default="props">
  {{props}}
  <h4>{{props.username}}</h4>
  <p>性别：{{props.gender}}</p>
  <p>年龄：{{props.age}}</p>
</ZyySlot>

<ZyySlot>
  <template #info="{username,gender,age}">
    <h1>用户名：{{username}}</h1>
    <span>性别：{{gender}}</span>
    <span>年龄：{{age}}</span>
  </template>
</ZyySlot>
```



## 4、内置组件

##### `<component>` 动态组件

* is：指定渲染的组件

```html
  <component v-bind:is="currentTabComponent"></component>
<!-- component就会渲染出currentTabComponent组件的内容 -->
is里面的组件名字可以根据方法变化
currentTabComponent可以写在data里面，也可以写在components里面
```
举例：

```js
<template>
    <div>
        <h1>动态组件</h1>
        <component :is="currentComponent"></component>
        <div class="btn-group">
            <button class="btn btn-outline-primary"
            v-for="item in 5" :key="item"
            @click="currentComponent='com'+item"
            :class="{'btn-success':currentComponent=='com'+item}">{{item}}</button>
        </div>
    </div>
</template>

<script>
export default {
    name: "DT",
    data() {
        return {
            currentComponent:'com1',
        };
    },
    created() {
//DT组件一创建就生成5个组件放在this.$options.components下面
//this.$options相当于一个vue实例
        for (let i = 1; i <= 5; i++) {
            this.$options.components["com" + i] = {
                name: "com" + i,
                template: "<div>组件" + i + "</div>",
//脚手架默认导入运行时版本，运行时版本不编译template，要在入口文件引入完整版；或者用render的写法
            };
        }
    },
};
```

##### `<keep-alive>` 缓存组件

从一个页面跳转到另外一个页面（失活的组件就会被销毁），重新跳转回来的时候，想看到原来输入的内容（搜索框经常用到），就可以用keep-alive把组件包起来

> 把切换出去的组件保留在内存中，可以保留它的状态或避免重新渲染可以添加一个 keep-alive 
> 包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们，主要用于保留组件状态或避免重新渲染

  * include（String/Regexp） ： 指定缓存组件名
  * exclude（String/Regexp） ： 指定不缓存的组件名

```html
  <keep-alive  include="com1"> // 只缓存com1组件
  			  :include="/com[1|2]/"  //缓存com1和com2
     <component v-bind:is="currentTabComponent"></component>
  </keep-alive>
```

##### `<slot>` 内容分发（[详情](#插槽内容)） 

### 过渡动画 

* `<transition>`
* `<transition-group>` 

> `<transition>`用于单个元素动画，`<transition-group>`用于多个元素并解析为一个标签（默认:span）

#### 属性

* name : 过渡类名前缀（默认：v）
  > 如设置name="fade"，过渡类名变成：fade-enter / fade-enter-active / fade-leave / fade-leave-active
* css  : boolean，是否使用 CSS 过渡类（默认：true）。设置为 false，将只通过组件事件触发注册的 JavaScript 钩子。

* 自定义过渡类名（可配合animate.css框架实现过渡效果）
  * enter-class
  * enter-active-class
  * enter-to-class
  * leave-class
  * leave-active-class
  * leave-to-class
  ```html
    <transition
      enter-active-class="bounceIn"
      leave-active-class="bounceOut"
    >
    </transition>
  ```

#### 触发动画场景

> Vue会自动检测是否设置css动画或JavaScript钩子，并在下列情形中添加进入/离开过渡效果（css过渡或javascript过渡）

* 条件渲染 (使用 v-if)
* 条件展示 (使用 v-show)
* 动态组件
* 组件根节点

#### CSS过渡

* 通过CSS过渡类名
  > 组件过渡过程中，默认会有四个CSS类名自动进行切换，会有如下四个CSS类名：

  * v-enter：进入过渡的开始状态，元素被插入时生效，只应用一帧后立即删除；
  * v-enter-active：进入过渡的结束状态，元素被插入时就生效，在过渡过程完成之后移除；
  * v-leave：离开过渡的开始状态，元素被删除时触发，只应用一帧后立即删除；
  * v-leave-active：离开过渡的结束状态，元素被删除时生效，离开过渡完成之后被删除；

  ![transition](./img/transition.png "Optional title")


#### JavaScript过渡

> 通过内置事件实现过渡动画效果，可以利用第三方动画库（如：velocity.js,jquery等）实现动画效果

```html
    <transition
      v-on:before-enter="beforeEnter"
      v-on:enter="enter"
      v-on:after-enter="afterEnter"
      v-on:enter-cancelled="enterCancelled"
      v-on:before-leave="beforeLeave"
      v-on:leave="leave"
      v-on:after-leave="afterLeave"
      v-on:leave-cancelled="leaveCancelled"
    >
    </transition>
```

```javascript
    methods: {
      // 过渡进入
      // 设置过渡进入之前的组件状态
      beforeEnter: function (el) {
        // ...
      },
      // 设置过渡进入完成时的组件状态
      enter: function (el, done) {
        // ...
        done()
      },
      // 设置过渡进入完成之后的组件状态
      afterEnter: function (el) {
        // ...
      },
      enterCancelled: function (el) {
        // ...
      },
      // 过渡离开
      // 设置过渡离开之前的组件状态
      beforeLeave: function (el) {
        // ...
      },
      // 设置过渡离开完成时地组件状态
      leave: function (el, done) {
        // ...
        done()
      },
      // 设置过渡离开完成之后的组件状态
      afterLeave: function (el) {
        // ...
      },
      // leaveCancelled 只用于 v-show 中
      leaveCancelled: function (el) {
        // ...
      }
    }
```

---

【案例】

* 实现一个可复用的搜索组件
* todolist待办事项列表
* 开发goTop 返回顶部组件

【练习】

* 利用动态组件实现Tab标签切换
* 封装一个step步骤条组件

### 数据流

> 与组件层级有关

+ 单向数据流：主流框架全部采用单项数据流
+ 双向数据流：angularJS

### 数据绑定

> 与分层有关

+ 单向绑定：v-bind、{{}}
+ 双向绑定：v-model

#### props和data的区别

+ props为父组件传入的数据
+ data为组件的数据

因为两种都是挂载在实例上的，所以不要重名