<template>
  <div class="pagination">
    <Pagination
      :page-total="10000"
      :page-num="7"
      :page-size="8"
      @currentCallBack="currentCallBack"
    ></Pagination>
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

<style scoped></style>
