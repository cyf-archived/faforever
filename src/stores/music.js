import { observable, flow, action, runInAction } from 'mobx';
import {
  getEntry,
  getSongs,
  download,
  note,
  login,
  lrc as lrcApi,
  // gecimi as gecimiApi
  getSid,
  getEntryNew,
  getSongsNew,
  getRandom,
  getLike,
  like as likeApi,
} from '../apis';
import { message } from 'antd';

let remote;
let ipcRenderer;
let cache;

if (window.require) {
  const electron = window.require('electron');
  ({ remote, ipcRenderer } = electron);
  try {
    if (remote.require) {
      cache = remote.require('./cache');
    }
  } catch (error) {}
}

class Store {
  @observable criteria;
  @observable current_criteria;
  @observable current_like;
  @observable songs;
  @observable cacheds;
  @observable current_songs;
  @observable song;
  @observable loading;
  @observable url;
  @observable current_list;
  @observable note;
  @observable lrc;
  @observable loginsid;
  @observable random;
  @observable likes;

  constructor() {
    // this.criteria = localStorage['criteria'] ? JSON.parse(localStorage['criteria']) : [];
    this.criteria = [];
    this.current_criteria = {};
    this.current_like = '';
    // this.songs = localStorage['songs'] ? JSON.parse(localStorage['songs']) : {};
    this.songs = {};
    this.cacheds = [];
    this.current_list = [];
    this.current_songs = [];
    this.song = {};
    this.loading = true;
    this.url = '';
    this.lrc = '';
    this.key = '';
    this.note = '';
    this.loginsid = '';
    this.random = false;
  }

  login = flow(function*() {
    message.loading('登陆中...');
    this.loading = true;
    const { data } = yield login();
    if (data.success === true) {
      this.loginsid = data.data.sid;
      message.destroy();
    } else {
      message.error('登录失败 -1');
    }
    this.loading = false;
  });

  // reload = flow(function*() {
  //   localStorage.removeItem('criteria');
  //   localStorage.removeItem('songs');
  //   this.criteria = [];
  //   this.songs = {};
  //   yield this.loadCriteria();
  // });
  like = flow(function*(path) {
    yield likeApi(path);
    yield this.loadLike();
  });

  loadLike = flow(function*() {
    const { data: lklist } = yield getLike();
    if (this.current_like === 'system_like') {
      this.toggle(lklist, this.current_like);
    }
    this.likes = lklist;
  });

  caculateCached = flow(function*() {
    message.loading('整理缓存碎片中...', 0);
    setTimeout(() => {
      console.log('caculateCached...');
      try {
        const cachepath = localStorage.getItem('cache-path');
        console.log('cachepath', cachepath);
        const cached = [];
        for (const key in this.songs) {
          if (this.songs.hasOwnProperty(key)) {
            this.songs[key].map(i => {
              const cacheKey = i.path.replace(/\/|.mp3/g, '_');
              const isCached = cache && cache.exist(cacheKey, cachepath);
              const data = {
                ...i,
                url: download(i.id),
                playing: false,
                cached: isCached,
              };

              if (isCached && key !== '__cached__') {
                cached.push(data);
              }

              return data;
            });
          }
        }

        console.log('cached', cached);
        runInAction(() => {
          this.cacheds = cached;
        });
        console.log('cache finished');
      } catch (e) {
        console.log(e);
      } finally {
        runInAction(() => {
          this.loading = false;
        });
        console.log('hide');
        message.destroy();
        if (this.current_criteria) {
          this.toggle(this.current_criteria);
        }
      }
    }, 1000);
  });

  loadNote = flow(function*() {
    try {
      this.note = (yield note()).data;
    } catch (error) {
      this.note = '';
    }
  });

  loadCriteria = flow(function*() {
    this.loading = true;
    const { data: sidData } = yield getSid();
    console.log('sidData', sidData);
    this.loginsid = sidData.sid;
    const { data } = yield getEntryNew();
    console.log(data);
    this.criteria = data;
    yield this.loadAllSongs();
  });

