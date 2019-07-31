import React from "react";
import { Icon, LocaleProvider, Modal, Tooltip, notification } from "antd";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import { configure } from "mobx";
import { Provider } from "mobx-react";
import { SearchBar } from "antd-mobile";

import Criteria from "../components/criteria";
import Player from "../components/player";
import Chat from "../components/chat";
import Name from "../components/name";

import "moment/locale/zh-cn";

import stores from "../stores";
import * as sty from "./index.less";
let ipcRenderer;

if (window.require) {
  const electron = window.require("electron");
  ({ ipcRenderer } = electron);
}

configure({ enforceActions: true });

class Index extends React.Component {
  state = {
    name_visible: false
  };
  componentDidMount() {
    if (localStorage["version"] !== "4") {
      localStorage["version"] = "4";
      notification.open({
        duration: 8888,
        message: "V1.0.4",
        description: (
          <div>
            <b>V1.0.4 更新内容：</b>
            <br />
            1、优化下载缓存
          </div>
        )
      });
    }
  }

  minWin = () => {
    ipcRenderer && ipcRenderer.send("window-min");
  };

  close = () => {
    Modal.confirm({
      title: "是否退出？",
      onOk: () => {
        ipcRenderer && ipcRenderer.send("window-close");
      }
    });
  };

  reload = () => {
    stores.music.reload();
  };

  openName = () => {
    this.setState({
      name_visible: true
    });
  };

  closeName = () => {
    this.setState({
      name_visible: false
    });
  };

  startChat = () => {
    this.chat.connect();
    this.openChat();
  };

  render() {
    return (
      <LocaleProvider locale={zh_CN}>
        <Provider {...stores}>
          <div className={sty.container}>
            <div className="header">
              <div className="logo">
                FA FOREVER <span className="version">V1.2.1</span>
              </div>
              <SearchBar
                placeholder="搜索歌曲"
                onSubmit={stores.music.search}
              />
              <div className="action">
                <i
                  className="fa-icon"
                  onClick={() => {
                    if (localStorage.name) {
                      this.startChat();
                    } else {
                      this.openName();
                    }
                  }}
                >
                  &#xe611;
                </i>
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
            <Chat
              ref={chat => (this.chat = chat)}
              setOpen={handleToggle => {
                this.openChat = handleToggle;
              }}
            />

            <Name
              visible={this.state.name_visible}
              close={this.closeName}
              enter={() => {
                this.startChat();
              }}
            />
          </div>
        </Provider>
      </LocaleProvider>
    );
  }
}

export default Index;
