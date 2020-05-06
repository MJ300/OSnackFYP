import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Container, Row } from 'reactstrap';
import { PageHeader, Alert } from '../../Components/Text-OSnack';
import { Input, CheckBox } from '../../Components/Inputs-OSnack';
import { Button } from '../../Components/Buttons-OSnack';
import ForgotPasswordModal from './ForgotPasswordModal';
import NewCustomerModal from './NewCustomerModal';

import { postLogin } from '../../../Redux/Actions/AuthenticationAction';
import { Redirect } from 'react-router-dom';
import { AlertTypes } from '../../../_CoreFiles/CommonJs/AppConst.Shared';

class Login extends PureComponent {
   constructor(props) {
      super(props);
      this.state = {
         email: "test",
         password: "As!2",
         rememberMe: false,
         alertList: [{ key: '2', value: 'test' }],
         alertType: AlertTypes.Error,
         forgotPasswordModalIsOpen: false,
         newCustomerModalIsOpen: false,
      };
      this.login = this.login.bind(this);
   }
   async componentDidMount() {

   }
   async login() {
      const result = await this.props.postLogin({
         email: this.state.email,
         password: this.state.password,
         rememberMe: this.state.rememberMe,
      });

      if (result.payload.isAuthenticated) {
         this.setState({ alertType: "Error", alertList: result.errors });
         return;
      }
   }
   async forgotPassword() {
   }
   render() {
      if (this.props.Authentication.isAuthenticated)
         return (<Redirect to="/" />);

      return (
         <Container className="custom-container">
            <Row className="justify-content-md-center">
               <div className="col-md-7 col-lg-5 bg-white p-5">
                  <PageHeader title="Login" />

                  <Input lblText="Email" type="email"
                     bindedValue={this.state.email}
                     onChange={i => this.setState({ email: i.target.value })}
                  />

                  <Input lblText="Password" type="password"
                     bindedValue={this.state.password}
                     onChange={i => this.setState({ password: i.target.value })}
                  />

                  <div className="mt-3 mb-3">
                     <a onClick={() => this.setState({ forgotPasswordModalIsOpen: true })} className="col-6 float-right text-right"
                        children="Forgot Password?"
                     />

                     <CheckBox lblText="Remember Me" className="col-6"
                        onClick={i => this.state.rememberMe = !this.state.rememberMe}
                     />
                  </div>

                  <Alert alertItemList={this.state.alertList}
                     type={this.state.alertType}
                     className="col-12"
                     onClosed={() => this.setState({ alertList: [] })}
                  />

                  <Button title="Login" className="col-12 mt-2 btn-green" onClick={this.login} />
                  <Button title="New Customer" className="col-12 mt-2 btn-white" onClick={() => this.setState({ newCustomerModalIsOpen: !this.state.newCustomerModalIsOpen })} />
               </div>
            </Row>
            <ForgotPasswordModal isOpen={this.state.forgotPasswordModalIsOpen}
               onCancel={() => this.setState({ forgotPasswordModalIsOpen: false })}
               email={this.state.email}
            />
            <NewCustomerModal isOpen={this.state.newCustomerModalIsOpen}
               onCancel={() => this.setState({ newCustomerModalIsOpen: false })}
               email={this.state.email}
            />
         </Container>
      );
   }
}
/// Mapping the redux state with component's properties
const mapStateToProps = (state) => {
   return {
      Authentication: state.Authentication
   };
};
/// Map actions (which may include dispatch to redux store) to component
const mapDispatchToProps = {
   postLogin,
};
/// Redux Connection before exporting the component
export default connect(
   mapStateToProps,
   dispatch => bindActionCreators(mapDispatchToProps, dispatch)
)(Login);
