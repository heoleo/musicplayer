<template>
  <div class="mainindex">
    <div class="nav">
      <router-link tag="div" to="/discovery" active-class="myactive"><icon class="svg" name="discovery" w="21px" h="21px"></icon>发现音乐</router-link>
      <router-link tag="div" to="/recommand" active-class="myactive"><icon class="svg" name="command" w="21px" h="21px"></icon>推荐歌单</router-link>
      <router-link tag="div" to="/newmusic" active-class="myactive"><icon class="svg" name="newmusic" w="21px" h="21px"></icon>最新音乐</router-link>
      <router-link tag="div" to="/newmv" active-class="myactive"><icon class="svg" name="newmv" w="21px" h="21px"></icon>最新MV</router-link>
    </div>
    <div class="main">
      <router-view></router-view>
    </div>
    <!-- 播放器 -->
    <div class="player">
      <audio controls="controls" loop="loop" :src="musicUrl" autoplay></audio>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      musicUrl: ''
    }
  }
}
</script>

<style lang="scss">
  .mainindex {
    height: 100%;
    padding-top: 80px;
    padding-bottom: 80px;
    display: flex;
    .nav {
      position: fixed;
      top: 80px;
      left: 0;
      bottom: 80px;
      width: 200px;
      height: 100%;
      background: #EDEDED;
      color: #000;
      font-size: 18px;
      .myactive {
        color: #dd6d60;
      }
      div {
        width: 200px;
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        .svg {
          margin-right: 10px;
          margin-left: -10px;
        }
        &:nth-child(1) {
          margin-top: 20px;
        }
      }
    }
    .main {
      margin-left: 200px;
      flex: 1;
      padding: 10px 20px;
      overflow-x: hidden;
    }
    .player {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      background: #f1f3f4;
      z-index: 10;
      audio {
        width: 100%;
        outline: none;
        height: 54px;
      }
    }
  }
</style>
