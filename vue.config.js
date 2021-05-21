module.exports = {
  devServer: {
    proxy: {
      '/banner': {
        target: 'https://autumnfish.cn',
        ws: true,
        changeOrigin: true
      },
      '/personalized/newsong': {
        target: 'https://autumnfish.cn/personalized',
        ws: true,
        changeOrigin: true
      },
      '/personalized/mv': {
        target: 'https://autumnfish.cn/personalized/mv',
        ws: true,
        changeOrigin: true
      },
      '/personalized': {
        target: 'https://autumnfish.cn',
        ws: true,
        changeOrigin: true
      },
      '/top/song': {
        target: 'https://autumnfish.cn',
        ws: true,
        changeOrigin: true
      }
    }
  }
}
