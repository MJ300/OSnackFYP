import * as React from 'react';
import { Container } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// Redux actions for login modal 
import { newCustomer } from './Actions/NewCustomerAction';
import { login } from '../../components/Authentication/Actions/AuthenticationAction';

// New customer component 
class NewCustomer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            customer: {
                name: "",
                surname: "",
                phoneNumber: "",
                email: "",
                password: "As1`",
                confirmPassword: "As1`",
                termsAndCondition: false
            },
            created: false,
            errors: []
        };
        this.SubmitNewUser = this.SubmitNewUser.bind(this)
    }
    SubmitNewUser() {
        this.props.newCustomer(this.state.customer).bind(data => {
            this.setState({ created: data.created, errors: data.errors })
            if (data.created) {
                const loginDetails = {
                    email: this.state.customer.email,
                    password: this.state.customer.password,
                    rememberMe: false
                }
                this.props.login(loginDetails);
            }
        });
    }
    render() {
        if (this.props.auth.userRole == "Customer"
            && this.props.auth.isAuthenticated) {
            return (
                <Redirect to={"/"} />
            );
        };
        return (
            <Container className="custom-fluid-container row">
                <h1 className="col-12">Registration</h1>
                <div className={"col-md-6 col-12"}>
                    <label className="col-form-label">Name *</label>
                    <input type="text" className="form-control"
                        onChange={i => this.setState(prev => ({ customer: { ...prev.customer, name: i.target.value }}))} />
                </div>

                <div className={"col-md-6 col-12"}>
                    <label className="col-form-label">Surname * </label>
                    <input type="text" className="form-control"
                        onChange={i => this.setState(prev => ({ customer: { ...prev.customer, surname: i.target.value } }))} />
                </div>

                <div className={"col-12"}>
                    <label className="col-form-label">Phone Number </label>
                    <input type="text" className="form-control"
                        onChange={i => this.setState(prev => ({ customer: { ...prev.customer, phoneNumber: i.target.value } }))} />
                </div>

                <div className={"col-12"}>
                    <label className="col-form-label">Email *</label>
                    <input type="text" className="form-control"
                        onChange={i => this.setState(prev => ({ customer: { ...prev.customer, email: i.target.value } }))} />
                </div>
                <div className={" col-12"}>
                    <label className="col-form-label">Password *</label>
                    <input type="password" className="form-control" defaultValue={this.state.customer.password}
                        onChange={i => this.setState(prev => ({ customer: { ...prev.customer, password: i.target.value } }))} />
                </div>
                <div className={" col-12"}>
                    <label className="col-form-label">Confirm Password * </label>
                    <input type="password" className="form-control" defaultValue={this.state.customer.confirmPassword}
                        onChange={i => this.setState(prev => ({ customer: { ...prev.customer, confirmPassword: i.target.value } }))} />
                </div>
                <div className={"col-12 mt-2 mb-1"}>
                    <input className="custom-checkbox" type="checkbox"
                        onChange={i => this.setState((prev) => ({ customer: { ...prev.customer, termsAndCondition: !prev.customer.termsAndCondition } }))} />
                    <span>
                        Agree to our <Link to="/TermsAndConditions">Terms and Conditions</Link>
                    </span>
                </div>
                <div className={"col-12"}>
                    {this.state.errors.map(err =>
                        <div key={err.id} className={"text-danger"}>* {err.message}</div>
                    )}
                </div>
                <div className={"col-12"}>
                    <button type="submit" className="btn btn-lg btn-green col m-1"
                        onClick={this.SubmitNewUser}>
                        Create
                    </button>
                </div>
            </Container>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        auth: state.auth
    }
};
const mapDispatchToProps = {
    newCustomer,
    login

}
export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(mapDispatchToProps, dispatch)
)(NewCustomer);