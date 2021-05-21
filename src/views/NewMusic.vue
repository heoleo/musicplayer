<template>
  <div class="newmusic-container">
    <div class="tab-bar">
      <span class="item" :class="{active:type==0}" @click="type=0">全部</span>
      <span class="item" :class="{active:type==7}" @click="type=7">华语</span>
      <span class="item" :class="{active:type==96}" @click="type=96">欧美</span>
      <span class="item" :class="{active:type==8}" @click="type=8">日本</span>
      <span class="item" :class="{active:type==16}" @click="type=16">韩国</span>
    </div>
    <table class="el-table playlist-table">
      <thead>
        <th></th>
        <th></th>
        <th>音乐标题</th>
        <th>歌手</th>
        <th>专辑</th>
        <th>时长</th>
      </thead>
      <tbody>
        <tr class="el-table__row" v-for="(item,index) in songList" :key="item.id">
          <td>{{ index + 1 }}</td>
          <td>
            <div class="img-wrap">
              <img :src="item.picUrl" alt="">
              <icon class="play" name="play" w="25px" h="25px" @click.native="playMusic(item.id)"></icon>
            </div>
          </td>
          <td>
            <div class="song-wrap">
              <div class="name-wrap">
                <span>{{ item.songname }}</span>
                <icon class="playmv" name="playmv" w="16px" h="16px" @click.native="toMv(item.mvid)"></icon>
              </div>
              <span>{{ item.description }}</span>
            </div>
          </td>
          <td>{{ item.artists }}</td>
          <td>{{  item.albumname }}</td>
          <td>{{ item.duration }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      type: 0,
      songList: []
    }
  },
  methods: {
    songData() {
      axios({
        url: 'https://autumnfish.cn/top/song',
        method: 'get',
        params: {
          type: this.type
        }
      }).then(res => {
      // const sliceArray = res.data.data.slice(0,10)
      // 切割数组，取10条
        console.log(res.data)
        const songArray = res.data.data.slice(0, 10).map(item => ({
        // 过滤数组，返回一个只有我们用到值的对象
          mp3Url: item.mp3Url,
          duration: this.songTime(item.duration),
          picUrl: item.album.picUrl,
          songname: item.name,
          albumname: item.album.name,
          id: item.id,
          artists: item.album.artists[0].name,
          description: item.album.description,
          mvid: item.album.id
        }))
        // .map(item => {
        //   // 对新的数组的duration进行处理
        //   let min = parseInt(item.duration / 60000)
        //   if (min < 10) {
        //     min = '0' + min
        //   }
        //   let sec = parseInt((item.duration / 1000) % 60)
        //   if (sec < 10) {
        //     sec = '0' + sec
        //   }
        //   item.duration = `${min}：${sec}`
        //   return item
        // })
        // for (let i = 0; i < songArray.length; i++) {
        //   const ms = songArray[i].duration
        //   let min = parseInt(ms / 60000)
        //   if (min < 10) {
        //     min = '0' + min
        //   }
        //   let sec = parseInt((ms / 1000) % 60)
        //   if (sec < 10) {
        //     sec = '0' + sec
        //   }
        //   songArray[i].duration = `${min}：${sec}`
        // }
        this.songList = songArray
      })
    },
    songTime(ms) {
      let min = parseInt(ms / 60000)
      if (min < 10) {
        min = '0' + min
      }
      let sec = parseInt((ms / 1000) % 60)
      if (sec < 10) {
        sec = '0' + sec
      }
      return `${min}:${sec}`
    },
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
    toMv(id) {
      this.$router.push(`/mv?id=${id}`)
    }
  },
  // 侦听器
  watch: {
    type() {
      this.songData()
    }
  },
  created() {
    this.songData()
  }
}
</script>

<style lang="scss">
  .newmusic-container {
    max-width: 1100px;
    margin: 0 auto;
    .tab-bar {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 15px;
      .item {
        font-size: 16px;
        color: grey;
        margin-right: 20px;
        cursor: pointer;
      }
      .item:last-child {
        margin-right: 0;
      }
      .active {
        color: #dd6d60;
      }
    }
    .el-table,.playlist-table{
      border-bottom: none;
      border-collapse: collapse;
      position: relative;
      box-sizing: border-box;
      flex: 1;
      width: 100%;
      max-width: 100%;
      font-size: 14px;
      background-color: #fff;
      color: #606266;
      overflow: hidden;
      &::before {
        content: "";
        position: absolute;
        background-color: #ebeef5;
        z-index: 1;
      }
      thead {
        color: #909399;
        font-weight: 500;
        th {
          font-weight: 400;
        }
        th:first-child {
          width: 50px;
        }
        th:nth-child(2) {
          width: 130px;
        }
        th:nth-child(3) {
          width: 300px;
        }
        th:nth-child(4) {
          width: 200px;
        }
        // th:nth-child(5) {
        //   width: 400px;
        // }
        // th:last-child {

        // }
      }
      tbody {
        border-bottom: none;
        tr:nth-child(2n) {
          background: #fafafa;
        }
        tr:hover {
          background: #f0e3e2;
        }
        tr {
          background: #fff;
          td:first-child {
            padding-left: 10px;
          }
          td {
            border-bottom: none;
            .img-wrap {
              position: relative;
              width: 70px;
              height: 70px;
              &:hover img {
                  outline:dashed 1px #dd6d60;
              }
              img {
                width: 70px;
                height: 70px;
                border-radius: 5px;
              }
              .play {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
                cursor: pointer;
              }
            }
            .song-wrap {
              .name-wrap {
                .playmv {
                  // opacity: 0;
                  padding-left: 5px;
                  cursor: pointer;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
