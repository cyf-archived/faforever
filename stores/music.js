import { observable, flow } from 'mobx';
import { getEntry, getSongs, download } from '../apis';

class Store {
  @observable criteria;
  @observable current_criteria;
  @observable songs;
  @observable song;
  @observable downloading;
  @observable url;
  @observable currentList;

  constructor() {
    this.criteria = [];
    this.current_criteria = {};
    this.songs = [];
    this.currentList = [];
    this.song = {};
    this.downloading = false;
    this.url = '';
  }

  loadCriteria = flow(function *() {
    const { data } = yield getEntry();
    if (data.data && data.data.items.length > 0) {
      this.criteria = data.data.items;
      this.toggle(data.data.items[0]);
    }
  })

  toggle = flow(function *(criteria) {
    this.current_criteria = criteria;
    this.songs = [];
    const { data } = yield getSongs(criteria.criteria.album, criteria.criteria.album_artist);
    try {
      const jsonData = JSON.parse(data);
      if (jsonData.data && jsonData.data.songs.length > 0) {
        this.songs = jsonData.data.songs;
      }
    } catch (error) {
    }
  })

  play = flow(function *(song) {
    this.song = song
    this.currentList = this.songs
    this.url = yield download(song.id);
  })

  playNext = flow(function *() {
    if (this.currentList.length > 0 && this.song.id) {
      let index = this.currentList.findIndex(value => {
        if (value.id === this.song.id) {
          return true;
        }
        return false;
      })

      index += 1;
      index = index < this.currentList.length ? index : 0;
      const song = { ...this.currentList[index] }
      this.song = song
      this.url = yield download(song.id);
    }
  })


  playPre = flow(function *() {
    if (this.currentList.length > 0 && this.song.id) {
      let index = this.currentList.findIndex(value => {
        if (value.id === this.song.id) {
          return true;
        }
        return false;
      })

      index -= 1;
      index = index < 0 ? 0 : index;
      const song = { ...this.currentList[index] }
      this.song = song
      this.url = yield download(song.id);

    }
  })

}

export default new Store();
