import React from 'react';
import { inject, observer } from "mobx-react";
import { Spin, Icon, Tag } from 'antd';


@inject('music')
@observer
class Criteria extends React.Component{
  componentDidMount() {
    this.props.music.loadCriteria();
  }

  render() {
    return <div>
      <Spin spinning={this.props.music.loading}>
        <ul>
        {
          this.props.music.criteria.map((item, index) =>
            <li key={item.name} className={this.props.music.current_criteria === item.name ? 'active' : ''} onClick={
              () => {
                this.props.music.toggle(item.name);
              }} >
              <Icon type="cloud-o" />
              <span>{item.name}</span>
              <Tag>{this.props.music.songs[item.name] ? this.props.music.songs[item.name].length : 0}</Tag>
            </li>
          )
        }
        </ul>
      </Spin>
    </div>;
  }
}

export default Criteria;
