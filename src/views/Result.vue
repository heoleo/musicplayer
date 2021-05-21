<template>
  <div class="result-container">
    <div class="title-wrap">
      <h2 class="title">{{ $route.query.keywords }}</h2>
      <span class="sub-title">
        找到{{ count }}个结果
      </span>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="歌曲" name="songs">
        <table class="el-table">
          <thead>
            <th></th>
            <th>音乐标题</th>
            <th>歌手</th>
            <th>专辑</th>
            <th>时长</th>
          </thead>
          <tbody>
            <tr class="el-table__row" v-for="(item,index) in list" :key="item.id" @dblclick="playMusic(item.id)">
              <td>{{index + 1 }}</td>
              <td>
                <div class="song-wrap">
                  <div class="name-wrap">
                    <span class="name">{{ item.name }}</span>
                    <icon v-if="item.mvid!=0" class="playmv" name="playmv" w="16px" h="16px" ></icon>
                  </div>
                  <span class="suv-name" v-if="item.alias.length!=0">
                    {{ item.alias[0] }}
                  </span>
                </div>
              </td>
              <td>{{ item.artist }}</td>
              <td>{{ item.album.name }}</td>
              <td>{{ item.duration }}</td>
            </tr>
          </tbody>
        </table>
      </el-tab-pane>
      <el-tab-pane label="歌单" name="lists">
        <div class="items">
          <div class="item" v-for="item in playlists" :key="item.id" @click="toPlaylist(item.id)">
            <div class="img-wrap">
              <div class="num-wrap">
                播放量：
                <span class="num">{{ item.playCount }}</span>
              </div>
              <img :src="item.coverImgUrl" alt="">
              <icon class="play" name="play" w="40px" h="40px" ></icon>
            </div>
            <p class="name">{{ item.name }}</p>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="MV" name="mvs">
        <div class="items mv">
          <div class="item" v-for="item in mvs" :key="item.id" @click="toMv(item.id)">
            <div class="img-wrap">
              <img :src="item.cover" alt="">
              <icon class="play" name="play" w="40px" h="40px" ></icon>
              <div class="num-wrap">
                <icon class="playcount" name="playcount" w="12px" h="12px" ></icon>
                <div class="num">{{ item.playCount }}</div>
              </div>
              <span class="time">{{ item.duration }}</span>
            </div>
            <div class="info-wrap">
              <div class="name">{{ item.name }}</div>
              <div class="singer">{{ item.artistName }}</div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-pagination background layout="prev, pager, next" :total="count"  :page-size="limit" :current-page="page" @current-change="handleCurrentChange"></el-pagination>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      activeName: 'songs',
      type: 1,
      list: [],
      playlists: [],
      mvs: [],
      count: 0,
      limit: 15,
      page: 1
    }
  },
  methods: {
    songTime(ms) {
      let min = parseInt(ms / 1000 / 60)
      if (min < 10) {
        min = '0' + min
      }
      let sec = parseInt(ms / 1000 % 60)
      if (sec < 10) {
        sec = '0' + sec
      }
      return `${min}:${sec}`
    },
    songCount(count) {
      if (count > 10000) {
        return parseInt(count / 10000) + '万'
      } else {
        return count
      }
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
    handleCurrentChange(val) {
      this.page = val
      switch (this.activeName) {
        case 'songs':
          this.type = 1
          this.limit = 15
          break
        case 'lists':
          this.type = 1000
          this.limit = 15
          break
        case 'mvs':
          this.type = 1004
          this.limit = 12
          break
        default:
          break
      }

      axios({
        url: 'https://autumnfish.cn/search',
        method: 'get',
        params: {
          keywords: this.$route.query.keywords,
          limit: this.limit,
          offset: (this.page - 1) * this.limit,
          // offset: 0,
          type: this.type
        }
      }).then(res => {
        if (this.type === 1) {
          const listArray = res.data.result.songs.map(item => ({
            name: item.name,
            id: item.id,
            artist: item.artists[0].name,
            album: item.album,
            alias: item.alias,
            duration: this.songTime(item.duration),
            mvid: item.mvid
          }))
          this.count = res.data.result.songCount
          this.list = listArray
        }
        if (this.type === 1000) {
          const playlistArray = res.data.result.playlists.map(item => ({
            id: item.id,
            coverImgUrl: item.coverImgUrl,
            playCount: this.songCount(item.playCount),
            name: item.name
          }))
          this.count = res.data.result.playlistCount
          this.playlists = playlistArray
        }
        if (this.type === 1004) {
          const mvsArray = res.data.result.mvs.map(item => ({
            id: item.id,
            cover: item.cover,
            name: item.name,
            artistName: item.artistName,
            playCount: this.songCount(item.playCount),
            duration: this.songTime(item.duration)
          }))
          this.count = res.data.result.mvCount
          this.mvs = mvsArray
        }
      })
    },
    toPlaylist(id) {
      this.$router.push(`/playlist?id=${id}`)
    },
    toMv(id) {
      this.$router.push(`/mv?id=${id}`)
    }
  },
  watch: {
    activeName() {
      this.page = 1
      switch (this.activeName) {
        case 'songs':
          this.type = 1
          this.limit = 15
          break
        case 'lists':
          this.type = 1000
          this.limit = 15
          break
        case 'mvs':
          this.type = 1004
          this.limit = 12
          break
        default:
          break
      }
      axios({
        url: 'https://autumnfish.cn/search',
        method: 'get',
        params: {
          keywords: this.$route.query.keywords,
          limit: this.limit,
          offset: (this.page - 1) * this.limit,
          // offset: 0,
          type: this.type
        }
      }).then(res => {
        if (this.type === 1) {
          const listArray = res.data.result.songs.map(item => ({
            name: item.name,
            id: item.id,
            artist: item.artists[0].name,
            album: item.album,
            alias: item.alias,
            duration: this.songTime(item.duration),
            mvid: item.mvid
          }))
          this.count = res.data.result.songCount
          this.list = listArray
        }
        if (this.type === 1000) {
          const playlistArray = res.data.result.playlists.map(item => ({
            id: item.id,
            coverImgUrl: item.coverImgUrl,
            playCount: this.songCount(item.playCount),
            name: item.name
          }))
          this.count = res.data.result.playlistCount
          this.playlists = playlistArray
        }
        if (this.type === 1004) {
          const mvsArray = res.data.result.mvs.map(item => ({
            id: item.id,
            cover: item.cover,
            name: item.name,
            artistName: item.artistName,
            playCount: this.songCount(item.playCount),
            duration: this.songTime(item.duration)
          }))
          this.count = res.data.result.mvCount
          this.mvs = mvsArray
        }
      })
    }
  },
  created() {
    axios({
      url: 'https://autumnfish.cn/search',
      method: 'get',
      params: {
        keywords: this.$route.query.keywords,
        limit: this.limit,
        offset: (this.page - 1) * this.limit,
        // offset: 0,
        type: 1
      }
    }).then(res => {
      const listArray = res.data.result.songs.map(item => ({
        name: item.name,
        id: item.id,
        artist: item.artists[0].name,
        album: item.album,
        alias: item.alias,
        duration: this.songTime(item.duration),
        mvid: item.mvid
      }))
      this.count = res.data.result.songCount
      this.list = listArray
    })
  }
}
</script>

