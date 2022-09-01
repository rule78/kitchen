/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    // localhost:8000/api/** -> https://preview.pro.ant.design/api/**
    '/main-api/': {
      target: 'http://dve.985cn.com/',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/sys-api/': {
      target: 'http://dve.985cn.com/',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  test: {
    '/main-api/': {
      target: 'http://www.985cw.com/',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/sys-api/': {
      target: 'http://www.985cw.com/',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/main-api/': {
      target: 'http://www.985cw.com/',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/sys-api/': {
      target: 'http://www.985cw.com/',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
