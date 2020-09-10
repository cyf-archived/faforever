/*
 * @Author: RojerChen
 * @Date: 2020-09-10 12:30:28
 * @LastEditors: RojerChen
 * @LastEditTime: 2020-09-10 12:50:11
 * @FilePath: /fa-forever/src/cache.js
 * @Company: freesailing.cn
 */
const { app } = require("electron");
const fs = require("fs");
const path = require("path");

exports.exist = (id, cache_path) => {
  let mp3path = path.join(app.getAppPath(), `../cache/${id}.mp3`);
  if (cache_path) {
    mp3path = path.join(cache_path, `${id}.mp3`);
  }
  return fs.existsSync(mp3path);
};

exports.path = (id, cache_path) => {
  let mp3path = path.join(app.getAppPath(), `../cache/${id}.mp3`);
  if (cache_path) {
    mp3path = path.join(cache_path, `${id}.mp3`);
  }
  return mp3path;
};