<style lang="scss">
  .result-container {
    max-width: 1100px;
    margin: 0 auto;
    // 导航栏字体设置
    .el-tabs__item {
      font-size: 18px;
    }
    .title-wrap {
      display: flex;
      align-items: flex-end;
      margin-bottom: 30px;
      .title {
        margin: 0;
        margin-right: 10px;
      }
      .sub-title {
        font-size: 15px;
        color: #bebebe;
      }
    }
    .el-tabs {
      .el-tab-pane:nth-child(1) {
        .el-table {
          border-bottom: none;
          border-collapse: collapse;
          &::before {
            content: "";
            position: absolute;
            background-color: #ebeef5;
            z-index: 1;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 1px;
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
              width: 300px;
            }
            th:nth-child(3) {
              width: 200px;
            }
          }
          tbody {
            border-bottom: none;
            tr {
              background: #fff;
              &:nth-child(2n) {
                background: #fafafa;
              }
              &:hover {
                background: #f0e3e2;
              }
              td:first-child {
                padding-left: 10px;
              }
              td {
                border-bottom: none;
                .song-wrap {
                  .name-wrap {
                    .playmv {
                      margin-left: 4px;
                      margin-bottom: 2px;
                    }
                  }
                  .suv-name {
                    margin-top: 20px;
                    display: inline-block;
                    color: #bebebe;
                  }
                }
              }
            }
          }
        }
      }
      .el-tab-pane:nth-child(2) {
        .items {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
          .item {
            width: 200px;
            cursor: pointer;
            margin-right: 20px;
            margin-bottom: 20px;
            .img-wrap {
              width: 100%;
              position: relative;
              &:hover img {
                outline: dashed 1px #dd6d60;
              }
              .num-wrap {
                display: flex;
                align-items: center;
                position: absolute;
                color: #fff;
                top: 0;
                right: 0;
                font-size: 15px;
                padding-right: 5px;
                padding-top: 2px;
              }
              img {
                width: 100%;
                border-radius: 5px;
              }
              &:hover .play {
                transition: opacity 0.3s;
                opacity: 1;
              }
              .play {
                opacity: 0;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
              }
            }
            .name {
              margin: 0;
              font-size: 15px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
            }
          }
        }
      }
      .el-tab-pane:nth-child(3) {
        .items {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
          .item {
            cursor: pointer;
            width: 250px;
            margin-right: 20px;
            margin-bottom: 20px;
            .img-wrap {
              width: 100%;
              position: relative;
              &:hover img {
                outline: dashed 1px #dd6d60;
              }
              &:hover .play {
                transition: opacity 0.3s;
                opacity: 1;
              }
              img {
                width: 100%;
                border-radius: 5px;
              }
              .play {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
                opacity: 0;
              }
              .num-wrap {
                display: flex;
                align-items: center;
                position: absolute;
                color: #fff;
                top: 0;
                right: 0;
                font-size: 15px;
                padding-right: 5px;
                padding-top: 2px;
                .playcount {
                  margin-right: 5px;
                }
              }
              .time {
                position: absolute;
                bottom: 5px;
                right: 5px;
                color: #fff;
                font-size: 15px;
              }
            }
            .info-wrap {
              .name {
                font-size: 15px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
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
    .el-pagination {
      margin-top: 50px;
      text-align: center;
    }
  }
</style>
