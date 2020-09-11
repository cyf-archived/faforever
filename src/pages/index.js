/*
 * @Author: RojerChen
 * @Date: 2020-09-10 12:30:28
 * @LastEditors: RojerChen
 * @LastEditTime: 2020-09-11 09:39:10
 * @FilePath: /fa-forever/src/pages/index.js
 * @Company: freesailing.cn
 */
import React from 'react';
import { inject, observer } from 'mobx-react';
import { List, Icon } from 'antd';
import { NoticeBar } from 'antd-mobile';
// import Chat from "../components/chat";

import 'moment/locale/zh-cn';

import * as sty from './index.less';

let remote;
let cache;

if (window.require) {
  const electron = window.require('electron');
  ({ remote } = electron);
  try {
    if (remote.require) {
      cache = remote.require('./cache');
    }
  } catch (error) {}
}

@inject('music')
@observer
class Index extends React.Component {
  componentDidMount() {}

  show = song => {
    const { shell } = remote;
    const cacheKey = song.path.replace(/\/|.mp3/g, '_');
    const cachePath = localStorage.getItem('cache-path');
    const path = cache.path(cacheKey, cachePath);
    shell.showItemInFolder(path);
  };

  renderTime(item) {
    return `${Math.floor(Number(item.additional.song_audio.duration) / 60)}:${
      item.additional.song_audio.duration % 60 < 10
        ? '0' + (item.additional.song_audio.duration % 60)
        : item.additional.song_audio.duration % 60
    }`;
  }

  render() {
    const { note, current_songs } = this.props.music;

    return (
      <div className={sty.container}>
        {note && (
          <NoticeBar
            marqueeProps={{
              loop: true,
              leading: 2000,
              trailing: 2000,
              style: { padding: '0 7.5px' },
            }}
          >
            {note}
          </NoticeBar>
        )}

        <List
          size="small"
          dataSource={current_songs}
          header={
            <List.Item className="header-box">
              <div className="playing" />
              <div className="title">标题</div>
              <div className="album">专辑</div>
              <div className="artist">演唱</div>
              <div className="duration">时长</div>
            </List.Item>
          }
          renderItem={item => (
            <List.Item
              key={`${item.id}-${item.cached ? '1' : '2'}`}
              onDoubleClick={() => {
                this.props.music.play(item);
              }}
            >
              <div className="playing">
                {item.playing && (
                  <i className="fa-icon spin" style={{ color: '#e04f4c' }}>
                    &#xe61f;
                  </i>
                )}
              </div>
              <div className="title">{item.title}</div>
              <div className="album">{item.additional.song_tag.album}</div>
              <div className="artist">{item.additional.song_tag.artist}</div>
              <div className="duration">
                {this.renderTime(item)}
                {item.cached && (
                  <Icon
                    type="cloud-download"
                    style={{ marginLeft: 4, color: '#e04f4c', fontSize: 12 }}
                    onClick={this.show.bind(this, item)}
                  />
                )}
              </div>
            </List.Item>
          )}
        />

        {/* <Chat ref={chat => (this.chat = chat)} /> */}
      </div>
    );
  }
}

export default Index;
