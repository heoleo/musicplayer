<template>
  <div class="top-container">
    <div class="redcircle">
      <icon class="homesvg" name="home" w="18px" h="18px"></icon>
    </div>
    <div class="yellowcircle">
      <icon class="loginsvg" name="login" w="16px" h="16px"></icon>
    </div>
    <div class="greencircle">
      <icon class="fullsvg" name="fullScreen" w="16px" h="16px"></icon>
    </div>
    <icon class="backwardsvg" name="backward" w="45px" h="45px" @click.native="backward()"></icon>
    <icon class="forwardsvg" name="forward" w="45px" h="45px" @click.native="forward()"></icon>
    <el-input v-model="songName" placeholder="请输入内容" clearable prefix-icon="el-icon-search" size="small" @keyup.enter.native="toSearch"></el-input>
  </div>
</template>

<script>
export default {
  data() {
    return {
      songName: ''
    }
  },
  methods: {
    toSearch () {
      if (this.songName !== '') {
        this.$router.push({
          path: '/result',
          query: {
            keywords: this.songName
          }
        })
      }
    },
    backward() {
      history.back()
    },
    forward() {
      history.forward()
    }
  }
}
</script>

<style lang="scss">
  .top-container {
    z-index: 10;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: #F9F9F9;
    height: 80px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .redcircle {
      width: 20px;
      height: 20px;
      margin-left: 10px;
      background: #D66D60;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      .homesvg {
        display: none;
      }
      &:hover .homesvg {
        display: block;
      }
    }
    .yellowcircle {
      width: 20px;
      height: 20px;
      margin-left: 10px;
      background: #E4CE86;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      .loginsvg {
        display: none;
      }
      &:hover .loginsvg {
        display: block;
      }
    }
    .greencircle {
      width: 20px;
      height: 20px;
      margin-left: 10px;
      background: #84BB58;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      .fullsvg {
        display: none;
      }
      &:hover .fullsvg {
        display: block;
      }
    }
    .backwardsvg {
      margin-left: 50px;
      margin-top: 20px;
      cursor: pointer;
    }
    .forwardsvg {
      margin-left: 10px;
      margin-top: 20px;
      cursor: pointer;
    }
    .el-input {
      width: 215px;
      margin-left: auto;
      margin-right: 30px;
    }
  }
</style>
