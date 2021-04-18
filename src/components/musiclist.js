import React from 'react';
import { inject, observer } from 'mobx-react';
import { List, Icon } from 'antd';
import { Menu, Item, contextMenu, Submenu } from 'react-contexify';

import 'moment/locale/zh-cn';

import * as sty from './musiclist.less';

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

@inject('music', 'my')
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
    const { current_songs } = this.props.music;
    const { list = [] } = this.props.my;

    return (
      <div className={sty.container}>
        <Menu id="mylist">
          <Submenu label="添加至">
            {list.map(i => (
              <Item
                key={i.uuid}
                onClick={e => {
                  const { props } = e;
                  this.props.my.push(i.uuid, props.data);
                }}
              >
                {i.name}
              </Item>
            ))}
          </Submenu>
        </Menu>

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
              onContextMenu={e => {
                contextMenu.show({
                  id: 'mylist',
                  event: e,
                  props: {
                    data: item
                  },
                });
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
      </div>
    );
  }
}

export default Index;
