<template>
  <div>
    <div class="box2"></div>
    <div class="box">
      <span>这是一个测试程序！！ + {{ test }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      test: 0
    }
  },
  mounted() {
    this.test = this.getData(2, 3)
  },
  methods: {
    getData(a, b) {
      return a + b
    }
  }
}
</script>

<style lang="less" scoped>
.box2 {
  width: 100px;
  height: 100px;
  background-color: aqua;
}
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
