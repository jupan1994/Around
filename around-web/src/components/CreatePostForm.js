import React from 'react';
import { Form, Modal, Input, Upload, Icon } from 'antd';

export class CreatePostForm extends React.Component {
  normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }

  beforeUpload = () => {
    return false;
  }

  render() {
    const FormItem = Form.Item;
    const { visible, onCancel, onCreate, confirmLoading, form } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Modal
        visible={visible}
        title="Create A New Post"
        okText="Create"
        cancelText="Cancel"
        onCancel={onCancel}
        onOk={onCreate}
        confirmLoading={confirmLoading}
      >
        <Form>
          <FormItem
            {...formItemLayout}
            label="Message"
          >
            {getFieldDecorator('message', {
              rules: [{ required: true, message: 'Please input the title of collection!' }],
            })(
              <Input name="message"/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Image"
          >
            {getFieldDecorator('image', {
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
            })(
              <Upload.Dragger
                name="image"
                beforeUpload={this.beforeUpload}
              >
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
              </Upload.Dragger>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export const WrappedCreatePostForm = Form.create()(CreatePostForm);