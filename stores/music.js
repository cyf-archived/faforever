import { observable, flow, action, runInAction } from "mobx";
import { getEntry, getSongs, download, note, login } from "../apis";
import { message } from "antd";

let remote;
let ipcRenderer;
let cache;

if (window.require) {
  const electron = window.require("electron");
  ({ remote, ipcRenderer } = electron);
  try {
    if (remote.require) {
      cache = remote.require("./cache");
    }
  } catch (error) {}
}

class Store {
  @observable criteria;
  @observable current_criteria;
  @observable songs;
  @observable current_songs;
  @observable song;
  @observable loading;
  @observable url;
  @observable currentList;
  @observable note;
  @observable listloading;
  @observable loginsid;

  constructor() {
    this.criteria = localStorage["criteria"]
      ? JSON.parse(localStorage["criteria"])
      : [];
    this.current_criteria = {};
    this.songs = localStorage["songs"] ? JSON.parse(localStorage["songs"]) : {};
    this.currentList = [];
    this.current_songs = [];
    this.song = {};
    this.loading = true;
    this.listloading = false;
    this.url = "";
    this.note = "";
    this.loginsid = "";
  }

  login = flow(function*() {
    message.loading("登陆中...");
    this.loading = true;
    const { data } = yield login();
    try {
      const jsdata = JSON.parse(data);
      if (jsdata.success === true) {
        this.loginsid = jsdata.data.sid;
      } else {
        message.error("登录失败 -1");
      }
    } catch (error) {
      console.log(error);
      message.error("登录失败 -2");
    }
  });

  reload = flow(function*() {
    this.loading = true;
    localStorage.removeItem("criteria");
    localStorage.removeItem("songs");
    this.criteria = [];
    this.songs = {};
    yield this.loadCriteria();
  });

  caculateCached = () => {
    console.log("caculateCached...");
    const cached = [];
    const songs = Object.keys(this.songs).reduce((res, key) => {
      res[key] = this.songs[key].map(i => {
        const isCached = cache && cache.exist(i.id);
        const data = {
          ...i,
          url: download(i.id),
          playing: false,
          cached: isCached
        };

        if (isCached && key !== "__cached__") {
          cached.push(data);
        }

        return data;
      });
      return res;
    }, {});

    this.songs = {
      ...songs,
      __cached__: cached
    };
  };

  loadCriteria = flow(function*() {
    this.note = (yield note()).data;
    if (this.criteria.length === 0 || Object.keys(this.songs).length === 0) {
      const hide = message.loading("加载缓存，需要一段时间，请耐心等待", 0);
      try {
        const { data } = yield getEntry();
        const jsonData = JSON.parse(data);
        if (jsonData.data && jsonData.data.albums.length > 0) {
          this.criteria = jsonData.data.albums;
          localStorage["criteria"] = JSON.stringify(jsonData.data.albums);
          // this.toggle(jsonData.data.albums[0].name);
          for (const albums of jsonData.data.albums) {
            const { data: songs } = yield getSongs(
              albums.name,
              albums.album_artist
            );
            const songsData = JSON.parse(songs);
            if (songsData.data && songsData.data.songs.length > 0) {
              this.songs[albums.name] = songsData.data.songs;
            }
          }
          localStorage["songs"] = JSON.stringify(this.songs);
          this.caculateCached();
          this.loading = false;
        }
        hide();
      } catch (error) {
        hide();
        message.error(error.message);
      }
    } else {
      this.caculateCached();
      this.loading = false;
    }
  });

  @action toggle = criteria => {
    this.current_songs = [];
    this.listloading = true;
    this.current_criteria = criteria;
    if (this.songs[criteria]) {
      const data = [];
      for (let index = 0; index < this.songs[criteria].length; index++) {
        const element = this.songs[criteria][index];
        data.push({
          ...element,
          playing: element.id === this.song.id
        });
      }
      this.current_songs = data;
      this.listloading = false;
    } else {
      this.listloading = false;
    }
  };

  @action play = (song, dclick = true) => {
    this.song = song;
    if (dclick) {
      this.currentList = this.current_songs;
    }

    this.current_songs = this.current_songs.map(i => {
      return {
        ...i,
        playing: i.id === song.id
      };
    });

    if (cache && cache.exist(song.id)) {
      this.url = cache && cache.path(song.id);
    } else {
      this.url = download(song.id, this.loginsid);
      if (cache) {
        ipcRenderer && ipcRenderer.send("cache", this.url, song.id);
        let t = 0;
        const timer = setInterval(() => {
          const isCached = cache && cache.exist(song.id);
          t++;

          if (isCached) {
            runInAction(() => {
              const index = this.songs[
                this.song.additional.song_tag.album
              ].findIndex(i => i.id === song.id);
              this.songs[this.song.additional.song_tag.album][index] = {
                ...this.songs[this.song.additional.song_tag.album][index],
                cached: true
              };

              this.current_songs = this.current_songs.map(i => {
                return {
                  ...i,
                  cached: i.id === song.id ? true : i.cached
                };
              });

              this.songs.__cached__.push(this.song);
            });
          }

          if (isCached || t > 15) {
            clearInterval(timer);
            console.log("clearInterval");
          }
        }, 1500);
      }
    }
  };

  @action playNext = mode => {
    if (this.currentList.length > 0 && this.song.id) {
      if (mode === 2) {
        // 单曲
        return;
      }

      if (mode === 3) {
        // 单曲
        const index = Math.floor(Math.random() * this.currentList.length);
        const song = { ...this.currentList[index] };
        this.play(song, false);
        return;
      }

      let index = this.currentList.findIndex(value => {
        if (value.id === this.song.id) {
          return true;
        }
        return false;
      });

      index += 1;
      index = index < this.currentList.length ? index : 0;
      const song = { ...this.currentList[index] };
      this.play(song, false);
    }
  };

  @action playPre = mode => {
    if (this.currentList.length > 0 && this.song.id) {
      if (mode === 2) {
        // 单曲
        return;
      }

      if (mode === 3) {
        // 单曲
        const index = Math.floor(Math.random() * this.currentList.length);
        const song = { ...this.currentList[index] };
        this.play(song, false);
        return;
      }

      let index = this.currentList.findIndex(value => {
        if (value.id === this.song.id) {
          return true;
        }
        return false;
      });

      index -= 1;
      index = index < 0 ? 0 : index;
      const song = { ...this.currentList[index] };
      this.play(song, false);
      return;
    }
  };

  @action search = key => {
    if (!key) {
      return;
    }
    this.listloading = true;
    const allSongs = Object.keys(this.songs).reduce((res, key) => {
      for (const song of this.songs[key]) {
        res.push({
          ...song
        });
      }
      return res;
    }, []);

    const filterSongs = allSongs
      .filter(song => song.title.indexOf(key) !== -1)
      .map(song => ({
        ...song,
        playing: song.id === this.song.id
      }));

    this.current_songs = filterSongs;
    this.current_criteria = "";
    this.listloading = false;
  };
}

export default new Store();
