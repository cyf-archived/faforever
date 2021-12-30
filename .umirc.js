/*
 * @Author: RojerChen
 * @Date: 2020-09-10 12:30:28
 * @LastEditors: RojerChen
 * @LastEditTime: 2020-09-11 09:56:06
 * @FilePath: /fa-forever/.umirc.js
 * @Company: freesailing.cn
 */
// ref: https://umijs.org/config/
export default {
  define: {
    'process.env.VERSION': 'V1.5.2',
    'process.env.APPNAME': 'FA FOREVER',
  },
  treeShaking: true,
  outputPath: './web_dist',
  routes: [
    {
      path: '/',
      component: '../layouts/index',
      routes: [
        { path: '/', component: '../pages/index' },
        // { path: '/twitch', component: '../pages/twitch' }, 存在跨域问题，🙅🏻‍♀️播放，目前还没有解决方案...
      ],
    },
  ],
  alias: {
    '@': require('path').resolve(__dirname, 'src'),
  },
  hash: true,
  history: 'hash',
  publicPath: 'http://cdn.eqistu.cn/faforever13/',
  theme: './theme-config.js',
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: false,
        dynamicImport: false,
        title: 'web',
        dll: true,
        locale: {
          enable: true,
          default: 'en-US',
        },
        routes: {
          exclude: [/components\//],
        },
      },
    ],
  ],
};
