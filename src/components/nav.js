import React from 'react';
import { inject, observer } from 'mobx-react';
import { Spin, Icon, Tag, Divider, Modal, Input } from 'antd';
import { Menu, Item, contextMenu } from 'react-contexify';
let shell;

if (window.require) {
  const electron = window.require('electron');
  ({ shell } = electron);
}

@inject('music', 'my')
@observer
class Criteria extends React.Component {
  state = {
    active: 'ds',
    mylistVisible: false,
    mylistName: '',
    mylistUuid: null,
    myUUIDVisible: false,
    myUUID: '',
  };
  componentDidMount() {
    this.load();
  }

  load = async () => {
    await this.props.music.loadCriteria();
    await this.props.music.caculateCached();
    await this.props.music.loadLike();
  };

  toggle = active => {
    if (typeof active === 'string') {
      this.setState({
        active,
      });

      if (active === 'ds') {
        this.props.my.toggle('ds');
      }

      if (active === 'de') {
        this.props.my.toggle('de');
      }

      if (active === 'twitch') {
        this.props.my.toggle('twitch');
      }

      if (active === 'rank') {
        this.props.my.toggle('rank');
      }

      if (active === 'random') {
        this.props.my.toggle('random');
      }

      if (active === 'cache') {
        this.props.music.toggle('__cached__');
        this.props.my.toggle('list');
      }

      if (active === 'like') {
        this.props.music.toggle(this.props.music.likes, 'system_like');
        this.props.my.toggle('list');
      }
    } else if (active.uuid) {
      this.setState({
        active: active.uuid,
      });
      this.props.music.toggle(active.musics, active.uuid);
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

  closeMyUUID = () => {
    this.setState({
      myUUIDVisible: false,
    });
  };

  openMyUUID = () => {
    this.setState({
      myUUIDVisible: true,
      myUUID: global.userUUID,
    });
  };

  render() {
    const { active, mylistVisible = false, mylistName = '', mylistUuid = null } = this.state;
    const { list = [] } = this.props.my;
    return (
      <div style={{ overflowY: 'auto', '-webkit-app-region': 'no-drag' }}>
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

        <Modal
          visible={this.state.myUUIDVisible}
          title={'您的UUID'}
          onCancel={this.closeMyUUID}
          onOk={() => {
            if (this.state.myUUID) {
              console.log(this.state.myUUID);
              global.userUUID = this.state.myUUID;
              localStorage.uuid = this.state.myUUID;
            }
            this.closeMyUUID();
            this.props.music.loadLike();
          }}
        >
          <Input
            placeholder="请输入您的UUID"
            value={this.state.myUUID}
            onInput={e => {
              this.setState({
                myUUID: e.currentTarget.value,
              });
            }}
          />
          <div
            style={{
              fontWeight: 'bold',
              fontSize: 12,
              color: 'red',
              marginTop: 10,
            }}
          >
            <div>* 请设置具有个性化且复杂的UUID避免被别人使用</div>
            <div>* UUID仅关联“我喜欢的音乐”模块，其他模块会在后续慢慢接入。</div>
            <div>* UUID请不要设置为自己的常用密码，因为UUID在服务端是明文存储的</div>
          </div>
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

            <li
              className={active === 'random' ? 'active' : ''}
              onClick={this.toggle.bind(this, 'random')}
            >
              <span>随机听歌</span>
            </li>

            {/* <li
              className={active === 'twitch' ? 'active' : ''}
              onClick={this.toggle.bind(this, 'twitch')}
            >
              <span>直播(测试版)</span>
            </li> */}

            {/* <li className={active === 'de' ? 'active' : ''} onClick={this.toggle.bind(this, 'de')}>
              <span>o(*^＠^*)o</span>
            </li> */}

            <li
              className={active === 'rank' ? 'active' : ''}
              onClick={this.toggle.bind(this, 'rank')}
            >
              <span>排行榜</span>
            </li>

            <li
              onClick={() => {
                shell.openExternal('https://chenyifaer.taobao.com/');
              }}
            >
              <span>喜瑞斯</span>
            </li>

            <Divider />

            <li>
              <span style={{ fontWeight: 800 }}>我创建的歌单</span>
              <div className="btn" onClick={this.openMylistCreator.bind(this, null, null)}>
                <Icon type="plus" />
              </div>
            </li>

            <li
              className={`${active === 'like' ? 'active' : ''} my`}
              onClick={this.toggle.bind(this, 'like')}
            >
              <span>我喜欢的音乐</span>
              <Tag>{this.props.music.likes?.length ?? 0}</Tag>
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

        <div
          style={{
            position: 'absolute',
            bottom: 10,
            left: 10,
            fontSize: 10,
            opacity: 0.5,
            cursor: 'pointer',
          }}
          onClick={this.openMyUUID}
        >
          设置我的UUID
        </div>
      </div>
    );
  }
}

export default Criteria;
