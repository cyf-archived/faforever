const axios = require('axios');
export const baseURL = 'http://www.magict.cn:5000/webapi';

axios.defaults.withCredentials = false;

axios.interceptors.request.use(config => {
  config.headers['useruuid'] = global.userUUID;
  return config;
});

export default (url, option = {}) => {
  return axios.request({
    url,
    baseURL,
    withCredentials: false,
    ...option,
  });
};