  loadCriteriaOld = flow(function*() {
    this.loading = true;
    message.loading('加载缓存，需要一段时间，请耐心等待', 0);
    try {
      const { data } = yield getEntry();
      if (data.data && data.data.albums.length > 0) {
        this.criteria = data.data.albums;
        localStorage['criteria'] = JSON.stringify(data.data.albums);
        // this.toggle(data.data.albums[0].name);
        for (const albums of data.data.albums) {
          const { data: songs } = yield getSongs(albums.name, albums.album_artist);
          if (songs.data && songs.data.songs.length > 0) {
            this.songs[albums.name] = songs.data.songs;
          }
        }
        localStorage['songs'] = JSON.stringify(this.songs);
        yield this.caculateCached();
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      message.destroy();
      this.loading = false;
    }
  });

  loadLrc = flow(function*(url, title) {
    try {
      this.lrc = (yield lrcApi(url)).data;
    } catch (error) {
      ipcRenderer && ipcRenderer.send('set-lrc', '');
      this.lrc = '';
    }
  });

  loadAllSongs = flow(function*() {
    this.loading = true;
    const { data } = yield getSongsNew();
    this.songs = data;
    this.loading = false;
  });

  loadRandom = flow(function*() {
    const { data } = yield getRandom();
    console.log('random', data);
    this.play(data);
  });

  @action toggle = (criteria, like_uuid = false) => {
    this.random = false;
    if (like_uuid) {
      this.current_like = like_uuid;
    } else {
      this.current_like = '';
    }
    if (typeof criteria === 'string') {
      this.loading = true;
      this.current_songs = [];
      this.current_criteria = criteria;
      const list = criteria === '__cached__' ? this.cacheds : this.songs[criteria];
      if (Array.isArray(list) && list.length > 0) {
        const data = [];
        for (let index = 0; index < list.length; index++) {
          const element = list[index];
          data.push({
            ...element,
            playing: element.id === this.song.id,
            cached: this.cacheds.findIndex(c => c.id === element.id) !== -1,
          });
        }
        this.current_songs = data;
      }
      this.loading = false;
    } else if (Array.isArray(criteria)) {
      this.current_songs = [];
      this.current_criteria = '';
      const list = criteria;
      if (Array.isArray(list) && list.length > 0) {
        const data = [];
        for (let index = 0; index < list.length; index++) {
          const element = list[index];
          data.push({
            ...element,
            playing: element.id === this.song.id,
            cached: this.cacheds.findIndex(c => c.id === element.id) !== -1,
          });
        }
        this.current_songs = data;
      }
    }
  };

  @action play = song => {
    if (!ipcRenderer) {
      message.error('因DS服务器资源有限，不允许在线播放噢！');
      return;
    }
    this.song = song;
    this.lrc = '';
    this.current_list = this.current_songs.map(i => {
      return {
        ...i,
        playing: i.id === song.id,
      };
    });
    this.current_songs = this.current_songs.map(i => {
      return {
        ...i,
        playing: i.id === song.id,
      };
    });

    const cacheKey = song.path.replace(/\/|.mp3/g, '_');
    this.key = song.title;
    const lrcurl = `https://bitbucket.org/rojerchen95/faforever-lrc/raw/master/${
      song.title
    }.lrc?_t=${new Date().valueOf()}`;
    this.loadLrc(lrcurl, song.title);
    const cachePath = localStorage.getItem('cache-path');

    if (cache && cache.exist(cacheKey, cachePath)) {
      this.url = 'file://' + cache.path(cacheKey, cachePath);
    } else {
      this.url = download(song.id, this.loginsid);
      console.log('this.url', this.url);
      if (cache) {
        ipcRenderer && ipcRenderer.send('cache', this.url, cacheKey);
        let t = 0;
        const timer = setInterval(() => {
          const isCached = cache && cache.exist(cacheKey, cachePath);
          t++;

          if (isCached) {
            message.success(`缓存成功：${cacheKey}`);
            runInAction(() => {
              this.cacheds.push({
                ...this.song,
                cached: true,
              });

              this.current_songs = this.current_songs.map(i => ({
                ...i,
                cached: this.cacheds.findIndex(c => c.id === i.id) !== -1,
              }));
            });
          }

          if (isCached || t > 15) {
            clearInterval(timer);
            console.log('clearInterval');
          }
        }, 1500);
      }
    }
  };

  @action playNext = mode => {
    if (this.random) {
      this.loadRandom();
      return;
    }

    if (this.current_list.length > 0 && this.song.id) {
      if (mode === 2) {
        // 单曲
        return;
      }

      if (mode === 3) {
        // 随机
        const index = Math.floor(Math.random() * this.current_list.length);
        const song = { ...this.current_list[index] };
        this.play(song, false);
        return;
      }

      let index = this.current_list.findIndex(value => {
        if (value.id === this.song.id) {
          return true;
        }
        return false;
      });

      index += 1;
      index = index < this.current_list.length ? index : 0;
      const song = { ...this.current_list[index] };
      this.play(song, false);
    }
  };

  @action playPre = mode => {
    if (this.current_list.length > 0 && this.song.id) {
      if (mode === 2) {
        // 单曲
        return;
      }

      if (mode === 3) {
        // 单曲
        const index = Math.floor(Math.random() * this.current_list.length);
        const song = { ...this.current_list[index] };
        this.play(song, false);
        return;
      }

      let index = this.current_list.findIndex(value => {
        if (value.id === this.song.id) {
          return true;
        }
        return false;
      });

      index -= 1;
      index = index < 0 ? 0 : index;
      const song = { ...this.current_list[index] };
      this.play(song, false);
      return;
    }
  };

  @action search = key => {
    if (!key) {
      return;
    }
    const allSongs = Object.keys(this.songs).reduce((res, key) => {
      for (const song of this.songs[key]) {
        res.push({
          ...song,
        });
      }
      return res;
    }, []);

    const filterSongs = allSongs
      .filter(song => song.title.indexOf(key) !== -1)
      .map(song => ({
        ...song,
        playing: song.id === this.song.id,
      }));

    this.current_songs = filterSongs;
    this.current_criteria = '';
  };
  @action toggleRandom = () => {
    this.random = !this.random;
  };
}

export default new Store();
