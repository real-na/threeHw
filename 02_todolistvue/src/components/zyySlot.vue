<template>
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
</template>

<script>
export default {
  data () {
    return {
        userInfo:{
            username:'jingjing',
            password:123,
            role:'vip',
            avatar:'img/jj.png',
            gender:'女',
            age:36,
        }
    }
  },

  components: {},

  methods: {}
}
</script>

<style scoped lang='scss'>
</style>