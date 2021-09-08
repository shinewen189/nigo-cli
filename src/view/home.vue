<template>
  <div>
    <h2 class="h2">测试组件</h2>
    <div class="pagination">
      <Pagination
        :page-total="10000"
        :page-num="7"
        :page-size="8"
        @currentCallBack="currentCallBack"
      ></Pagination>
    </div>
  </div>
</template>

<script>
import Pagination from '../components/pagination.vue'

export default {
  name: 'pagination',
  components: {
    Pagination
  },
  methods: {
    currentCallBack(index) {
      console.log(index)
    }
  }
}
</script>

<style scoped>
.h2 {
  text-align: center;
}
</style>
