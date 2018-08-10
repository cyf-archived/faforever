const { app } = require('electron')
const fs = require('fs');
const path = require('path');

exports.exist = (id) => {
  const mp3path = path.join(app.getAppPath(), `../cache/${id}.mp3`);
  return fs.existsSync(mp3path);
}

exports.path = (id) => {
  return path.join(app.getAppPath(), `../cache/${id}.mp3`);
}
