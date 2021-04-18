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
import { Spin } from 'antd';

@inject('music', 'my')
@observer
class Criteria extends React.Component {

  
  render() {
    return (
      <div>
        <Spin spinning={this.props.music.loading}>
          <ul className="criterialist">
            {this.props.music.criteria.map((item, index) => (
              <li
                key={item.name}
                onClick={() => {
                  this.props.my.toggle('list');
                  this.props.music.toggle(item.name);
                }}
              >
                <img
                  alt=""
                  src={`http://magict.cn:5000/webapi/AudioStation/cover.cgi?api=SYNO.AudioStation.Cover&version=3&method=getcover&album_name=${item.name}&album_artist_name=${item.album_artist}&library=all`}
                />
                <span>{item.name}</span>
                <div className="counter">
                  {this.props.music.songs[item.name] ? this.props.music.songs[item.name].length : 0}
                </div>
              </li>
            ))}
          </ul>
        </Spin>
      </div>
    );
  }
}

export default Criteria;
