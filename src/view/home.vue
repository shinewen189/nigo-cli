<template>
  <div class="box">
    <span>这是一个测试程序</span>
  </div>
</template>

<script>
export default {
  name: 'home',
  mounted() {}
}
</script>

<style lang="less" scoped>
.box {
  width: 500px;
  height: 500px;
  background-color: #000;
  span {
    width: 100px;
    height: 100px;
    color: #fff;
    background-color: red;
    display: inline-block;
  }
}
</style>
