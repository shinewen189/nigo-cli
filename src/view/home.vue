<template>
  <div class="box"><span></span></div>
</template>

<script>
export default {
  name: 'home'
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
    background-color: red;
    display: inline-block;
  }
}
</style>
