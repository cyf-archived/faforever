import React from 'react';
import { inject, observer } from "mobx-react";
import { Table } from 'antd';
import 'moment/locale/zh-cn';

import * as sty from './index.less';

@inject('music')
@observer
class Index extends React.Component {
  columns = [
    {
      dataIndex: 'id',
      title: 'ID',
      width: 85,
      render: (text) => {
        return text.replace('music_', '')
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
        <Table
          rowKey='id'
          size='small'
          loading={this.props.music.songs.length === 0}
          pagination={false}
          dataSource={this.props.music.songs}
          columns={this.columns}
          onRow={(record) => {
            return {
              onDoubleClick: () => {
                this.props.music.play(record);
              },
            };
          }}
        ></Table>
      </div>
    )
  }
}

export default Index;
