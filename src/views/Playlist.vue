<template>
  <div class="playlist-container">
    <div class="top-wrap">
      <div class="img-wrap">
        <img :src="playlist.coverImgUrl" alt="">
      </div>
      <div class="info-wrap">
        <p class="title">{{ playlist.name }}</p>
        <div class="author-wrap">
          <img :src="playlist.avatarUrl" alt="">
          <span class="name">{{ playlist.nickname }}</span>
          <span class="time">创建于 {{ playlist.createTime }}</span>
        </div>
        <div class="tag-wrap">
          <span class="title">标签:</span>
          <ul>
            <li v-for="(item,index) in playlist.tags" :key="index">{{ item }}</li>
          </ul>
        </div>
        <div class="desc-wrap">
          <span class="title">简介:</span>
          <span class="desc">{{ playlist.description }}</span>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="歌曲列表" name="songlist">
        <table class="el-table">
          <thead>
            <th></th>
            <th></th>
            <th>音乐标题</th>
            <th>歌手</th>
            <th>专辑</th>
            <th>时长</th>
          </thead>
          <tbody>
            <tr class="el-table__row" v-for="(item,index) in playlist.tracks" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td>
                <div class="img-wrap">
                  <img :src="item.al.picUrl" alt="">
                  <icon class="play" name="play" w="25px" h="25px" @click.native="playMusic(item.id)"></icon>
                </div>
              </td>
              <td>
                <div class="song-wrap">
                  <div class="name-wrap">
                    <span>{{ item.name }}</span>
                  </div>
                  <span>副标题</span>
                </div>
              </td>
              <td>{{ item.ar[0].name }}</td>
              <td>{{ item.al.name }}</td>
              <td>{{ item.dt }}</td>
            </tr>
          </tbody>
        </table>
      </el-tab-pane>
      <el-tab-pane :label="`评论（${total + hotComment.length}）`" name="command">
        <div class="comment-wrap">
          <p class="title">
            热门评论:
            <span class="number">（{{ hotComment.length }}）</span>
          </p>
          <div class="comments-wrap">
            <div class="item" v-for="item in hotComment" :key="item.id">
              <div class="icon-wrap">
                <img :src="item.avatarUrl" alt="">
              </div>
              <div class="content-wrap">
                <div class="content">
                  <span class="name">{{ item.name }}：</span>
                  <span class="comment">
                    {{ item.content }}
                  </span>
                </div>
                <div class="re-content" v-if="item.beReplied.length!=0">
                  <span class="name">
                    {{ item.beReplied[0].user.nickname }}
                  </span>
                  <span class="comment">
                    {{ item.beReplied[0].content }}
                  </span>
                </div>
                <div class="date">{{ item.time }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="comment-wrap">
          <p class="title">
            最新评论:
            <span class="number">（{{ total }}）</span>
          </p>
          <div class="comments-wrap">
            <div class="item" v-for="item in comment" :key="item.id">
              <div class="icon-wrap">
                <img :src="item.avatarUrl" alt="">
              </div>
              <div class="content-wrap">
                <div class="content">
                  <span class="name">{{ item.name }}：</span>
                  <span class="comment">
                    {{ item.content }}
                  </span>
                </div>
                <div class="re-content" v-if="item.beReplied.length!=0">
                  <span class="name">
                    {{ item.beReplied[0].user.nickname }}
                  </span>
                  <span class="comment">
                    {{ item.beReplied[0].content }}
                  </span>
                </div>
                <div class="date">{{ item.time }}</div>
              </div>
            </div>
          </div>
        </div>
        <el-pagination background layout="prev, pager, next" :total="total" :page-size="5" :current-page="page" @current-change="handleCurrentChange"></el-pagination>
      </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      activeName: 'songlist',
      total: 1000,
      page: 1,
      playlist: {},
      hotComment: [],
      comment: []
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
    dateTime(ms) {
      var date = new Date(ms)
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      var h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      var minute = date.getMinutes()
      var second = date.getSeconds() // eslint-disable-line no-unused-vars
      minute = minute < 10 ? ('0' + minute) : minute
      second = second < 10 ? ('0' + second) : second
      return y + '-' + m + '-' + d + ' ' + ' ' + h + ':' + minute
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
      axios({
        url: 'https://autumnfish.cn/comment/playlist',
        method: 'get',
        params: {
          id: this.$route.query.id,
          limit: 5,
          offset: (this.page - 1) * 5
        }
      }).then(res => {
        const commentArray = res.data.comments.map(item => ({
          avatarUrl: item.user.avatarUrl,
          id: item.commentId,
          content: item.content,
          name: item.user.nickname,
          time: this.dateTime(item.time),
          beReplied: item.beReplied
        }))
        this.comment = commentArray
      })
    }
  },
  created() {
    // 获取歌单
    axios({
      url: 'https://autumnfish.cn/playlist/detail',
      method: 'get',
      params: {
        id: this.$route.query.id
      }
    }).then(res => {
      this.playlist = res.data.playlist
      this.playlist.tracks.map(item => {
        item.dt = this.songTime(item.dt)
        return item
      })
      this.playlist.nickname = this.playlist.creator.nickname
      this.playlist.avatarUrl = this.playlist.creator.avatarUrl
      this.playlist.createTime = this.dateTime(this.playlist.createTime)
    })
    // 获取热门评论
    axios({
      url: 'https://autumnfish.cn/comment/hot',
      method: 'get',
      params: {
        id: this.$route.query.id,
        type: 2,
        limit: 5,
        offset: (this.page - 1) * 5
      }
    }).then(res => {
      const hotCommentArray = res.data.hotComments.map(item => ({
        avatarUrl: item.user.avatarUrl,
        id: item.commentId,
        content: item.content,
        name: item.user.nickname,
        time: this.dateTime(item.time),
        beReplied: item.beReplied
      }))
      this.hotComment = hotCommentArray
    })
    // 获取最新评论
    axios({
      url: 'https://autumnfish.cn/comment/playlist',
      method: 'get',
      params: {
        id: this.$route.query.id,
        limit: 5,
        offset: (this.page - 1) * 5
      }
    }).then(res => {
      const commentArray = res.data.comments.map(item => ({
        avatarUrl: item.user.avatarUrl,
        id: item.commentId,
        content: item.content,
        name: item.user.nickname,
        time: this.dateTime(item.time),
        beReplied: item.beReplied
      }))
      this.comment = commentArray
      this.total = res.data.total
    })
  }
}
</script>

