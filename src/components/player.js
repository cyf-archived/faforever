import React from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Slider, message, Icon, Modal } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './player.less';
import Playing from './playlist';
import Lrc from './lrc';



let shell;

if (window.require) {
  const electron = window.require('electron');
  ({ shell } = electron);
}



@inject('music')
@observer
class Criteria extends React.Component {
  state = {
    downloading: false,
    percent: 0,
    volume: 0.2,
    isPlay: false,
    currentTime: 0,
    duration: 0,
    mode: 1,
    showlist: false,
    showlrc: false,
  };

  componentDidMount() {
    this.audio = this.refs.audio;
    this.audio.volume = this.state.volume;
    this.audio.addEventListener('play', this.play);
    this.audio.addEventListener('pause', this.pause);
    this.audio.addEventListener('canplay', () => {
      this.audio.play();
    });
    this.audio.addEventListener('durationchange ', e => {});
    this.audio.addEventListener('ended', () => {
      this.props.music.playNext(this.state.mode);
    });
    this.audio.addEventListener('waiting', () => {
      this.setState({ downloading: true });
    });
    this.audio.addEventListener('loadstart', () => {
      this.setState({ downloading: true });
    });
    this.audio.addEventListener('canplaythrough', () => {
      this.setState({ downloading: false });
    });
    this.audio.addEventListener('error', () => {
      this.setState({ downloading: false });
      if (this.props.music.url) {
        message.error(`播放失败，请检查网络/刷新缓存/留意公告。`);
        setTimeout(() => {
          this.props.music.playNext(this.state.mode);
        }, 5000);
      }
    });

    clearInterval(this.timer);
    this.timer = setInterval(() => {
      if (this.audio.duration) {
        const percent = (this.audio.currentTime / this.audio.duration) * 100;
        this.setState({
          currentTime: parseInt(this.audio.currentTime, 10),
          duration: parseInt(this.audio.duration, 10),
          percent,
        });
      }
    }, 100);
  }

  play = () => {
    this.setState({
      isPlay: true,
      downloading: false,
    });
  };

  pause = () => {
    this.setState({
      isPlay: false,
    });
  };

  toggle = () => {
    if (this.state.isPlay) {
      this.audio.pause();
    } else {
      this.audio.play();
    }
  };

  handleChange = value => {
    this.audio.volume = value;
    this.setState({ volume: value });
  };

  handleChangePercent = value => {
    if (this.audio.duration) {
      this.audio.currentTime = (value / 100) * this.audio.duration;
    }
  };

  formatter = value => {
    return `${parseInt(value * 100, 10)}%`;
  };

  toggleMode = mode => {
    this.setState({
      mode: mode,
    });
  };

  render() {
    return (
      <div className="player">
        <audio
          ref="audio"
          autoPlay
          controls
          loop={this.state.mode === 2}
          src={this.props.music.url}
        ></audio>

        <div className="controller-bar ">
          <Slider
            onChange={this.handleChangePercent}
            min={0}
            max={100}
            value={this.state.percent}
            step={0.01}
            tooltipVisible={false}
          />
        </div>

        {this.props.music.song.additional ? (
          <div className="music-info">
            <img
              src={`http://magict.cn:5000/webapi/AudioStation/cover.cgi?api=SYNO.AudioStation.Cover&version=3&method=getcover&album_name=${this.props.music.song.additional.song_tag.album}&album_artist_name=${this.props.music.song.additional.song_tag.album_artist}&library=all`}
              className={`avatar ${this.state.isPlay && 'spin'}`}
              alt=""
            />
            <div className="box">
              <div className="title">
                {this.state.downloading ? <Icon type="loading" /> : null}
                {this.props.music.song.title || '-'}
                {this.props.music.lrc ? (
                  <span
                    className="lrc-tag"
                    onClick={() => {
                      this.setState({
                        showlrc: !this.state.showlrc,
                      });
                    }}
                  >
                    词
                  </span>
                ) : (
                  <span
                    className="not-lrc"
                    onClick={() => {
                      Modal.confirm({
                        title: '现在还没有歌词',
                        content: (
                          <div>
                            
                            <CopyToClipboard
                              text={`${this.props.music.key}.lrc`}
                              onCopy={() => {
                                message.success('复制成功');
                              }}
                            >
                              <p>
                                文件名为：
                                <span style={{ color: '#0091ff', cursor: 'pointer' }}>
                                  {this.props.music.key}.lrc [点击复制文件名]
                                </span>
                              </p>
                            </CopyToClipboard>

                       

                            <p>注意文件编码需为UTF8</p>
                            <p>歌词思路来自工程群内的搬运工，指路=》https://github.com/cdmfw/cyf</p>
                          </div>
                        ),
                        onOk: ()=>{
                          shell.openExternal('https://gitee.com/rojerchen/faforever-lrc')
                        },
                        okText: '去贡献歌词',
                        cancelText: '关闭',
                      });
                    }}
                  >
                    词
                  </span>
                )}
              </div>
              <div className="timer">
                {Math.floor(Number(this.state.currentTime) / 60)}:
                {this.state.currentTime % 60 < 10
                  ? '0' + (this.state.currentTime % 60)
                  : this.state.currentTime % 60}{' '}
                / {Math.floor(Number(this.state.duration) / 60)}:
                {this.state.duration % 60 < 10
                  ? '0' + (this.state.duration % 60)
                  : this.state.duration % 60}
              </div>
            </div>
          </div>
        ) : (
          <div className="music-info" />
        )}

        {this.props.music.lrc && this.state.showlrc && (
          <div className="lrc">
            <Lrc lrctext={this.props.music.lrc} currentTime={this.state.currentTime} />
          </div>
        )}

        <div className="control">
          <Button
            type="primary"
            shape="circle"
            icon="step-backward"
            onClick={() => {
              this.props.music.playPre(this.state.mode);
            }}
          />
          <Button
            type="primary"
            shape="circle"
            icon={this.state.isPlay ? 'pause' : 'caret-right'}
            size="large"
            onClick={this.toggle}
          />
          <Button
            type="primary"
            shape="circle"
            icon="step-forward"
            onClick={() => {
              this.props.music.playNext(this.state.mode);
            }}
          />
        </div>

        <div className="sound">
          <i className="fa-icon">&#xe662;</i>
          <Slider
            value={this.state.volume}
            onChange={this.handleChange}
            step={0.1}
            min={0}
            max={1}
            tipFormatter={this.formatter}
          />
          <div className="actions">
            <Icon
              type="unordered-list"
              style={{ marginLeft: 12 }}
              onClick={() => {
                this.setState({
                  showlist: !this.state.showlist,
                });
              }}
            />
          </div>
        </div>
        {this.state.showlist && (
          <div
            className="playingbox"
            style={{ visibility: this.state.showlist ? 'visible' : 'hidden' }}
          >
            <Playing
              mode={this.state.mode}
              onChange={mode => {
                this.setState({
                  mode,
                });
              }}
            />
          </div>
        )}
      </div>
    );
  }
}

export default Criteria;
