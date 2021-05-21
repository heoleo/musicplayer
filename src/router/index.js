import Vue from 'vue'
import VueRouter from 'vue-router'
import Discovery from '../views/Discovery.vue'
import Recommand from '../views/Recommand.vue'
import NewMusic from '../views/NewMusic.vue'
import NewMV from '../views/NewMV.vue'
import Result from '../views/Result.vue'
import Playlist from '../views/Playlist.vue'
import Mv from '../views/Mv.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/discovery',
    component: Discovery
  },
  {
    path: '/recommand',
    component: Recommand
  },
  {
    path: '/newmusic',
    component: NewMusic
  },
  {
    path: '/newmv',
    component: NewMV
  },
  {
    path: '/result',
    component: Result
  },
  {
    path: '/playlist',
    component: Playlist
  },
  {
    path: '/mv',
    component: Mv
  },
  {
    path: '*',
    redirect: '/discovery'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
