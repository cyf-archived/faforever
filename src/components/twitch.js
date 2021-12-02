import React, { Component } from 'react';
import Videojs from 'video.js';
import { Select, Input, Button } from 'antd';
import 'video.js/dist/video-js.css';
import axios from 'axios';

class VideoPlayer extends Component {
  state = {
    mode: 'none',
    data: [],
    // channel: 'uzra',
    channel: 'thebs_chen',
  };
  componentWillUnmount() {
    // 销毁播放器
    if (this.player) {
      this.player.dispose();
    }
  }
  componentDidMount() {
    this.loadTwitch();
  }

  loadTwitch = async () => {
    const { data } = await axios.request({
      url:
        'http://service-dekb3ykq-1251277120.hk.apigw.tencentcs.com/twitch?channel=' +
        this.state.channel,
    });

    if (Array.isArray(data) && data.length > 0) {
      console.log('data', data);
      //   const sindata = data.filter(i => i.link.indexOf('video-weaver.sin01.hls.ttvnw.net') > 0);
      //   console.log('sindata', sindata);

      this.setState({
        data: data,
      });
      let source = data[0].link;
      console.log('source', source);
      this.player = Videojs(
        'custom-video',
        {
          height: 540,
          width: 780,
          bigPlayButton: true,
          textTrackDisplay: false,
          errorDisplay: false,
          controlBar: true,
          type: 'application/x-mpegURL',
        },
        function() {
          this.play();
        },
      );
      this.player.src({ src: source });
      this.setState({ mode: 'playing' });
    } else {
      this.setState({ mode: 'none' });
    }
  };

  render() {
    return (
      <div>
        {this.state.mode === 'none' ? (
          <p
            style={{
              textAlign: 'center',
              fontSize: 24,
              color: '#000000',
              marginTop: 50,
            }}
          >
            发发还未开播噢~
          </p>
        ) : null}
        <div style={{ display: this.state.mode === 'none' ? 'none' : 'block' }}>
          <video id="custom-video" className="video-js" controls preload="auto"></video>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginTop: 12 }}>
          <div
            style={{
              flexShrink: 0,
              marginRight: 8,
            }}
          >
            频道ID：
          </div>
          <Input
            value={this.state.channel}
            onInput={e => this.setState({ channel: e.target.value })}
            style={{ width: 200, flexShrink: 0, marginRight: 8 }}
          />
          <div style={{ flexShrink: 0, marginRight: 8 }}>
            <Button
              type="primary"
              shape="circle"
              icon="reload"
              size="small"
              onClick={this.loadTwitch}
            />
          </div>
          <div
            style={{
              flexShrink: 0,
              marginRight: 8,
            }}
          >
            清晰度：
          </div>
          <Select
            onChange={link => {
              this.player.src({ src: link });
            }}
            style={{ width: 200 }}
            placeholder="切换清晰度"
          >
            {this.state.data.map(i => (
              <Select.Option key={i.link} value={i.link}>
                {i.quality}
              </Select.Option>
            ))}
          </Select>
        </div>

        <p
          style={{
            textAlign: 'center',
            fontSize: 12,
            color: '#d6d5d5',
          }}
        >
          测试版，如卡顿请切换清晰度
        </p>
      </div>
    );
  }
}

export default VideoPlayer;
