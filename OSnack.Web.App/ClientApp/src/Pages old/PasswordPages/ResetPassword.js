import * as React from 'react';
import { Container } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// Redux actions for login modal 
import { resetPassword, passwordResetTokenValid } from './Actions/PasswordPagesAction';
import { notifySuccess, notifyFailed } from '../../components/Layout/Actions/NotifierAction';
import Loading from '../../components/Layout/Loading';

// New customer component 
class PasswordReset extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            passReset: {
                password: "",
                confirmPassword: "",
                token: window.location.pathname.replace("/ResetPassword/", ""),
            },
            response: {
                message: "",
                accepted: false,
                tokenIsValid: null,
                tokenFailedMessage: ""
            }
        };
        this.resetPassword = this.resetPassword.bind(this)
    }
    componentDidMount() {
        this.props.passwordResetTokenValid(this.state.passReset.token)
            .then(i => this.setState(prev => ({
                response: {
                    ...prev.response,
                    tokenIsValid: i.isValid,
                    tokenFailedMessage: i.message
                }
            })));
    }
    resetPassword() {
        this.props.resetPassword(this.state.passReset).then(data => {
            if (data.accepted) {
                this.setState(prev => ({ response: { ...prev.response, accepted: true, message: "" } }));
                this.props.notifySuccess({
                    message: data.message,
                    links: [{
                        linkTo: "/MyAccount",
                        displayName: "My Account"
                    },
                    {
                        linkTo: "/Shop",
                        displayName: "Shop"
                    }]
                })
                return;
            }
            this.setState(prev => ({ response: {...prev.response, accepted: false, message: data.message }}))
        });
    }
    render() {
        if (this.state.response.accepted)
            return <Redirect to="/Notifier" />

        if (this.state.response.tokenIsValid == null) {
            return <Loading/>
        }

        if (!this.state.response.tokenIsValid) {
            this.props.notifyFailed({
                message: this.state.response.tokenFailedMessage,
                links: [{
                    linkTo: "/ForgotPassword",
                    displayName: "Request new password reset."
                }]
            });
            return <Redirect to="/Notifier" />
        }
        return (
            <Container className="custom-fluid-container row">
                <h1 className="col-12">Reset Password</h1>
                <Row className={" col-12"}>
                    <label className="col-form-label">Password *</label>
                    <input type="password" className="form-control" defaultValue={this.state.passReset.password}
                        onChange={i => this.setState(prev => ({ passReset: {...prev.passReset, password: i.target.value }}))} />
                </Row>
                <Row className={" col-12"}>
                    <label className="col-form-label">Confirm Password * </label>
                    <input type="password" className="form-control" defaultValue={this.state.passReset.confirmPassword}
                        onChange={i => this.setState(prev => ({ passReset: { ...prev.passReset, confirmPassword: i.target.value } }))} />
                </Row>
                <Row className={"col-12"}>
                    <label className="col-form-label text-danger">{this.state.response.message}</label>
                </Row>
                <Row className={"col-12"}>
                    <button type="submit" className="btn btn-lg btn-green col m-1"
                        onClick={this.resetPassword}>
                        Submit
                    </button>
                </Row>
            </Container>
        );
    }
}
const mapDispatchToProps = {
    resetPassword,
    passwordResetTokenValid,
    notifySuccess,
    notifyFailed
}
export default connect(
    null,
    dispatch => bindActionCreators(mapDispatchToProps, dispatch)
)(PasswordReset);