import request from './request';

// 获取列表
export const getEntry = () => {
  return request(`/AudioStation/album.cgi`, {
    method: 'POST',
    data:
      'api=SYNO.AudioStation.Album&method=list&version=1&library=all&sort_direction=asc&offset=0&sort_by=name&limit=5000',
  });
};

// 获取列表
export const getSongs = (album, album_artist) => {
  return request(`/AudioStation/song.cgi`, {
    method: 'POST',
    data: `api=SYNO.AudioStation.Song&method=list&version=3&library=all&additional=song_tag%2Csong_audio%2Csong_rating&album=${encodeURIComponent(
      album,
    )}&offset=0&album_artist=${encodeURIComponent(album_artist)}&limit=50000`,
  });
};

// 登录
export const login = () => {
  return request(
    '/auth.cgi?api=SYNO.API.Auth&version=3&method=login&account=cyfwlp&passwd=5267373&session=AudioStation&format=cookie',
  );
};

// 下载
export const download = (id, sid) => {
  return `https://magict.cn:5001/webapi/AudioStation/stream.cgi?api=SYNO.AudioStation.Stream&method=stream&version=1&id=${id}&_sid=${sid}&ext=.mp3`;
};

export const note = () => {
  return request(`http://cdn.eqistu.cn/faforever/note.txt?t=${new Date().valueOf()}`);
};

export const gecimi = title => {
  return request(`http://gecimi.com/api/lyric/${encodeURIComponent(title)}`);
};

const API = process.env.APIHOST;

export const getSid = () => {
  return request('/sid', {
    baseURL: API,
  });
};
export const lrc = (url, title) => {
  if (url && url.indexOf('file') >= 0) {
    console.log('url', url);
    return request(url);
  }
  return request('/lrc', {
    baseURL: API,
    params: { title },
  });
};
export const contributelrc = (title, lrc) => {
  return request('/lrc', {
    baseURL: API,
    method: 'POST',
    data: { title, lrc },
  });
};

export const getEntryNew = () => {
  return request('/criteria', {
    baseURL: API,
  });
};
export const getSongsNew = name => {
  return request('/songs', {
    baseURL: API,
    params: {
      name,
    },
  });
};

export const getRandom = () => {
  return request('/random', {
    baseURL: API,
  });
};

export const getLike = () => {
  return request('/like', {
    baseURL: API,
  });
};

export const like = path => {
  return request('/like', {
    baseURL: API,
    method: 'POST',
    data: {
      path,
    },
  });
};
