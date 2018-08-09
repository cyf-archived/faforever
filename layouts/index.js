import React from 'react';
import { Icon, LocaleProvider, Modal, Tooltip, notification } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { configure } from 'mobx';
import { Provider } from 'mobx-react';
import Criteria from '../components/criteria';
import Player from '../components/player';
import 'moment/locale/zh-cn';

import stores from '../stores';
import * as sty from './index.less';
let ipcRenderer

if (window.require) {
  const electron = window.require('electron');
  ({ ipcRenderer } = electron);
}


configure({ enforceActions: true });

class Index extends React.Component {
  componentDidMount() {
    if (localStorage['version'] !== '1') {
      localStorage['version'] = '1'
      notification.open({
        message: '本次更新摘要',
        description: <div>
          1、首次打开自动缓存歌曲列表，右上角可以手动重新缓存。
          <br />
          2、优化分类歌曲数量显示，列表正在播放状态。
          <br />
          3、添加可以选择单曲、随机、循环播放模式。
          <br />
          4、优化播放器界面。
          <br /><br /><br />
          下次更新计划：
          <br />
          <br />
          歌曲下载，歌曲缓存
        </div>,
      });
    }

  }


  minWin = () => {
    ipcRenderer && ipcRenderer.send('window-min');
  }

  close = () => {
    Modal.confirm({
      title: '是否退出？',
      onOk: () => {
        ipcRenderer && ipcRenderer.send('window-close');
      }
    })

  }

  reload = () => {
    stores.music.reload();
  }

  render() {
    return (
      <LocaleProvider locale={zh_CN}>
        <Provider {...stores}>
          <div className={sty.container}>
            <div className='header'>
              <div className='logo'>CHENYIFAER FOREVER</div>
              <div className='action'>
              <Tooltip placement="topLeft" title="当你发现歌库数据不完整时，可以点这里重新缓存歌曲数据">
                <i className="fa-icon" onClick={this.reload}>&#xe6ba;</i>
              </Tooltip>
                <Icon type="minus" onClick={this.minWin} />
                <Icon type="close" onClick={this.close} />
              </div>
            </div>

            <div className='main'>
              <div className='criteria'>
                <Criteria />
              </div>

              <div className='content'>
                { this.props.children }
              </div>

            </div>

            <Player />

          </div>
        </Provider>
      </LocaleProvider>
    )
  }
}

export default Index;
