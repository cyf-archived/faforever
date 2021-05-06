import { observable, action } from 'mobx';
import { v4 } from 'uuid';

class Store {
  @observable list;
  @observable mode;

  constructor() {
    try {
      this.list = localStorage['mylist'] ? JSON.parse(localStorage['mylist']) : [];
      this.mode = 'ds';
    } catch (error) {
      this.list = [];
    }
  }

  @action plus = name => {
    const newlist = [
      ...this.list,
      {
        uuid: v4(),
        name,
        musics: [],
      },
    ];
    this.list = newlist;
    localStorage['mylist'] = JSON.stringify(newlist);
  };

  @action update = (uuid, name) => {
    const newlist = [...this.list].map(i =>
      i.uuid === uuid
        ? {
            ...i,
            name,
          }
        : {
            ...i,
          },
    );
    this.list = newlist;
    localStorage['mylist'] = JSON.stringify(newlist);
  };

  @action remove = uuid => {
    const newlist = [...this.list].filter(i => i.uuid !== uuid);
    this.list = newlist;
    localStorage['mylist'] = JSON.stringify(newlist);
  };

  @action toggle = mode => {
    this.mode = mode;
  };

  @action push = (uuid, music) => {
    const newlist = [...this.list];
    const current = newlist.find(i => i.uuid === uuid);
    if (current) {
      current.musics.push(music);
    }
    this.list = newlist;
    localStorage['mylist'] = JSON.stringify(newlist);
  };

  @action pop = (uuid, music) => {
    const newlist = [...this.list];
    const current = newlist.find(i => i.uuid === uuid);
    let musics;
    if (current) {
      musics = [...current.musics].filter(i => i.id != music.id);
      current.musics = musics;
    }
    this.list = newlist;
    localStorage['mylist'] = JSON.stringify(newlist);
    return musics;
  };
}

export default new Store();
