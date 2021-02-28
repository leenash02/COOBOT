import './index.less';

import * as React from 'react';

import { Button, Card, Col, Form, Input, Row, Tooltip, Icon, message } from 'antd';
import { inject, observer } from 'mobx-react';
import { FormComponentProps } from 'antd/lib/form';
import { Redirect } from 'react-router-dom';

import AccountStore from '../../stores/accountStore';
import AuthenticationStore from '../../stores/authenticationStore';
import SessionStore from '../../stores/sessionStore';
import Stores from '../../stores/storeIdentifier';
import rules from './index.validation';
import LoginModel from '../../models/Login/loginModel';

const FormItem = Form.Item;

export interface IRegisterProps extends FormComponentProps {
  authenticationStore?: AuthenticationStore;
  sessionStore?: SessionStore;
  accountStore?: AccountStore;
  history: any;
  location: any;
}

export interface IRegisterState {
  needToCheckPWConfirm: boolean;
}

@inject(Stores.AuthenticationStore, Stores.SessionStore, Stores.AccountStore)
@observer
class Register extends React.Component<IRegisterProps, IRegisterState> {

  constructor(props) {
    super(props);

    this.state = {
      needToCheckPWConfirm: false
    };
  }

  handleSubmit = async (e: any) => {
    e.preventDefault();
    await this.props.form.validateFields(async (err: any, values: any) => {
      if (!err) {
        let canLogin = await this.props.accountStore!.register(values).catch(err => this.props.accountStore!.stopLoading());
        if (canLogin) {
          let loginModel = new LoginModel();
          loginModel.tenancyName = "Default";
          loginModel.userNameOrEmailAddress = values.userName;
          loginModel.password = values.password;
          loginModel.rememberMe = false;
          loginModel.showModal = false;
          await this.props.authenticationStore!.login(loginModel);
          message.success('Success!');
          window.location.href = process.env.NODE_ENV === 'production' ? '/coobot/profile/onboarding' : '/profile/onboarding';
        }
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ needToCheckPWConfirm: this.state.needToCheckPWConfirm || !!value });
  };
  
  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('The passwords you\'ve entered do not match!');
    } else {
      callback();
    }
  };

  compareToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.needToCheckPWConfirm) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  public render() {

    if (this.props.authenticationStore!.isAuthenticated) return <Redirect to="/profile" />;

    const { getFieldDecorator } = this.props.form;
    return (
      <Col className="name">
        <Form className="" onSubmit={this.handleSubmit} autoComplete="off">
          <Row>
            <Row style={{ marginTop: 10 }}>
              <Col span={8} offset={8}>
                <Card title={<div style={{ textAlign: 'center' }}>Create A COOBOT Account</div>}>
                 
                  <Row gutter={16}>
                    <Col span={12}>
                      <FormItem hasFeedback label="First Name">
                        {getFieldDecorator('name', { rules: rules.name })(
                          <Input size="large" autoComplete="new-name" />
                        )}
                      </FormItem>
                    </Col>

                    <Col span={12}>
                      <FormItem hasFeedback label="Last Name">
                        {getFieldDecorator('surname', { rules: rules.surname })(
                          <Input size="large" autoComplete="new-surname" />
                        )}
                      </FormItem>
                    </Col>
                  </Row>

                  <FormItem hasFeedback label="Username">
                    {getFieldDecorator('userName', { rules: rules.userName })(
                      <Input size="large" autoComplete="new-userName" />
                    )}
                  </FormItem>

                  <FormItem hasFeedback label="Email">
                    {getFieldDecorator('emailAddress', { rules: rules.emailAddress })(
                      <Input size="large" type="email" autoComplete="new-email" />
                    )}
                  </FormItem>

                  <FormItem hasFeedback
                    label={
                      <span>Password&nbsp;
                        <Tooltip title="Password must contain at least: one lowercase alphabetical character, one uppercase alphabetical character, one digit and one special character">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }>
                    {getFieldDecorator('password', {
                      rules: [...rules.password, {
                        validator: this.compareToNextPassword,
                      },]
                    })(
                      <Input.Password type="password" size="large" autoComplete="new-password" />
                    )}
                  </FormItem>

                  <Form.Item label="Confirm Password" hasFeedback>
                    {getFieldDecorator('confirm', {
                      rules: [
                        {
                          required: true,
                          message: 'Please confirm your password!',
                        },
                        {
                          validator: this.compareToFirstPassword,
                        },
                      ],
                    })(<Input.Password size="large" onBlur={this.handleConfirmBlur} autoComplete="new-password" />)}
                  </Form.Item>

                  <FormItem>
                    {getFieldDecorator('captchaResponse')(<Input hidden={true} value="" />)}
                  </FormItem>

                  <Row className="mt-md">
                    <Col>
                      <Button htmlType={'submit'} type="primary" size="large" block
                        {...this.props.accountStore!.isLoading ? { loading: true, disabled: true } : {}}>
                        Register Me!
                      </Button>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Row>
        </Form>
      </Col>
    );
  }
}

export default Form.create()(Register);
