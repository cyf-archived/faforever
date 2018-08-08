import React from 'react';
import { Icon, LocaleProvider, Modal } from 'antd';
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

  render() {
    return (
      <Provider {...stores}>
        <LocaleProvider locale={zh_CN}>
          <div className={sty.container}>
            <div className='header'>
              <div className='logo'>CHENYIFAER FOREVER</div>
              <div className='action'>
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
        </LocaleProvider>
      </Provider>
    )
  }
}

export default Index;
