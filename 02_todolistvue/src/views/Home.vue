<template>
  <div class="home">
    <TodoList/>
    <!-- 作用域插槽：为了实现组件的定制化，需要把子组件的数据拿到父组件来使用 -->
    <!--
      1、匿名插槽也要加名字default
      2、props1只是一个命名，相当于把拿过来的数据赋值给props1变量
      3、v-slot可以简写成#
      4、v-slot可以写在template或者子组件上
     -->
    <ZyySlot v-slot:default="props1">
      {{props1}}
      <h4>{{props1.username}}</h4>
      <p>性别：{{props1.gender}}</p>
      <p>年龄：{{props1.age}}</p>
    </ZyySlot>

    <ZyySlot>
      <template #info="{username,gender,age}">
        <h1>用户名：{{username}}</h1>
        <span>性别：{{gender}}</span>
        <span>年龄：{{age}}</span>
      </template>
    </ZyySlot>

    <!-- 动态组件 -->
    <DtComponent/>

    <!-- 缓存组件keepalive -->
    <Keepalive/>
  </div>
</template>

<script>
import TodoList from '../components/todolist';
import ZyySlot from '../components/zyySlot.vue';
import DtComponent from '../components/DtComponent.vue';
import Keepalive from '../components/Keepalive.vue';
export default {
  name: "Home",
  components:{
    TodoList,
    ZyySlot,
    DtComponent,
    Keepalive
  }
};
</script>
