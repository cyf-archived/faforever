import React from 'react';
import io from 'socket.io-client';
import { message, notification, Input } from 'antd';
import Name from './name';

import './chat.less';
import { Button } from 'antd-mobile';

const host = '148.70.4.54:37373';
// const host = "127.0.0.1:7001";

class Chat extends React.Component {
  socket = null;
  time = -1;

  state = {
    name_visible: false,
    text: '',
  };

  handleNewUserMessage = text => {
    if (this.socket) {
      console.log(text);
      this.socket.emit('chat', {
        text,
      });
    }
  };

  componentDidMount() {}

  openNotification = text => {
    notification.open({
      message: '-',
      description: text,
      className: 'chat-msg',
      duration: 2,
      style: {
        width: 'auto',
      },
    });
  };

  connect = () => {
    if (!this.socket) {
      this.socket = io(host, {
        transports: ['websocket'],
        query: {
          room: 'fa-forever',
          name: localStorage.name,
        },
      });

      this.socket.on('connect', this.onConnect);
      this.socket.on('join', this.onJoin);
      this.socket.on('leave', this.onLeave);
      this.socket.on('message', this.onMessage);
      this.socket.on('system', this.onSystem);
      this.socket.on('disconnect', this.onDisConnect);
    }
  };

  onConnect = () => {
    message.success('与聊天服务器连接成功.');
  };

  onJoin = data => {
    // this.openNotification(`${data.name}加入.`);
  };

  onLeave = data => {
    // this.openNotification(`${data.name}离开.`);
  };

  onSystem = data => {
    this.openNotification(data.text);
  };

  onMessage = data => {
    // console.log(data, `${data.name}: ${data.text}`);
    this.openNotification(`${data.name}: ${data.text}`);
  };

  onDisConnect = () => {
    message.error('与聊天服务器断开.');
  };

  openName = () => {
    this.setState({
      name_visible: true,
    });
  };

  closeName = () => {
    this.setState({
      name_visible: false,
    });
  };

  componentWillUnmount() {
    if (this.socket) {
      this.socket.close();
    }
  }

  send = text => {
    if (localStorage.name) {
      if (this.socket && this.state.value) {
        console.log('send...', this.state.value);
        const now = new Date().valueOf();
        if (this.time > 0 && now - this.time < 3000) {
          return message.info('请勿灌水');
        }
        this.time = new Date().valueOf();
        this.socket.emit('chat', {
          text: this.state.value,
        });
        this.setState({
          value: '',
        });
      }
    } else {
      this.openName();
    }
  };

  onValueChange = e => {
    this.setState({
      value: e.target.value,
    });
  };

  render() {
    return (
      <div className="chat-input">
        <Name
          visible={this.state.name_visible}
          close={this.closeName}
          enter={() => {
            this.closeName();
          }}
        />
        <Input
          value={this.state.value}
          onChange={this.onValueChange.bind(this)}
          onPressEnter={this.send}
          placeholder="(*^__^*) 这是一个假的弹幕..."
        />
        <Button size="small" type="primary" onClick={this.send}>
          发送弹幕
        </Button>
      </div>
    );
  }
}

export default Chat;
