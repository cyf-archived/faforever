import React from 'react';
import { inject, observer } from "mobx-react";
import { List } from 'antd';
import { NoticeBar } from 'antd-mobile';
import 'moment/locale/zh-cn';

import * as sty from './index.less';

@inject('music')
@observer
class Index extends React.Component {
  columns = [
    {
      dataIndex: 'playing',
      title: '',
      width: 20,
      render: (text) => {
        return <i className="fa-icon spin"></i>;
      }
    },
    {
      dataIndex: 'title',
      title: '标题'
    },
    {
      dataIndex: 'additional.song_tag.album',
      title: '专辑',
      width: 150,
    },
    {
      dataIndex: 'additional.song_tag.artist',
      title: '演唱者',
      width: 85,
    },
    {
      dataIndex: 'additional.song_audio.duration',
      title: '长度',
      width: 85,
      render: (text) => {
        return `${Math.floor(Number(text) / 60)}:${text % 60}`
      }
    },
  ]
  render() {
    return (
      <div className={sty.container}>
        { this.props.music.note && <NoticeBar marqueeProps={{ loop: true, leading: 2000, trailing: 2000, style: { padding: '0 7.5px' } }}>
          { this.props.music.note }
        </NoticeBar>}
        { this.props.music.note && <div style={{ height: 42 }}></div> }

        <List
          size='small'
          dataSource={this.props.music.current_songs}
          loading={this.props.music.listloading}
          header={
            <List.Item className='header-box'>
              <div className='playing'></div>
              <div className='title'>标题</div>
              <div className='album'>专辑</div>
              <div className='artist'>演唱</div>
              <div className='duration'>时长</div>
            </List.Item>
          }
          renderItem={item => (<List.Item onDoubleClick={() => {
            this.props.music.play(item);
          }} >
            <div className='playing'>
              {item.playing && <i className="fa-icon spin" style={{ color: '#c62f2f', }} >&#xe61f;</i>}
            </div>
            <div className='title'>{item.title}</div>
            <div className='album'>{item.additional.song_tag.album}</div>
            <div className='artist'>{item.additional.song_tag.artist}</div>
            <div className='duration'>
              {`${Math.floor(Number(item.additional.song_audio.duration) / 60)}:${item.additional.song_audio.duration % 60}`}
              { item.cached && <i style={{ marginLeft: 4, color: '#c62f2f', fontSize: 12 }} className="fa-icon">&#xe61a;</i> }
            </div>
          </List.Item>)}
        >
        </List>
      </div>
    )
  }
}

export default Index;
