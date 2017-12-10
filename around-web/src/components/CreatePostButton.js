import React from 'react';
import $ from 'jquery';
import { Modal, Button, message } from 'antd';
import { WrappedCreatePostForm } from './CreatePostForm';
import { API_ROOT, TOKEN_KEY, AUTH_PREFIX, POS_KEY } from '../Constants';
import { PropTypes } from 'prop-types';

export class CreatePostButton extends React.Component {
  static propTypes = {
    loadNearbyPosts: PropTypes.func.isRequired,
  }
  state = {
    visible: false,
    confirmLoading: false,
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = () => {
    // get value
    // this form is the enhanced form, not the normal form
    const form = this.form.getWrappedForm();
    form.validateFields((err, values) => {
      if (err) {
         return;
      }
      console.log("Received values of form: " , values);
      // prepare formData
      const { lat, lon } = JSON.parse(localStorage.getItem(POS_KEY));
      const formData = new FormData();
      formData.set('lat', lat + Math.random() * 0.05 - 0.1);
      formData.set('lon', lon + Math.random() * 0.05 - 0.1);
      formData.set('message', form.getFieldValue('message'));
      formData.set('image', form.getFieldValue('image')[0]);
      // send request
      this.setState({ confirmLoading: true });
      $.ajax({
        method: 'POST',
        url: `${API_ROOT}/post`,
        headers: {
          Authorization: `${AUTH_PREFIX} ${localStorage.getItem(TOKEN_KEY)}`,
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
      }).then(() => {
        this.props.loadNearbyPosts().then(() => {
          this.setState({ visible: false, confirmLoading: false });
        });
      }).catch((e) => {
        message.error('create post failed.');
        console.error(e);
      });
    });
  }
  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visible: false,
    });
  }
  saveFormRef = (form) => {
    this.form = form;
  }
  render() {
    const { visible, confirmLoading } = this.state;
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>New Post</Button>
        <Modal title="Create New Post"
               visible={visible}
               onOk={this.handleOk}
               okText="Create"
               confirmLoading={confirmLoading}
               onCancel={this.handleCancel}
               cancelText="Cancel"
        >
          <WrappedCreatePostForm wrappedComponentRef={this.saveFormRef}/>
        </Modal>
      </div>
    );
  }
}