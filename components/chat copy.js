import React from "react";
import { Widget, renderCustomComponent } from "react-chat-widget";
import io from "socket.io-client";

import "react-chat-widget/lib/styles.css";
import "./chat.less";

const host = "148.70.4.54:37373";
// const host = "127.0.0.1:7001";

class Message extends React.Component {
  render() {
    return (
      <div className="rcw-messages">
        <div className="rcw-message-name">{this.props.name}</div>
        <div className="rcw-response">
          <div className="rcw-message-text">
            <p>{this.props.text}</p>
          </div>
        </div>
      </div>
    );
  }
}
class System extends React.Component {
  render() {
    return <div className="rcw-system-messages">{this.props.text}</div>;
  }
}

class Chat extends React.Component {
  socket = null;

  handleNewUserMessage = text => {
    if (this.socket) {
      console.log(text);
      this.socket.emit("chat", {
        text
      });
    }
  };

  componentDidMount() {
    renderCustomComponent(System, {
      text: "连接中..."
    });
  }

  connect = () => {
    if (!this.socket) {
      this.socket = io(host, {
        transports: ["websocket"],
        query: {
          room: "fa-forever",
          name: localStorage.name
        }
      });

      this.socket.on("connect", this.onConnect);
      this.socket.on("join", this.onJoin);
      this.socket.on("leave", this.onLeave);
      this.socket.on("message", this.onMessage);
      this.socket.on("system", this.onSystem);
      this.socket.on("disconnect", this.onDisConnect);
    }
  };

  onConnect = () => {
    renderCustomComponent(System, {
      text: "已连接"
    });
  };

  onJoin = data => {
    renderCustomComponent(System, {
      text: `${data.name}加入.`
    });
  };

  onLeave = data => {
    renderCustomComponent(System, {
      text: `${data.name}离开.`
    });
  };

  onSystem = data => {
    renderCustomComponent(System, {
      text: data.text
    });
  };

  onMessage = data => {
    if (data.id !== this.socket.id) {
      renderCustomComponent(Message, data);
    }
  };

  onDisConnect = () => {
    renderCustomComponent(System, {
      text: "已断开"
    });
  };

  render() {
    return (
      <Widget
        senderPlaceHolder="说点什么吧..."
        handleNewUserMessage={this.handleNewUserMessage}
        launcher={handleToggle => this.props.setOpen(handleToggle)}
      />
    );
  }
}

export default Chat;
