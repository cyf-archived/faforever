import React from 'react';
import { inject, observer } from "mobx-react";
import { Button, Slider, Icon } from 'antd';

import * as sty from './player.less';

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
  }

  componentDidMount() {
    this.audio = this.refs.audio;
    this.audio.volume = this.state.volume;
    this.audio.addEventListener('play', this.play);
    this.audio.addEventListener('pause', this.pause);
    this.audio.addEventListener('canplay', () => { console.log('canplay'); this.audio.play(); });
    this.audio.addEventListener('durationchange ', (e) => { console.log('durationchange', e); });
    this.audio.addEventListener('ended', () => { this.props.music.playNext(); });
    this.audio.addEventListener('waiting', () => { console.log('waiting'); this.setState({ downloading: true }) });
    this.audio.addEventListener('loadstart', () => { console.log('loadstart'); this.setState({ downloading: true }) });
    this.audio.addEventListener('canplaythrough', () => { console.log('loadstart'); this.setState({ downloading: false }) });
    this.audio.addEventListener('error', () => { console.log('loadstart'); this.setState({ downloading: false }) });
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      if (this.audio.duration) {
        const percent = this.audio.currentTime / this.audio.duration * 100
        this.setState({
          currentTime: parseInt(this.audio.currentTime, 10),
          duration: parseInt(this.audio.duration, 10),
          percent
        })
      }
    }, 100)
  }

  play = () => {
    this.setState({
      isPlay: true,
      downloading: false,
    })
  }

  pause = () => {
    this.setState({
      isPlay: false
    })
  }

  toggle = () => {
    if (this.state.isPlay) {
      this.audio.pause()
    } else {
      this.audio.play()
    }
  }


  handleChange = (value) => {
    this.audio.volume = value;
    console.log(value);

    this.setState({ volume: value });
  }

  handleChangePercent = (value) => {
    if (this.audio.duration) {
      this.audio.currentTime = (value / 100) * this.audio.duration;
    }
  }


  formatter = (value) => {
    return `${parseInt(value * 100, 10)}%`;
  }

  render() {
    return <div className={sty.player}>
      <audio
        ref="audio"
        autoPlay
        controls
        loop={false}
        src={ this.props.music.url }
      >
        Your browser does not support the audio element.
      </audio>

      <div className='control'>
        <Button type="primary" shape="circle" icon="step-backward" onClick={() => { this.props.music.playPre(); }} />
        <Button type="primary" shape="circle" icon={this.state.isPlay ? 'pause' : 'caret-right'} size='large' onClick={this.toggle} />
        <Button type="primary" shape="circle" icon="step-forward" onClick={() => { this.props.music.playNext(); }} />
      </div>

      <div className='prppress'>

        <div style={{ marginLeft: 6 }}>{ this.state.downloading ? <Icon type="loading" /> : null }{this.props.music.song.title || '无播放音乐'}
        &nbsp;&nbsp;
        {`${Math.floor(Number(this.state.currentTime) / 60)}:${this.state.currentTime % 60 < 10 ? '0' + this.state.currentTime % 60 : this.state.currentTime % 60}`}
        /
        {`${Math.floor(Number(this.state.duration) / 60)}:${this.state.duration % 60 < 10 ? '0' + this.state.duration % 60 : this.state.duration % 60 }`} </div>
        <Slider value={this.state.percent} tipFormatter={null} step={0.01} onChange={this.handleChangePercent}/>
      </div>

      <div className='sound'>
        <Icon type="sound" />
        <Slider value={this.state.volume} onChange={this.handleChange} step={0.01} min={0} max={1} tipFormatter={this.formatter} />
      </div>

    </div>;
  }
}

export default Criteria;
