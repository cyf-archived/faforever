const fly = require("flyio");


export default (url, option = {}) => {
  if (!option.headers) {
    option.headers = {}
  }
  return fly.request(url, option.data, {
    ...option,
  });
}
