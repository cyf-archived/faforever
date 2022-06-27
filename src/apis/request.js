const axios = require('axios');
export const baseURL = 'http://[2409:8a28:2405:b751::a7b]:5000/webapi';

axios.defaults.withCredentials = false;

axios.interceptors.request.use((config) => {
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
