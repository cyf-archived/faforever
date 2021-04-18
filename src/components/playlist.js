import React from 'react';
import { inject, observer } from 'mobx-react';
import { List } from 'antd';

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
  render() {
    const { current_list } = this.props.music;
    const { mode, onChange } = this.props;

    return (
      <div className={sty.container}>
        <List
          size="small"
          dataSource={current_list}
          header={
            <List.Item className="header-box">
              <div className="playing" />
              <div className="title">
                播放列表
                &nbsp;
                {mode === 1 && (
                  <i
                    className="fa-icon"
                    onClick={() => {
                      onChange(2);
                    }}
                  >
                    &#xe609;
                  </i>
                )}
                {mode === 2 && (
                  <i
                    className="fa-icon"
                    onClick={() => {
                      onChange(3);
                    }}
                  >
                    &#xe66d;
                  </i>
                )}
                {mode === 3 && (
                  <i
                    className="fa-icon"
                    onClick={() => {
                      onChange(1);
                    }}
                  >
                    &#xe622;
                  </i>
                )}
              </div>
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
            </List.Item>
          )}
        />
      </div>
    );
  }
}

export default Index;
