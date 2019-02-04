import React from "react";
import { inject, observer } from "mobx-react";
import { List, Icon } from "antd";
import { NoticeBar } from "antd-mobile";
import "moment/locale/zh-cn";

import * as sty from "./index.less";

@inject("music")
@observer
class Index extends React.Component {
  componentDidMount() {
    this.props.music.login();
  }

  render() {
    return (
      <div className={sty.container}>
        {this.props.music.note && (
          <NoticeBar
            marqueeProps={{
              loop: true,
              leading: 2000,
              trailing: 2000,
              style: { padding: "0 7.5px" }
            }}
          >
            {this.props.music.note}
          </NoticeBar>
        )}

        <List
          size="small"
          dataSource={this.props.music.current_songs}
          loading={this.props.music.listloading}
          header={
            <List.Item className="header-box">
              <div className="playing" />
              <div className="title">标题</div>
              <div className="album">专辑</div>
              <div className="artist">演唱</div>
              <div className="duration">时长</div>
            </List.Item>
          }
          renderItem={item => (
            <List.Item
              key={`${item.id}-${item.cached ? "1" : "2"}`}
              onDoubleClick={() => {
                this.props.music.play(item);
              }}
            >
              <div className="playing">
                {item.playing && (
                  <i className="fa-icon spin" style={{ color: "#c62f2f" }}>
                    &#xe61f;
                  </i>
                )}
              </div>
              <div className="title">{item.title}</div>
              <div className="album">{item.additional.song_tag.album}</div>
              <div className="artist">{item.additional.song_tag.artist}</div>
              <div className="duration">
                {`${Math.floor(
                  Number(item.additional.song_audio.duration) / 60
                )}:${
                  item.additional.song_audio.duration % 60 < 10
                    ? "0" + (item.additional.song_audio.duration % 60)
                    : item.additional.song_audio.duration % 60
                }`}
                {item.cached && (
                  <Icon
                    type="cloud-download"
                    style={{ marginLeft: 4, color: "#c62f2f", fontSize: 12 }}
                  />
                )}
              </div>
            </List.Item>
          )}
        />
      </div>
    );
  }
}

export default Index;
