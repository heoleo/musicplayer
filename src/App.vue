<template>
  <div id="app">
    <top></top>
    <mainIndex></mainIndex>
  </div>
</template>

<script>
import mainIndex from './components/MainIndex'
import top from './components/Top'
export default {
  components: {
    mainIndex,
    top
  }
}
</script>

<style lang="scss">
html,body {
  margin: 0px;
  padding: 0px;
  box-sizing: border-box;
  height: 100%;
  font-weight: 400;
  font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,"\5FAE\8F6F\96C5\9ED1",Arial,sans-serif;
  img {
    pointer-events: none
  }
}

</style>
