import React from 'react';
import { inject, observer } from 'mobx-react';
import { Button } from 'antd';
import { toJS } from 'mobx';

import style from './random.less';

const RandomPage = ({ music, my }) => {
  React.useEffect(() => {
    if (!music.random) {
      music.toggleRandom();
      music.playNext();
    }
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
            music.playNext();
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
