import './index.less';

import * as React from 'react';

import { Button, Card, Checkbox, Col, Form, Icon, Input, Row } from 'antd';
import { inject, observer } from 'mobx-react';

import AccountStore from '../../stores/accountStore';
import AuthenticationStore from '../../stores/authenticationStore';
import { FormComponentProps } from 'antd/lib/form';
import { L } from '../../lib/abpUtility';
import { Redirect, Link } from 'react-router-dom';
import SessionStore from '../../stores/sessionStore';
import Stores from '../../stores/storeIdentifier';
import rules from './index.validation';
import bg from '../../images/handshakelight.jpg';

const FormItem = Form.Item;

export interface ILoginProps extends FormComponentProps {
  authenticationStore?: AuthenticationStore;
  sessionStore?: SessionStore;
  accountStore?: AccountStore;
  history: any;
  location: any;
}

@inject(Stores.AuthenticationStore, Stores.SessionStore, Stores.AccountStore)
@observer
class Login extends React.Component<ILoginProps> {

  handleSubmit = async (e: any) => {
    e.preventDefault();
    const { loginModel } = this.props.authenticationStore!;
    await this.props.form.validateFields(async (err: any, values: any) => {
      if (!err) {
        await this.props.authenticationStore!.login(values);
        sessionStorage.setItem('rememberMe', loginModel.rememberMe ? '1' : '0');
        const { state } = this.props.location;
        window.location = state ? state.from.pathname : process.env.NODE_ENV === 'production' ? '/coobot/profile' : '/profile';
      }
    });
  };

  public render() {
    let { from } = this.props.location.state || { from: { pathname: '/profile' } };
    if (this.props.authenticationStore!.isAuthenticated) return <Redirect to={from} />;

    const { loginModel } = this.props.authenticationStore!;
    const { getFieldDecorator } = this.props.form;
    return (
      <Col>
        <Form className="" onSubmit={this.handleSubmit}>
          <Row style={{ marginTop: 10 }}>
            <Col span={8} offset={8}>
              <div style={{
                backgroundImage: `url(${bg})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPositionX: 'center',
                width: '100%',
                height: '240px'
              }}>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={8} offset={8}>
              <Card>
                <div style={{ textAlign: 'center', marginTop: '16px', marginBottom: '16px' }}>
                  <h3>Login to COOBOT</h3>
                </div>
                <FormItem>
                  {getFieldDecorator('userNameOrEmailAddress', { rules: rules.userNameOrEmailAddress })(
                    <Input placeholder={L('UserNameOrEmail')} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} size="large" />
                  )}
                </FormItem>

                <FormItem>
                  {getFieldDecorator('password', { rules: rules.password })(
                    <Input
                      placeholder={L('Password')}
                      prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      type="password"
                      size="large"
                    />
                  )}
                </FormItem>
                <Row>
                  <Col>
                    <Checkbox checked={loginModel.rememberMe} onChange={loginModel.toggleRememberMe} style={{ paddingRight: 8 }} />
                    Remember Me
                  </Col>

                  <Col>
                    <Button className="mt-md" htmlType={'submit'} type="primary" block>
                      Log In
                      </Button>
                  </Col>

                  <Col className="mt-md">
                    <p>Don't have an account?</p>
                    <Link to="/user/register" className="ant-btn ant-btn-block ant-btn-primary">
                      Register
                    </Link>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Form>
      </Col>
    );
  }
}

export default Form.create()(Login);
