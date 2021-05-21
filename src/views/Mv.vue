<template>
  <div class="mv-container">
    <div class="mv-wrap">
      <h3 class="title">
        MV详情
      </h3>
      <div class="video-wrap">
        <video controls :src="mvUrl"></video>
      </div>
      <div class="info-wrap">
        <div class="singer-info">
          <div class="avatar-wrap">
            <img :src="mvInfo.artistPic" alt="">
          </div>
          <span class="name">{{ mvInfo.artistName }}</span>
        </div>
        <div class="mv-info">
          <h2 class="title">{{ mvInfo.name }}</h2>
          <span class="date">发布于 {{ mvInfo.publishTime }}</span>
          <span class="number">播放：{{ mvInfo.playCount }}次</span>
          <p class="desc">{{ mvInfo.desc }}</p>
        </div>
      </div>
      <div class="comment-wrap" v-if="page === 1">
        <p class="title">
          热门评论：
          <span class="number">（{{ hotComments.length }}）</span>
        </p>
        <div class="comments-wrap" v-for="item in hotComments" :key="item.id">
          <div class="item">
            <div class="icon-wrap">
              <img :src="item.avatarUrl" alt="">
            </div>
            <div class="content-wrap">
              <div class="content">
                <span class="name">{{ item.nickname }}:</span>
                <span class="comment">{{ item.content }}</span>
              </div>
              <div class="re-content" v-if="item.beReplied.length!=0">
                <span class="name">
                  {{ item.beReplied[0].user.nickname }}:
                </span>
                <span class="comment">
                  {{ item.beReplied[0].content }}
                </span>
              </div>
              <div class="date">
                {{ item.time }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="comment-wrap">
        <p class="title">
          最新评论：
          <span class="number">（{{ total }}）</span>
        </p>
        <div class="comments-wrap" v-for="item in comments" :key="item.id">
          <div class="item">
            <div class="icon-wrap">
              <img :src="item.avatarUrl" alt="">
            </div>
            <div class="content-wrap">
              <div class="content">
                <span class="name">{{ item.nickname }}:</span>
                <span class="comment">{{ item.content }}</span>
              </div>
              <div class="re-content" v-if="item.beReplied.length!=0">
                <span class="name">
                  {{ item.beReplied[0].user.nickname }}:
                </span>
                <span class="comment">
                  {{ item.beReplied[0].content }}
                </span>
              </div>
              <div class="date">
                {{ item.time }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-pagination background layout="prev, pager, next" :total="total" :page-size="limit" :current-page="page" @current-change="handleCurrentChange"></el-pagination>
    </div>
    <div class="mv-recommend">
      <h3 class="title">
        相关推荐
      </h3>
      <div class="mvs">
        <div class="items">
          <div class="item" v-for="item in mvs" :key="item.id">
            <div class="img-wrap">
              <img :src="item.cover" alt="">
              <icon class="play" name="play" w="40px" h="40px" ></icon>
              <div class="num-wrap">
                <icon class="playcount" name="playcount" w="12px" h="12px" ></icon>
                <div class="num">{{ item.playCount }}</div>
              </div>
              <span class="time">
                {{ item.duration }}
              </span>
            </div>
            <div class="info-wrap">
              <div class="name">
                {{ item.name }}
              </div>
              <div class="singer">
                {{ item.artistName }}
              </div>
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
      total: 0,
      page: 1,
      limit: 6,
      mvUrl: '',
      mvInfo: {},
      mvs: [],
      hotComments: [],
      comments: []
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
    handleCurrentChange(val) {
      this.page = val
      axios({
        url: 'https://autumnfish.cn/comment/mv',
        method: 'get',
        params: {
          id: this.$route.query.id,
          limit: this.limit,
          offset: (this.page - 1) * 5
        }
      }).then(res => {
        const commentsArray = res.data.comments.map(item => ({
          id: item.commentId,
          content: item.content,
          beReplied: item.beReplied,
          time: this.dateTime(item.time),
          nickname: item.user.nickname,
          avatarUrl: item.user.avatarUrl
        }))
        this.comments = commentsArray
        this.total = res.data.total
      })
    }
  },
  created() {
    // MV播放器
    axios({
      url: 'https://autumnfish.cn/mv/url',
      method: 'get',
      params: {
        id: this.$route.query.id
      }
    }).then(res => {
      this.mvUrl = res.data.data.url
    })
    // MV信息
    axios({
      url: 'https://autumnfish.cn/mv/detail',
      method: 'get',
      params: {
        mvid: this.$route.query.id
      }
    }).then(res => {
      const data = res.data.data
      this.mvInfo = {
        name: data.name,
        desc: data.desc,
        artistName: data.artistName,
        artistId: data.artistId,
        playCount: this.songCount(data.playCount),
        publishTime: data.publishTime,
        artistPic: ''
      }
      // 歌手信息
      axios({
        url: 'https://autumnfish.cn/artists',
        method: 'get',
        params: {
          id: data.artistId
        }
      }).then(res => {
        this.mvInfo.artistPic = res.data.artist.picUrl
      })
    })
    // 相关MV
    axios({
      url: 'https://autumnfish.cn/simi/mv',
      method: 'get',
      params: {
        mvid: this.$route.query.id
      }
    }).then(res => {
      const mvsArray = res.data.mvs.map(item => ({
        artistName: item.artistName,
        playCount: this.songCount(item.playCount),
        cover: item.cover,
        duration: this.songTime(item.duration),
        name: item.name,
        id: item.id
      }))
      this.mvs = mvsArray
    })
    // 评论
    axios({
      url: 'https://autumnfish.cn/comment/mv',
      method: 'get',
      params: {
        id: this.$route.query.id,
        limit: this.limit,
        offset: 0
      }
    }).then(res => {
      const hotArray = res.data.hotComments.map(item => ({
        id: item.commentId,
        content: item.content,
        beReplied: item.beReplied,
        time: this.dateTime(item.time),
        nickname: item.user.nickname,
        avatarUrl: item.user.avatarUrl
      }))
      this.hotComments = hotArray
      const commentsArray = res.data.comments.map(item => ({
        id: item.commentId,
        content: item.content,
        beReplied: item.beReplied,
        time: this.dateTime(item.time),
        nickname: item.user.nickname,
        avatarUrl: item.user.avatarUrl
      }))
      this.comments = commentsArray
      this.total = res.data.total
    })
  }
}
</script>

