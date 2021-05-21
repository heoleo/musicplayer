<template>
  <div class="discovery-container">
    <!-- 轮播图 -->
    <el-carousel :interval="4000" type="card" height="230px" arrow="never">
      <!-- 循环轮播图片 -->
      <el-carousel-item class="llj" v-for="item in banners" :key="item.id">
        <img :src="item.imageUrl">
        <icon class="play" name="play" w="60px" h="60px" @click.native="playMusic(item.id)"></icon>
      </el-carousel-item>
    </el-carousel>
    <!-- 推荐歌单 -->
    <div class="recommand">
      <h3 class="title">推荐歌单</h3>
      <div class="items">
        <div class="item" v-for="item in list" :key="item.id">
          <div class="img-wrap">
            <div class="desc-wrap">
              <span class="desc">{{ item.copywriter }}</span>
            </div>
            <img :src="item.picUrl" alt="">
            <icon class="play" name="play" w="40px" h="40px" @click.native="toPlaylist(item.id)"></icon>
          </div>
          <p class="name">{{ item.name }}</p>
        </div>
      </div>
    </div>
    <!-- 最新音乐 -->
    <div class="news">
      <h3 class="title">最新音乐</h3>
      <div class="items">
        <div class="item" v-for="item in news" :key="item.id">
          <div class="img-wrap">
            <img :src="item.picUrl" alt="">
            <icon class="play" name="play" w="30px" h="30px" @click.native="playMusic(item.id)"></icon>
          </div>
          <div class="song-wrap">
            <div class="song-name">
              {{ item.name }}
            </div>
            <div class="singer">
              {{ item.artists[0]['name'] }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 推荐MV -->
    <div class="mvs">
      <h3 class="title">推荐MV</h3>
      <div class="items">
        <div class="item" v-for="item in mvs" :key="item.id" @click="toMv(item.id)">
          <div class="img-wrap">
            <img :src="item.picUrl" alt="">
            <icon class="play" name="play" w="40px" h="40px"></icon>
            <div class="num-wrap">
              <icon class="playcount" name="playcount" w="15px" h="15px"></icon>
              <div class="num">
                {{ item.playCount }}
              </div>
            </div>
          </div>
          <div class="info-wrap">
            <div class="name">
              {{ item.copywriter }}
            </div>
            <div class="singer">
              {{ item.artists[0].name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      banners: [],
      list: [],
      news: [],
      mvs: []
    }
  },
  methods: {
    playMusic(id) {
      axios({
        url: 'https://autumnfish.cn/song/url',
        method: 'get',
        params: {
          id
        }
      }).then(res => {
        const url = res.data.data[0].url
        this.$parent.musicUrl = url
      })
    },
    toPlaylist(id) {
      this.$router.push(`/playlist?id=${id}`)
    },
    toMv(id) {
      this.$router.push(`/mv?id=${id}`)
    }
  },
  created() {
    // 轮播图
    axios({
      url: 'https://autumnfish.cn/banner',
      method: 'get'
    }).then(res => {
      // this.banners = res.data.banners
      console.log(res.data.banners)
      const bannerArray = res.data.banners.map(item => ({
        imageUrl: item.imageUrl,
        id: item.targetId
      }))
      this.banners = bannerArray
    })
    // 推荐歌单
    axios({
      url: 'https://autumnfish.cn/personalized',
      method: 'get',
      params: {
        limit: 10
      }
    }).then(res => {
      const listArray = res.data.result.map(item => ({
        picUrl: item.picUrl,
        name: item.name,
        id: item.id,
        copywriter: item.copywriter
      }))
      this.list = listArray
    })
    // 最新音乐
    axios({
      url: 'https://autumnfish.cn/personalized/newsong',
      method: 'get'
    }).then(res => {
      const newsArray = res.data.result.map(item => ({
        picUrl: item.picUrl,
        name: item.name,
        artists: item.song.artists,
        id: item.id
      }))
      this.news = newsArray
    })
    // 推荐MV
    axios({
      url: 'https://autumnfish.cn/personalized/mv',
      method: 'get'
    }).then(res => {
      const mvsArray = res.data.result.map(item => ({
        picUrl: item.picUrl,
        copywriter: item.copywriter,
        id: item.id,
        playCount: item.playCount,
        artists: item.artists
      }))
      this.mvs = mvsArray
    })
  }
}
</script>

