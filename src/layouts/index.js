import React from 'react';
import { Icon, ConfigProvider, Modal, Tooltip } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { configure } from 'mobx';
import { Provider } from 'mobx-react';
import { SearchBar } from 'antd-mobile';

import Nav from '../components/nav';
import Player from '../components/player';
import ModeContext from '../components/context';

import 'moment/locale/zh-cn';
// import 'react-contexify/dist/ReactContexify.css';
import stores from '../stores';
import * as sty from './index.less';
let ipcRenderer;
let remote;
let shell;

if (window.require) {
  const electron = window.require('electron');
  ({ ipcRenderer, remote, shell } = electron);
}

configure({
  enforceActions: 'always',
});

class Index extends React.Component {
  state = {
    mode: 1,
    isPlay: false,
    currentTime: 0,
  };
  componentDidMount() {
    const cachePath = localStorage.getItem('cache-path');
    if (cachePath) {
      ipcRenderer && ipcRenderer.send('cache-path', cachePath);
    }
    stores.music.loadNote();
    // stores.music.login();
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

  setCachePath = () => {
    remote.dialog.showOpenDialog({ properties: ['openDirectory'] }, filename => {
      if (filename && filename.length === 1) {
        // console.log(filename[0]);
        localStorage.setItem('cache-path', filename[0]);
        ipcRenderer && ipcRenderer.send('cache-path', filename[0]);
        stores.music.caculateCached();
      }
    });
  };

  toggleMode = mode => {
    this.setState({
      mode,
    });
  };

  togglePlay = () => {
    if (this.state.isPlay) {
      document.getElementById('audio').pause();
    } else {
      document.getElementById('audio').play();
    }
  };

  onPlay = isPlay => {
    this.setState({
      isPlay,
    });
  };

  onCurrentTime = currentTime => {
    this.setState({
      currentTime,
    });
  };

  render() {
    return (
      <ModeContext.Provider
        value={{
          mode: this.state.mode,
          isPlay: this.state.isPlay,
          toggleMode: this.toggleMode,
          togglePlay: this.togglePlay,
        }}
      >
        <ConfigProvider locale={zh_CN}>
          <Provider {...stores}>
            <div className={sty.container}>
              <div className="header">
                <div className="logo">
                  {process.env.APPNAME} <span className="version">{process.env.VERSION}</span>
                </div>
                <SearchBar
                  placeholder="搜索歌曲"
                  onSubmit={key => {
                    stores.music.search(key);
                    stores.my.toggle('list');
                  }}
                />

                <div className="action">
                  <Tooltip
                    placement="topLeft"
                    title="安卓TV电视端，可能存在各种不稳定因素，目前测试了小米的是可以运行的。"
                  >
                    <span
                      onClick={() => {
                        shell.openExternal(
                          'https://pan.baidu.com/s/1kl_ENZVIKk5ySfoUIluKbQ?pwd=ii9a',
                        );
                      }}
                      style={{ fontSize: 10, cursor: 'pointer' }}
                    >
                      安卓TV电视端
                    </span>
                  </Tooltip>

                  <Tooltip
                    placement="topLeft"
                    title="指定缓存目录，此功能不支持在线升级，需要下载最新客户端，点击歌曲列表的“小云标志”可以一键打开文件夹"
                  >
                    <i className="fa-icon" onClick={this.setCachePath}>
                      &#xe643;
                    </i>
                  </Tooltip>

                  {/* <Tooltip
                  placement="topLeft"
                  title="当你发现歌库数据不完整时，可以点这里重新缓存歌曲数据"
                >
                  <i className="fa-icon" onClick={this.reload}>
                    &#xe6ba;
                  </i>
                </Tooltip> */}

                  <Icon type="minus" onClick={this.minWin} />
                  <Icon type="close" onClick={this.close} />
                </div>
              </div>

              <div className="main">
                <div className="nav">
                  <Nav />
                </div>

                <div className="content">{this.props.children}</div>
              </div>

              <Player
                mode={this.state.mode}
                toggleMode={this.toggleMode}
                togglePlay={this.togglePlay}
                isPlay={this.state.isPlay}
                onPlay={this.onPlay}
                currentTime={this.state.currentTime}
                onCurrentTime={this.onCurrentTime}
              />
            </div>
          </Provider>
        </ConfigProvider>
      </ModeContext.Provider>
    );
  }
}

export default Index;
