<template>
  <div>
    详情
    <p>{{detailData}}</p>
  </div>
</template>

<script>
import goodsApi from '../api/goodsApi';
export default {
  name:'detail', //不能取名details,和内置冲突
  props:['id'],
  data () {
    return {
        detailData:{},
    }
  },

  components: {},

  methods: {
    async detailFun(){
        const {data:{data}} = await goodsApi.getDetails(this.id);
        this.detailData = data[0];
    }
  },
  created(){
      this.detailFun();
  }
}
</script>

<style scoped lang='scss'>
</style>