<style lang="scss">
  .discovery-container {
    margin: auto;
    max-width: 1100px;
    .el-carousel {
      overflow-x: hidden;
      position: relative;
      img {
        width: 100%;
        height: 100%;
        border-radius: 10px;
        position: relative;
      }
      .play {
        opacity: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
      }
      .is-active {
        &:hover .play {
          opacity: 1;
          transition: opacity 2s;
        }
      }
    }
    .recommand {
      margin-bottom: 40px;
      .title {
        margin-bottom: 20px;
        padding-left: 8px;
        font-weight: 400;
      }
      .items {
        display: flex;
        flex-wrap: wrap;
        .item {
          width: 200px;
          margin: 10px;
          position: relative;
          overflow: hidden;
          .img-wrap {
            position: relative;
            .desc-wrap {
              position: absolute;
              width: 100%;
              left: 0;
              font-size: 16px;
              color: #fff;
              background: rgba(0,0,0,.5);
              max-height: 50px;
              padding: 5px;
              overflow: hidden;
              text-overflow: ellipsis;
              top: -50px;
              span {
                font-size: 14px;
              }
            }
            img {
              width: 200px;
              height: 200px;
              border-radius: 5px;
              &:hover {
                outline: dashed 1px #dd6d60;
              }
            }
            .play {
              position: absolute;
              right: 10px;
              bottom: 13px;
              cursor: pointer;
              opacity: 0;
            }
            &:hover .play{
              opacity: 1;
              transition: opacity 1s;
            }
            &:hover .desc-wrap{
              top: 0px;
              transition: top 0.5s;
            }
          }
          p {
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 14px;
            margin: 0;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
          }
        }
      }
    }
    .news {
      margin-bottom: 40px;
      .title {
        font-weight: 400;
        margin-bottom: 20px;
        padding-left: 8px;
      }
      .items {
        height: 500px;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        .item {
          height: 100px;
          width: 50%;
          display: flex;
          align-items: center;
          padding-left: 15px;
          &:hover {
            background: #f5f5f5;
          }
          .img-wrap {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            img {
              width: 80px;
              height: 80px;
            }
            .play {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%,-50%);
              opacity: 0;
            }
            &:hover .play {
              opacity: 1;
              transition: opacity 1s;
            }
            &:hover img {
              outline: dashed 1px #dd6d60;
              transition: opacity 1s;
            }
          }
          .song-wrap {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            height: 100%;
            padding: 10px;
            font-size: 16px;
            .singer {
              font-size: 14px;
              color: grey;
            }
          }
        }
      }
    }
    .mvs {
      .title {
        font-weight: 400;
        margin-bottom: 20px;
        padding-left: 8px;
      }
      .items {
        display: flex;
        justify-content: space-around;
        .item {
          cursor: pointer;
          width: 250px;
          .img-wrap {
            width: 100%;
            position: relative;
            img {
              width: 100%;
              border-radius: 5px;
            }
            &:hover .play {
              transition: opacity 1s;
              opacity: 1;
            }
            .play {
              position: absolute;
              top: 35%;
              left: 40%;
              opacity: 0;
            }
            .num-wrap {
              position: absolute;
              color: #fff;
              top: 0;
              right: 0;
              display: flex;
              align-content: center;
              font-size: 15px;
              padding-right: 5px;
              padding-top: 2px;
              .playcount {
                position: relative;
                transform: translate(-25%,3%);
              }
            }
          }
          .info-wrap {
            .name {
              font-size: 15px;
              margin-bottom: 5px;
            }
            .singer {
              font-size: 14px;
              color: #c5c5c5;
            }
          }
        }
      }
    }
  }
</style>
