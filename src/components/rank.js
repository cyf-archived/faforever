import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { List } from 'antd';

import './rank.less';
import { getHot } from '../apis';

export const Rank = props => {
  const [data, setData] = useState({
    like_hot: [],
    sing_hot: [],
  });

  const load = async () => {
    const res = await getHot();
    if (res.status === 200) {
      setData(res.data);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="rank-page">
      <div className="line">
        <div className="title">台主爱唱榜单Top20</div>
        <List
          size="small"
          dataSource={data.sing_hot.slice(0, 20)}
          renderItem={item => (
            <List.Item
              className="rank-item"
              key={`${item.title}`}
              onClick={() => {
                props.music.search(item.title);
                props.my.toggle('list');
              }}
            >
              <div className="title">{item.title}</div>
              <div className="count">🎵&nbsp;{item.count}</div>
            </List.Item>
          )}
        />
      </div>
      <div className="line">
        <div className="title">水友喜欢榜单Top20</div>
        <List
          size="small"
          dataSource={data.like_hot.slice(0, 20)}
          renderItem={item => (
            <List.Item
              className="rank-item"
              key={`${item.title}`}
              onClick={() => {
                props.music.search(item.title);
                props.my.toggle('list');
              }}
            >
              <div className="title">{item.title}</div>
              <div className="count">❤️&nbsp;{item.count}</div>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default inject('music', 'my')(observer(Rank));
