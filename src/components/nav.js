import React from 'react';
import { inject, observer } from 'mobx-react';
import { Spin, Icon, Tag, Divider, Modal, Input } from 'antd';
import { Menu, Item, contextMenu } from 'react-contexify';

@inject('music', 'my')
@observer
class Criteria extends React.Component {
  state = {
    active: 'ds',
    mylistVisible: false,
    mylistName: '',
    mylistUuid: null,
  };
  componentDidMount() {
    this.load();
  }

  load = async () => {
    if (!localStorage['songs']) {
      await this.props.music.loadCriteria();
    }
    await this.props.music.caculateCached();
  };

  toggle = active => {
    if (typeof active === 'string') {
      this.setState({
        active,
      });

      if (active === 'ds') {
        this.props.my.toggle('ds');
      }

      if (active === 'cache') {
        this.props.music.toggle('__cached__');
        this.props.my.toggle('list');
      }
    } else if (active.uuid) {
      this.setState({
        active: active.uuid
      });
      this.props.music.toggle(active.musics);
      this.props.my.toggle('list');
    }
  };

  openMylistCreator = (uuid = null, name = '') => {
    this.setState({
      mylistVisible: true,
      mylistName: name,
      mylistUuid: uuid,
    });
  };

  closeMylistCreator = () => {
    this.setState({
      mylistVisible: false,
      mylistName: '',
      mylistUuid: null,
    });
  };

  render() {
    const { active, mylistVisible = false, mylistName = '', mylistUuid = null } = this.state;
    const { list = [] } = this.props.my;
    return (
      <div style={{ overflowY: 'auto' }}>
        <Modal
          visible={mylistVisible}
          title={mylistUuid ? '修改歌单名称' : '创建您的本地歌单'}
          onCancel={this.closeMylistCreator}
          onOk={() => {
            if (this.state.mylistName) {
              if (mylistUuid) {
                this.props.my.update(mylistUuid, this.state.mylistName);
                this.closeMylistCreator();
              } else {
                this.props.my.plus(this.state.mylistName);
                this.closeMylistCreator();
              }
            }
          }}
        >
          <Input
            placeholder="请输入歌单的名称"
            value={mylistName}
            onInput={e => {
              this.setState({
                mylistName: e.currentTarget.value,
              });
            }}
          />
        </Modal>

        <Menu id="navlist">
          <Item
            onClick={e => {
              const { props } = e;
              this.openMylistCreator(props.uuid, props.name);
            }}
          >
            编辑
          </Item>
          <Item
            onClick={e => {
              const { props } = e;
              Modal.confirm({
                title: '确认要删除吗？删除后不可恢复歌单哟～',
                okText: '删除',
                cancelText: '取消',
                onOk: () => {
                  this.props.my.remove(props.uuid);
                },
              });
            }}
          >
            删除
          </Item>
        </Menu>

        <Spin spinning={this.props.music.loading}>
          <ul className="criteria">
            <li className={active === 'ds' ? 'active' : ''} onClick={this.toggle.bind(this, 'ds')}>
              <span>DS歌单集合</span>
            </li>
            <Divider />
            <li>
              <span style={{ fontWeight: 800 }}>我创建的歌单</span>
              <div className="btn" onClick={this.openMylistCreator.bind(this, null, null)}>
                <Icon type="plus" />
              </div>
            </li>
            {list.map(item => (
              <li
                key={item.uuid}
                className={`${active === item.uuid ? 'active' : ''} my`}
                onClick={this.toggle.bind(this, item)}
                onContextMenu={e => {
                  contextMenu.show({
                    id: 'navlist',
                    event: e,
                    props: {
                      uuid: item.uuid,
                      name: item.name,
                    },
                  });
                }}
              >
                <span>{item.name}</span>
                <Tag>{(item.musics || []).length}</Tag>
              </li>
            ))}
            <li
              className={active === 'cache' ? 'active' : ''}
              onClick={this.toggle.bind(this, 'cache')}
            >
              <Icon type="cloud-download" />
              <span>已缓存</span>
              <Tag>{this.props.music.cacheds.length}</Tag>
            </li>
          </ul>
        </Spin>
      </div>
    );
  }
}

export default Criteria;
