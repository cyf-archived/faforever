/*
 * @Author: RojerChen
 * @Date: 2020-09-10 12:30:28
 * @LastEditors: RojerChen
 * @LastEditTime: 2020-09-10 13:22:46
 * @FilePath: /fa-forever/web/src/components/criteria.js
 * @Company: freesailing.cn
 */
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Spin, Icon, Tag, Divider } from 'antd';

@inject('music')
@observer
class Criteria extends React.Component {
  componentDidMount() {
    this.load();
  }

  load = async () => {
    if (!localStorage['songs']) {
      await this.props.music.loadCriteria();
    }
    await this.props.music.caculateCached();
  };

  render() {
    return (
      <div style={{ overflowY: 'auto' }}>
        <Spin spinning={this.props.music.loading}>
          <ul className="criteria">
            {this.props.music.criteria.map((item, index) => (
              <li
                key={item.name}
                className={this.props.music.current_criteria === item.name ? 'active' : ''}
                onClick={() => {
                  this.props.music.toggle(item.name);
                }}
              >
                {/* <img
                  alt=""
                  src={`http://magict.cn:5000/webapi/AudioStation/cover.cgi?api=SYNO.AudioStation.Cover&version=3&method=getcover&album_name=${item.name}&album_artist_name=${item.album_artist}&library=all`}
                /> */}
                <span>{item.name}</span>
                <Tag>
                  {this.props.music.songs[item.name] ? this.props.music.songs[item.name].length : 0}
                </Tag>
              </li>
            ))}
            <Divider />
            <li
              key={'__cached__'}
              className={this.props.music.current_criteria === '__cached__' ? 'active' : ''}
              onClick={() => {
                this.props.music.toggle('__cached__');
              }}
            >
              <Icon type="cloud-download" />
              <span>已缓存</span>
              <Tag>{this.props.music.cacheds.length}</Tag>
            </li>
          </ul>
        </Spin>
      </div>
    );
  }
}

export default Criteria;
