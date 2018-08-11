import React from 'react';
import { Icon, LocaleProvider, Modal, Tooltip, notification } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { configure } from 'mobx';
import { Provider } from 'mobx-react';
import { SearchBar } from 'antd-mobile';

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
    if (localStorage['version'] !== '3') {
      localStorage['version'] = '3'
      notification.open({
        duration: 8888,
        message: 'V1.0.3 ',
        description: <div>
          <b>之前的版本不能用了，大家去下载这个版本吧</b>
          <br/>
          本次主要测试内容为：
          <br/>
          1、安装包可以选择安装目录
          <br/>
          2、自动下载并缓存音乐
          <br/>
          <br/>
          PS：下载地址还是在网盘：https://pan.baidu.com/s/1iTbYgMSmJEWyLJecPmomNw
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
              <div className='logo'>FA FOREVER <span className='version'>V1.0.3</span></div>
              <SearchBar placeholder='搜索歌曲' onSubmit={stores.music.search}/>
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
