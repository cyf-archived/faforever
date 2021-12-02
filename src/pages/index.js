import React from 'react';
import { inject, observer } from 'mobx-react';
import { NoticeBar } from 'antd-mobile';

import Criteria from '../components/criteria';
import Twitch from '../components/twitch';
import List from '../components/musiclist';
import './index.less';

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
    const { note } = this.props.music;
    const { mode } = this.props.my;
    return (
      <div>
        {note && mode === 'ds' && (
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
        {mode === 'twitch' && <Twitch />}
        {mode === 'ds' && <Criteria />}
        {mode === 'list' && <List />}
      </div>
    );
  }
}

export default Index;
