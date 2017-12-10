import React from 'react';
import { Button, message } from 'antd';
import { WrappedCreatePostForm } from './CreatePostForm';
import $ from 'jquery';
import { API_ROOT, TOKEN_KEY, AUTH_PREFIX, POS_KEY } from '../Constants';

export class CreatePostButton extends React.Component {
  state = {
    visible: false,
    confirmLoading: false,
  }
  showModal = () => {
    this.setState({ visible: true });
  }
  handleCancel = () => {
    this.setState({ visible: false });
  }
  handleCreate = () => {
    const form = this.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log('Received values of form: ', values);
      const { lat, lon } = JSON.parse(localStorage.getItem(POS_KEY));
      const formData = new FormData();
      formData.set('lat', lat);
      formData.set('lon', lon);
      formData.set('message', form.getFieldValue('message'));
      formData.set('image', form.getFieldValue('image')[0]);
      this.setState({ confirmLoading: true });
      $.ajax({
        method: 'POST',
        url: `${API_ROOT}/post`,
        headers: {
          'Authorization': `${AUTH_PREFIX} ${localStorage.getItem(TOKEN_KEY)}`,
        },
        processData: false,
        contentType: false,
        dataType: 'text',
        data: formData,
      }).then(() => {
        message.success('created a post successfully.');
        form.resetFields();
      },(error) => {
        message.error(error.responseText);
        form.resetFields();
      }).catch((e) => {
        message.error('create post failed.');
        console.error(e);
      }).then(() => {
        this.props.loadNearbyPosts().then(() => {
          this.setState({ visible: false, confirmLoading: false });
        });
      });
    });
  }
  saveFormRef = (form) => {
    this.form = form;
  }
  render() {
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>New Post</Button>
        <WrappedCreatePostForm
          ref={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          confirmLoading={this.state.confirmLoading}
        />
      </div>
    );
  }
}