<style lang="scss">
  .mv-container {
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    .title {
      margin-bottom: 20px;
      margin-top: 0px;
    }
    .mv-wrap {
      width: 700px;
      margin-right: 35px;
      .video-wrap {
        width: 100%;
        height: 390px;
        margin-bottom: 20px;
        video {
          border-radius: 5px;
          height: 100%;
          width: 100%;
          outline: none;
        }
      }
      .info-wrap {
        margin-bottom: 50px;
        .singer-info {
          display: flex;
          align-items: center;
          margin-bottom: 35px;
          .avatar-wrap {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            margin-right: 10px;
            overflow: hidden;
            img {
              height: 100%;
            }
          }
        }
        .mv-info {
          .title {
            font-size: 30px;
          }
          .date {
            color: #bebebe;
            font-size: 14px;
            margin-right: 25px;
          }
          .number {
            color: #bebebe;
            font-size: 14px;
          }
          .desc {
            font-size: 15px;
            margin-top: 20px;
          }
        }
      }
      .comment-wrap {
        margin-bottom: 70px;
        .title {
          font-size: 25px;
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
                padding: 10px;
                background-color: #e6e5e6;
                border-radius: 5px;
                margin-bottom: 10px;
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
                margin-right: 25px;
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
    .mv-recommend {
      flex: 1;
      .mvs {
        .items {
          display: flex;
          flex-wrap: wrap;
          .item {
            width: 100%;
            display: flex;
            align-items: center;
            padding: 10px;
            cursor: pointer;
            &:hover {
              background: #f5f5f5;
            }
            .img-wrap {
              width: 180px;
              position: relative;
              margin-right: 10px;
              img {
                width: 100%;
                border-radius: 5px;
              }
              &:hover .play {
                opacity: 1;
                transition: opacity 0.7s;
              }
              &:hover img {
                outline: dashed 1px #dd6d60;
              }
              .play {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
                opacity: 0;
              }
              .num-wrap {
                position: absolute;
                color: #fff;
                top: 0;
                right: 0;
                display: flex;
                align-items: center;
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
              flex: 1;
              .name {
                font-size: 15px;
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
  }
</style>
