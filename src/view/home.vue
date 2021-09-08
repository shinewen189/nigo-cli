<template>
  <div>
    <HelloWorld></HelloWorld>
    <div class="box2"></div>
    <div class="box">
      <span>这是一个测试程序！！ + {{ test }}</span>
      <button>加加</button>
    </div>
  </div>
</template>

<script>
import HelloWorld from '@/components/hello-world/hello-world.vue'

export default {
  components: {
    HelloWorld
  },
  name: 'home',
  data() {
    return {
      test: 0
    }
  },
  mounted() {
    this.test = this.getData(2, 3)
    this.test = 1
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
