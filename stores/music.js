import { observable, flow, action } from 'mobx';
import { getEntry, getSongs, download } from '../apis';
import { message } from 'antd';

class Store {
  @observable criteria;
  @observable current_criteria;
  @observable songs;
  @observable current_songs;
  @observable song;
  @observable loading;
  @observable url;
  @observable currentList;

  constructor() {
    this.criteria = localStorage['criteria'] ? JSON.parse(localStorage['criteria']) : [];
    this.current_criteria = {};
    this.songs = localStorage['songs'] ? JSON.parse(localStorage['songs']) : {};
    this.currentList = [];
    this.current_songs = [];
    this.song = {};
    this.loading = true;
    this.url = '';
  }

  reload = flow(function *() {
    this.loading = true;
    localStorage.removeItem('criteria');
    localStorage.removeItem('songs');
    this.criteria = [];
    this.songs = {};
    yield this.loadCriteria()
  })

  loadCriteria = flow(function *() {
    if (this.criteria.length === 0 || Object.keys(this.songs).length === 0) {
      const hide = message.loading('首次缓存，需要一段时间，请耐心等待', 0)
      try {
        const { data } = yield getEntry();
        const jsonData = JSON.parse(data);
        if (jsonData.data && jsonData.data.albums.length > 0) {
          this.criteria = jsonData.data.albums;
          localStorage['criteria'] = JSON.stringify(jsonData.data.albums);
          // this.toggle(jsonData.data.albums[0].name);
          for (const albums of jsonData.data.albums) {
            const { data: songs } = yield getSongs(albums.name, albums.album_artist);
            const songsData = JSON.parse(songs);
            if (songsData.data && songsData.data.songs.length > 0) {
              this.songs[albums.name] = songsData.data.songs;
            }
          }
          localStorage['songs'] = JSON.stringify(this.songs);
          this.loading = false;
        }
        hide();
      } catch (error) {
        hide();
        message.error(error.message);
      }
    } else {
      this.loading = false;
    }
  })

  @action toggle = (criteria) => {
    this.current_criteria = criteria;
    this.current_songs = this.songs[criteria];
  }

  play = flow(function *(song, dclick = true) {
    this.song = song
    if (dclick) {
      this.currentList = this.current_songs
    }

    this.current_songs = this.current_songs.map(i => {
      return {
        ...i,
        playing: i.id === song.id
      };
    });
    this.url = yield download(song.id);
  })

  playNext = flow(function *(mode) {
    if (this.currentList.length > 0 && this.song.id) {

      if (mode === 2) { // 单曲
        return;
      }

      if (mode === 3) { // 单曲
        const index = Math.floor(Math.random()* this.currentList.length);
        const song = { ...this.currentList[index] }
        yield this.play(song, false);
        return;
      }


      let index = this.currentList.findIndex(value => {
        if (value.id === this.song.id) {
          return true;
        }
        return false;
      })

      index += 1;
      index = index < this.currentList.length ? index : 0;
      const song = { ...this.currentList[index] }
      yield this.play(song, false);

    }
  })


  playPre = flow(function *(mode) {
    if (this.currentList.length > 0 && this.song.id) {

      if (mode === 2) { // 单曲
        return;
      }

      if (mode === 3) { // 单曲
        const index = Math.floor(Math.random()* this.currentList.length);
        const song = { ...this.currentList[index] }
        yield this.play(song, false);
        return;
      }

      let index = this.currentList.findIndex(value => {
        if (value.id === this.song.id) {
          return true;
        }
        return false;
      })

      index -= 1;
      index = index < 0 ? 0 : index;
      const song = { ...this.currentList[index] }
      yield this.play(song, false);
      return;
    }
  })

}

export default new Store();
