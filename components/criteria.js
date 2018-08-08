import React from 'react';
import { inject, observer } from "mobx-react";
import { Spin, Icon } from 'antd';


@inject('music')
@observer
class Criteria extends React.Component{
  componentDidMount() {
    this.props.music.loadCriteria();
  }

  render() {
    return <div>
      <Spin spinning={this.props.music.criteria.length === 0}>
        <ul>
        {
          this.props.music.criteria.map((item, index) =>
            <li key={item.id} className={this.props.music.current_criteria.id === item.id ? 'active' : ''} onClick={
              () => {
                this.props.music.toggle(item);
              }} >
              <Icon type="cloud-o" />{item.name}
            </li>
          )
        }
        </ul>
      </Spin>
    </div>;
  }
}

export default Criteria;