<style lang="scss">
  .playlist-container {
    max-width: 1100px;
    margin: 0 auto;
    .el-tabs__header {
      padding: 0;
      position: relative;
      margin: 0 0 15px;
      .el-tabs__item {
        font-size: 16px;
      }
    }
    .top-wrap {
      display: flex;
      margin-bottom: 10px;
      span {
        font-size: 17px;
      }
      .img-wrap {
        margin-right: 30px;
        img {
          width: 230px;
          height: 230px;
        }
      }
      .info-wrap {
        .title {
          margin-top: 0;
          margin-bottom: 20px;
        }
        .author-wrap {
          display: flex;
          align-items: center;
          margin-bottom: 25px;
          img {
            width: 35px;
            height: 35px;
            border-radius: 50%;
            margin-right: 10px;
          }
          .name {
            margin-right: 10px;
          }
          .time {
            font-size: 14px;
          }
        }
        .tag-wrap {
          display: flex;
          margin-bottom: 15px;
          .title {
            margin-right: 10px;
            margin: 0;
          }
          ul {
            display: flex;
            list-style: none;
            align-items: center;
            margin: 0;
          }
        }
        .desc-wrap {
          .title {
            margin-right: 10px;
            margin-bottom: 20px;
          }
          .desc {
            font-size: 15px;
          }
        }
      }
    }
    .el-tabs__content {
      overflow: hidden;
      position: relative;
      .el-tab-pane:nth-child(1) {
        .el-table {
          &::before {
            content: '';
            left: 0;
            bottom: 0;
            width: 100%;
            height: 1px;
          }
          border-bottom: none;
          border-collapse: collapse;
          position: relative;
          flex: 1;
          width: 100%;
          max-width: 100%;
          font-size: 14px;
          color: #606266;
          background-color: #fff;
          overflow: hidden;
          thead {
            color: #909399;
            font-weight: 500;
            th:nth-child(1) {
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
            th {
              font-weight: 400;
            }
          }
          tbody {
            border-bottom: none;
            tr {
              background: #fff;
              td {
                border-bottom: none;
                padding: 12px 0;
                min-width: 0;
                text-overflow: ellipsis;
                vertical-align: middle;
                position: relative;
                text-align: left;
                .img-wrap {
                  position: relative;
                  width: 70px;
                  height: 70px;
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
                  >span {
                    margin-top: 20px;
                    display: inline-block;
                    color: #bebebe;
                  }
                }
              }
              td:nth-child(1) {
                padding-left: 10px;
              }
            }
            tr:nth-child(2n) {
              background: #fafafa;
            }
            tr:hover {
              background: #f0e3e2;
            }
          }
        }
      }
      .el-tab-pane:nth-child(2) {
        .comment-wrap {
          margin-bottom: 70px;
          margin-top: 10px;
          .title {
            font-size: 20px;
            .number {
              color: #000;
              font-size: 18px;
            }
          }
          .comments-wrap {
            .item {
              display: flex;
              padding-top: 20px;
              .icon-wrap {
                margin-right: 15px;
                img {
                  width: 50px;
                  height: 50px;
                  border-radius: 50%;
                }
              }
              .content-wrap {
                padding-bottom: 20px;
                flex: 1;
                .content {
                  margin-bottom: 10px;
                  .name {
                    color: #517eaf;
                    font-size: 14px;
                  }
                  .comment {
                    font-size: 14px;
                  }
                }
                .re-content {
                  margin-bottom: 10px;
                  padding: 10px;
                  background: #e6e5e6;
                  border-radius: 5px;
                  .name {
                    color: #517eaf;
                    font-size: 14px;
                  }
                  .comment {
                    font-size: 14px;
                  }
                }
                .date {
                  color: #bebebe;
                  font-size: 14px;
                }
              }
              &:not(:last-child) .content-wrap {
                border-bottom: 1px solid #f2f2f1;
              }
            }
          }
        }
        .el-pagination {
          margin-top: 50px;
          text-align: center;
        }
      }
    }
  }
</style>
