import request from "./request";
const host = "http://magict.cn:5000/webapi";

// 获取列表
export const getEntry = () => {
  return request(`${host}/AudioStation/album.cgi`, {
    method: "POST",
    data:
      "api=SYNO.AudioStation.Album&method=list&version=1&library=all&sort_direction=asc&offset=0&sort_by=name&limit=5000"
  });
};

// 获取列表
export const getSongs = (album, album_artist) => {
  return request(`${host}/AudioStation/song.cgi`, {
    method: "POST",
    data: `api=SYNO.AudioStation.Song&method=list&version=3&library=all&additional=song_tag%2Csong_audio%2Csong_rating&album=${encodeURIComponent(
      album
    )}&offset=0&album_artist=${encodeURIComponent(album_artist)}&limit=50000`
  });
};

// 登录
export const login = () => {
  return request(
    "http://magict.cn:5000/webapi/auth.cgi?api=SYNO.API.Auth&version=3&method=login&account=cyfwlp&passwd=5267373&session=AudioStation&format=cookie"
  );
};

// 下载
export const download = (id, sid) => {
  return `https://magict.cn:5001/webapi/AudioStation/stream.cgi?api=SYNO.AudioStation.Stream&method=stream&version=1&id=${id}&_sid=${sid}&ext=.mp3`;
  // return `${host}/AudioStation/stream.cgi?api=SYNO.AudioStation.Stream&method=stream&version=1&id=${id}&seek_position=0`;
};

export const note = () => {
  return request(
    `http://cdn.eqistu.cn/faforever/note.txt?t=${new Date().valueOf()}`
  );
};
