import React from 'react';
import { inject, observer } from 'mobx-react';
import { Button, message } from 'antd';
import { toJS } from 'mobx';
import ModeContext from './context';

import style from './random.less';
let cachedRandomList = null;

const RandomPage = ({ music, my }) => {
  const { isPlay, toggleMode } = React.useContext(ModeContext);

  const play = () => {
    if (!cachedRandomList || cachedRandomList.length === 0) return message.error('没有可播放歌曲');
    const index = Math.floor(Math.random() * cachedRandomList.length);
    const song = { ...cachedRandomList[index] };
    music.toggle(cachedRandomList);
    toggleMode(3);
    music.play(song);
  };

  const loadRandomList = () => {
    let musics = cachedRandomList;

    if (!musics) {
      musics = [];
      console.log('no cache random');
      const titles = Object.keys(music.songs);
      for (const title of titles) {
        const songs = music.songs[title];
        for (const song of songs) {
          if (song?.additional?.song_audio?.duration / 60 < 7) {
            musics.push(toJS(song));
          }
        }
      }

      cachedRandomList = musics;
    }

    if (isPlay) return; // 如果有在播放的列表，那么不进行播放

    play();
  };

  React.useEffect(() => {
    loadRandomList();
  }, []);

  const pic = React.useMemo(() => {
    const song = toJS(music.song);
    if (!song || !song.additional) return null;
    return `http://magict.cn:5000/webapi/AudioStation/cover.cgi?api=SYNO.AudioStation.Cover&version=3&method=getcover&album_name=${song.additional.song_tag.album}&album_artist_name=${song.additional.song_tag.album_artist}&library=all&_sid=${music.loginsid}`;
  }, [music.song]);

  const title = React.useMemo(() => {
    const song = toJS(music.song);
    if (!song || !song.additional) return '未播放歌曲';
    return song.title;
  }, [music.song]);

  return (
    <div className={style.random}>
      <img className="pic" src={pic} alt="" />
      <div className="title">{title}</div>
      <div className="control">
        <Button
          type="primary"
          onClick={() => {
            play();
          }}
        >
          随机播放一首
        </Button>
      </div>

      <p
        style={{
          textAlign: 'center',
          fontSize: 12,
          color: '#d6d5d5',
          marginTop: 20,
        }}
      >
        本模块会随机播放所有DS歌单中任意一首小于7分钟的歌曲
      </p>
    </div>
  );
};

export default inject('music', 'my')(observer(RandomPage));
