/*
 * @Author: RojerChen
 * @Date: 2020-09-10 12:30:28
 * @LastEditors: RojerChen
 * @LastEditTime: 2020-09-10 13:57:56
 * @FilePath: /fa-forever/web/.umirc.js
 * @Company: freesailing.cn
 */
// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  routes: [
    {
      path: '/',
      component: '../layouts/index',
      routes: [{ path: '/', component: '../pages/index' }],
    },
  ],
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
