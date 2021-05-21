<template>
  <div class="newmv-container">
    <div class="filter-wrap">
      <div class="section-wrap">
        <span class="section-type">地区:</span>
        <ul class="tabs-wrap">
          <li class="tab">
            <span class="title" :class="{active:area==='全部'}" @click="area='全部'">全部</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:area==='内地'}" @click="area='内地'">内地</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:area==='港台'}" @click="area='港台'">港台</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:area==='欧美'}" @click="area='欧美'">欧美</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:area==='日本'}" @click="area='日本'">日本</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:area==='韩国'}" @click="area='韩国'">韩国</span>
          </li>
        </ul>
      </div>
      <div class="type-wrap">
        <span class="type-type">类型:</span>
        <ul class="tabs-wrap">
          <li class="tab">
            <span class="title" :class="{active:type==='全部'}" @click="type='全部'">全部</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:type==='官方版'}" @click="type='官方版'">官方版</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:type==='原声'}" @click="type='原声'">原声</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:type==='现场版'}" @click="type='现场版'">现场版</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:type==='网易出品'}" @click="type='网易出品'">网易出品</span>
          </li>
        </ul>
      </div>
      <div class="order-wrap">
        <span class="order-type">排序:</span>
        <ul class="tabs-wrap">
          <li class="tab">
            <span class="title" :class="{active:order==='上升最快'}" @click="order='上升最快'">上升最快</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:order==='最热'}" @click="order='最热'">最热</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:order==='最新'}" @click="order='最新'">最新</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="mvs">
      <div class="items">
        <div class="item" v-for="item in list" :key="item.id" @click="toMv(item.id)">
          <div class="img-wrap">
            <img :src="item.cover" alt="">
            <icon class="play" name="play" w="40px" h="40px"></icon>
            <div class="num-wrap">
              <icon class="playcount" name="playcount" w="15px" h="15px"></icon>
              <div class="num">{{ item.playCount }}</div>
            </div>
          </div>
          <div class="info-wrap">
            <div class="name">{{ item.name }}</div>
            <div class="singer">{{ item.artistName }}</div>
          </div>
        </div>
      </div>
      <el-pagination background layout="prev, pager, next" :total="total" :page-size="12" :current-page="page" @current-change="handleCurrentChange"></el-pagination>
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
      list: [],
      type: '全部',
      area: '全部',
      order: '上升最快'
    }
  },
  watch: {
    type() {
      this.page = 1
      this.listData()
    },
    area() {
      this.page = 1
      this.listData()
    },
    order() {
      this.page = 1
      this.listData()
    }
  },
  methods: {
    handleCurrentChange(val) {
      // console.log('object')
      this.page = val
      this.listData()
    },
    listData() {
      axios({
        url: 'https://autumnfish.cn/mv/all',
        method: 'get',
        params: {
          limit: 12,
          area: this.area,
          order: this.order,
          type: this.type,
          offset: (this.page - 1) * 12
        }
      }).then(res => {
        const listArray = res.data.data.map(item => ({
          cover: item.cover,
          name: item.name,
          id: item.id,
          playCount: item.playCount,
          artistName: item.artistName
        }))
        if (res.data.count) {
          this.total = res.data.count
        }
        this.list = listArray
      })
    },
    toMv(id) {
      this.$router.push(`/mv?id=${id}`)
    }
  },
  created() {
    this.listData()
  }
}
</script>

<style lang="scss">
  .newmv-container{
    max-width: 1100px;
    margin: 0 auto;
    padding-top: 20px;
    .filter-wrap {
      >div {
        margin-bottom: 10px;
        vertical-align: baseline;
        display: flex;
        align-items: center;
        span {
          font-size: 14px;
          height: 100%;
        }
        ul {
          display: flex;
          list-style: none;
          padding-left: 10px;
          li:not(:last-child) {
            border-right: solid 1px #f2f2f1;
          }
          li {
            .title {
              margin: 20px;
              color: grey;
              cursor: pointer;
              padding: 5px 20px;
            }
            .active {
                color: #dd6d60;
                background: #fcf6f5;
                border-radius: 20px;
              }
          }
        }
      }
    }
    .mvs {
      .items {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        .item {
          width: 250px;
          cursor: pointer;
          margin-right: 25px;
          margin-bottom: 30px;
          .img-wrap {
            width: 100%;
            position: relative;
            .play {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%,-50%);
              opacity: 0;
            }
            &:hover .play {
              opacity: 1;
              transition: opacity 0.7s;
            }
            &:hover img {
              outline: dashed 1px #dd6d60;
            }
            img {
              width: 100%;
              border-radius: 5px;
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
                transform: translate(-15%,5%);
              }
            }
          }
          .info-wrap {
            .name {
              font-size: 15px;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .singer {
              font-size: 14px;
              color: #c5c5c5;
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
</style>
