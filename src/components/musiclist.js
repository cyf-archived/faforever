import React from 'react';
import { inject, observer } from 'mobx-react';
import { List, Icon, Tag, Tooltip } from 'antd';
import { Menu, Item, contextMenu, Submenu } from 'react-contexify';

import 'moment/locale/zh-cn';

import * as sty from './musiclist.less';
import Like from './like';

let remote;
let cache;

const color = count => {
  if (count > 0 && count < 15) return '';
  if (count >= 15 && count < 50) return 'orange';
  if (count >= 50) return 'red';
};

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
    const { current_songs, current_like } = this.props.music;
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
          {current_like && (
            <Item
              onClick={e => {
                const { props } = e;
                const musics = this.props.my.pop(current_like, props.data);
                this.props.music.toggle(musics, current_like);
              }}
            >
              移出歌单
            </Item>
          )}
        </Menu>

        <List
          size="small"
          dataSource={current_songs}
          header={
            <List.Item className="header-box">
              <div className="playing" />
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
                    data: item,
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
              <div className="playing">
                <Like path={item.path} />
              </div>

              <div className="title">
                {item.title}
                {item.search_key && item?.paths?.length > 0 ? (
                  <>
                    &nbsp;
                    <Tooltip
                      title={`发发共唱了《${item.search_key}》${item?.paths?.length}次，点击搜索全部歌曲`}
                    >
                      <Tag
                        onClick={() => {
                          this.props.music.search(item.search_key);
                          this.props.my.toggle('list');
                        }}
                        style={{
                          cursor: 'pointer',
                          fontSize: 10,
                        }}
                        color={color(item?.paths?.length)}
                      >
                        <Icon type="search" />
                        {item?.paths?.length ?? 1}次
                      </Tag>
                    </Tooltip>
                  </>
                ) : null}
              </div>
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
