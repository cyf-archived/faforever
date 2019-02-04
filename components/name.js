import React from "react";
import { inject, observer } from "mobx-react";
import { Form, Input, Modal } from "antd";

@Form.create()
@inject("chat")
@observer
class Name extends React.Component {
  submit = () => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        await this.props.chat.setName(values.name);
        this.props.close();
        this.props.enter();
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Modal
        visible={this.props.visible}
        closable={false}
        okText="去聊聊"
        onOk={this.submit}
        onCancel={this.props.close}
      >
        <Form onSubmit={this.handleSubmit}>
          <Form.Item>
            {getFieldDecorator("name", {
              rules: [
                {
                  required: true,
                  message: "请输入昵称！"
                }
              ]
            })(<Input placeholder="先取个昵称吧~" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Name;
