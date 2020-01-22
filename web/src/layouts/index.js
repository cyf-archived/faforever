import React from 'react';
import { Icon, ConfigProvider, Modal, Tooltip } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { configure } from 'mobx';
import { Provider } from 'mobx-react';
import { SearchBar } from 'antd-mobile';

import Criteria from '../components/criteria';
import Player from '../components/player';

import 'moment/locale/zh-cn';

import stores from '../stores';
import * as sty from './index.less';
let ipcRenderer;

if (window.require) {
  const electron = window.require('electron');
  ({ ipcRenderer } = electron);
}

configure({
  enforceActions: 'always',
});

class Index extends React.Component {
  componentDidMount() {
    stores.music.loadNote();
    stores.music.login();
  }

  minWin = () => {
    ipcRenderer && ipcRenderer.send('window-min');
  };

  close = () => {
    Modal.confirm({
      title: '是否退出？',
      onOk: () => {
        ipcRenderer && ipcRenderer.send('window-close');
      },
    });
  };

  reload = () => {
    stores.music.reload();
  };

  // startChat = () => {
  //   this.chat.connect();
  //   this.openChat();
  // };

  render() {
    return (
      <ConfigProvider locale={zh_CN}>
        <Provider {...stores}>
          <div className={sty.container}>
            <div className="header">
              <div className="logo">
                FA FOREVER <span className="version">V1.2.2</span>
              </div>
              <SearchBar placeholder="搜索歌曲" onSubmit={stores.music.search} />
              <div className="action">
                <Tooltip
                  placement="topLeft"
                  title="当你发现歌库数据不完整时，可以点这里重新缓存歌曲数据"
                >
                  <i className="fa-icon" onClick={this.reload}>
                    &#xe6ba;
                  </i>
                </Tooltip>
                <Icon type="minus" onClick={this.minWin} />
                <Icon type="close" onClick={this.close} />
              </div>
            </div>

            <div className="main">
              <div className="criteria">
                <Criteria />
              </div>

              <div className="content">{this.props.children}</div>
            </div>

            <Player />
          </div>
        </Provider>
      </ConfigProvider>
    );
  }
}

export default Index;
