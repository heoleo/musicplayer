<template>
  <div class="recommand-container">
    <div class="top-card">
      <div class="icon-wrap">
        <img :src="topshow.coverImgUrl" alt="">
      </div>
      <div class="content-wrap">
        <div class="tag">精品歌单</div>
        <div class="title">
          {{ topshow.name }}
        </div>
        <div class="info">
          {{ topshow.description }}
        </div>
      </div>
      <img :src="topshow.coverImgUrl" alt="" class="bg">
      <div class="bg-mask"></div>
    </div>
    <div class="tab-container">
      <div class="tab-bar">
        <span @click="tag='全部'" class="item" :class="{active:tag==='全部'}">全部</span>
        <span @click="tag='欧美'" class="item" :class="{active:tag==='欧美'}">欧美</span>
        <span @click="tag='华语'" class="item" :class="{active:tag==='华语'}">华语</span>
        <span @click="tag='流行'" class="item" :class="{active:tag==='流行'}">流行</span>
        <span @click="tag='说唱'" class="item" :class="{active:tag==='说唱'}">说唱</span>
        <span @click="tag='摇滚'" class="item" :class="{active:tag==='摇滚'}">摇滚</span>
        <span @click="tag='民谣'" class="item" :class="{active:tag==='民谣'}">民谣</span>
        <span @click="tag='电子'" class="item" :class="{active:tag==='电子'}">电子</span>
        <span @click="tag='轻音乐'" class="item" :class="{active:tag==='轻音乐'}">轻音乐</span>
        <span @click="tag='影视原声'" class="item" :class="{active:tag==='影视原声'}">影视原声</span>
        <span @click="tag='ACG'" class="item" :class="{active:tag==='ACG'}">ACG</span>
        <span @click="tag='怀旧'" class="item" :class="{active:tag==='怀旧'}">怀旧</span>
        <span @click="tag='治愈'" class="item" :class="{active:tag==='治愈'}">治愈</span>
        <span @click="tag='旅行'" class="item" :class="{active:tag==='旅行'}">旅行</span>
      </div>
      <div class="tab-content">
        <div class="items">
          <div class="item" v-for="item in list" :key="item.id" @click="toPlaylist(item.id)">
            <div class="img-wrap">
              <div class="num-wrap">
                播放量：
                <span class="num">{{ item.playCount }}</span>
              </div>
              <img :src="item.coverImgUrl" alt="">
              <icon class="play" name="play" w="40px" h="40px"></icon>
            </div>
            <p class="name">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>
    <el-pagination background layout="prev, pager, next" :total="1000" :page-size="10" :current-page="page" @current-change="handleCurrentChange"></el-pagination>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      total: 0,
      page: 1,
      topshow: {},
      list: [],
      tag: '全部'
    }
  },
  // 侦听器
  watch: {
    tag() {
      this.page = 1
      // 顶部精品歌单
      this.topData()
      // 歌曲列表
      this.listData()
    }
  },
  created() {
    // 顶部精品歌单
    this.topData()
    // 歌曲列表
    this.listData()
  },
  methods: {
    topData() {
      // 顶部精品歌单
      axios({
        url: 'https://autumnfish.cn/top/playlist/highquality',
        method: 'get',
        params: {
          limit: 1,
          cat: this.tag
        }
      }).then(res => {
        this.topshow = res.data.playlists[0]
      })
    },
    listData() {
      // 歌曲列表
      axios({
        url: 'https://autumnfish.cn/top/playlist',
        method: 'get',
        params: {
          limit: 10,
          offset: (this.page - 1) * 10,
          cat: this.tag
        }
      }).then(res => {
        const listArray = res.data.playlists.map(item => ({
          coverImgUrl: item.coverImgUrl,
          name: item.name,
          id: item.id,
          playCount: parseInt(item.playCount / 10000) + '万',
          description: item.description
        }))
        this.total = res.data.total
        this.list = listArray
      })
    },
    toPlaylist(id) {
      this.$router.push(`/playlist?id=${id}`)
    },
    handleCurrentChange(val) {
      this.page = val
      this.listData()
    }
  }
}
</script>

<style lang="scss">
.recommand-container {
  margin: auto;
  max-width: 1100px;
  .top-card {
    padding: 20px;
    height: 200px;
    display: flex;
    position: relative;
    overflow: hidden;
    border-radius: 5px;
    align-items: center;
    .icon-wrap {
      margin-right: 20px;
      z-index: 1;
      img {
        width: 160px;
        height: 160px;
      }
    }
    .content-wrap {
      z-index: 1;
      .tag {
        color: #dfac67;
        border: 1px solid #dfac67;
        width: 100px;
        height: 30px;
        text-align: center;
        border-radius: 5px;
        font-size: 16px;
        line-height: 30px;
        cursor: pointer;
      }
      .title {
        color: #fff;
        padding-top: 10px;
      }
      .info {
        color: #888482;
        font-size: 14px;
        padding-top: 5px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 5;
      }
    }
    .bg {
      width: 100%;
      // height: 200px;
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 0;
      filter: blur(20px);
    }
    .bg-mask {
      width: 100%;
      // height: 200px;
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0,0,1,0.5);
    }
  }
  .tab-container {
    padding-top: 30px;
    .tab-bar {
      display: flex;
      justify-content: flex-end;
      .item {
        font-size: 15px;
        color: grey;
        margin-right: 20px;
        cursor: pointer;
      }
      .active {
        color: #dd6d60;
      }
    }
    .tab-content {
      margin-top: 20px;
      .items {
        display: flex;
        flex-wrap: wrap;
        .item {
          width: 200px;
          margin: 10px;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          .img-wrap {
            position: relative;
            .num-wrap {
              position: absolute;
              top: -30px;
              left: 0;
              font-size: 14px;
              color: #fff;
              line-height: 30px;
              background: rgba(0,0,0,.5);
              height: 30px;
              width: 100%;
              padding-left: 5px;
              overflow: hidden;
            }
            &:hover .num-wrap {
              top: 0;
              transition: top 0.5s;
            }
            img {
              width: 200px;
              height: 200px;
              border-radius: 5px;
            }
            .play {
              position: absolute;
              right: 10px;
              bottom: 15px;
              opacity: 0;
            }
            &:hover .play {
              opacity: 1;
              transition: opacity 0.5s;
            }
          }
          .name {
            margin: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 14px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
        }
      }
    }
  }
  .el-pagination {
    margin-top: 50px;
    text-align: center;
  }
}
</style>
