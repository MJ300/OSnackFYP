import * as React from 'react';
import { Container } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// Redux actions for login modal 
import { requestPasswordReset } from './Actions/PasswordPagesAction';
import { notifySuccess } from '../../components/Layout/Actions/NotifierAction';


// New customer component 
class ForgotPassword extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            response: {
                accepted: false,
                message: "",
            }
        };
        this.passwordReset = this.passwordReset.bind(this)
    }
    passwordReset() {
        this.props.requestPasswordReset(this.state.email).then(data => {
            if (data.accepted) {
                this.setState({ response: { accepted: true, message: "" } })
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
            this.setState({ response: { accepted: false, message: data.message } })
        });
    }
    render() {
        if (this.state.response.accepted)
            return <Redirect to="/Notifier" />

        return (
            <Container className="custom-fluid-container row">
                <h1 className="col-12">Forgot Password?</h1>
                <Row className={"col-12"}>
                    <label className="col-form-label">Email *
                         <label className="col-form-label text-danger">{this.state.response.message}</label>
                    </label>
                    <input type="text" className="form-control"
                        onChange={i => this.setState({ email: i.target.value })} />
                </Row>
                <Row className={"col-12 mt-2"}>
                    <button type="submit" className="btn btn-lg btn-green col m-1"
                        onClick={this.passwordReset}>
                        Submit
                    </button>
                </Row>
            </Container>
        );
    }
}
const mapDispatchToProps = {
    requestPasswordReset,
    notifySuccess
}
export default connect(
    null,
    dispatch => bindActionCreators(mapDispatchToProps, dispatch)
)(ForgotPassword);