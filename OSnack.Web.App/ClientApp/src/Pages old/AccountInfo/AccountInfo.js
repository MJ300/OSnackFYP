import * as React from 'react';
import { Container } from 'reactstrap';
import { Modal, ModalBody } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// Redux actions for login modal 
import { getUserInfo, editAccountInfo, editAccountPassword }
    from './Actions/AccountInfoAction';

// New customer component 
class AccountInfo extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            surname: "",
            phoneNumber: "",
            email: "",
            password: "",
            newPassword: "",
            newConfirmPassword: "",
            edited: false,
            returnStatus: {
                message: "",
                bgColor: "",
                errors: [],
            },
            returnStatusPassword: {
                message: "",
                bgColor: "",
                error: "",
            },
            changePasswordIsOpen: false,

        };
        this.editAccountInfo = this.editAccountInfo.bind(this);
        this.editPassword = this.editPassword.bind(this);
    }
    componentDidMount() {
        /// get the current user information from server
        this.props.getUserInfo().bind(data => {
            this.setState({
                name: data.name,
                surname: data.surname,
                phoneNumber: data.phoneNumber,
                email: data.email
            })
        });
    }

    editAccountInfo() {
        this.props.editAccountInfo(this.state).then(data => {
            var notificationCssClass = "";
            switch (data.returnStatus) {
                case "Updated":
                    notificationCssClass = "text-success";
                    break;
                case "Failed":
                    notificationCssClass = "text-danger";
                    break;
            }
            this.setState({
                returnStatus: {
                    message: data.returnStatus,
                    bgColor: notificationCssClass,
                    errors: data.errors,
                },
            })
        });
    }
    editPassword() {
        this.props.editAccountPassword({
            password: this.state.password,
            newPassword: this.state.newPassword,
            newConfirmPassword: this.state.newConfirmPassword,
        }).then(data => {
            var notificationCssClass = "";
            switch (data.returnStatus) {
                case "Password Updated":
                    notificationCssClass = "text-success";
                    break;
                case "Failed":
                    notificationCssClass = "text-danger";
                    break;
            }
            this.setState({
                returnStatusPassword: {
                    message: data.returnStatus,
                    bgColor: notificationCssClass,
                    error: data.message,
                },
            })
        });
    }
    render() {
        return (
            <Container className="custom-fluid-container row">
                <h1 className="col-12">Account Info </h1>
                {/* Name */}
                <div className={"col-md-6 col-12"}>
                    <label className="col-form-label">Name</label>
                    <input type="text" className="form-control" defaultValue={this.state.name}
                        onChange={i => this.setState({ name: i.target.value.trim() })} />
                </div>
                {/* Surname */}
                <div className={"col-md-6 col-12"}>
                    <label className="col-form-label">Surname</label>
                    <input type="text" className="form-control" defaultValue={this.state.surname}
                        onChange={i => this.setState({ surname: i.target.value.trim() })} />
                </div>
                {/* Phone Number */}
                <div className={"col-12"}>
                    <label className="col-form-label">Phone Number </label>
                    <input type="text" className="form-control" defaultValue={this.state.phoneNumber}
                        onChange={i => this.setState({ phoneNumber: i.target.value.trim() })} />
                </div>
                {/* Email */}
                <div className={"col-12"}>
                    <label className="col-form-label">Email</label>
                    <input type="text" className="form-control" defaultValue={this.state.email}
                        onChange={i => this.setState({ email: i.target.value.trim() })} />
                </div>
                {/* Display status e.g Failed / Updated*/}
                <div className={"col-6 mt-2"}>
                    <h5 className={"form-control boarder-none " + this.state.returnStatus.bgColor}>
                        {this.state.returnStatus.message}
                    </h5>
                </div>
                {/* Change Password button and modal */}
                <div className={"col-6 mt-2"}>
                    <a className="boarder-bottom form-control"
                        onClick={() => this.setState({ changePasswordIsOpen: true })}>
                        Change Password
                    </a>
                    {/* Change password Modal */}
                    <Modal isOpen={this.state.changePasswordIsOpen} className={'modal-custom'}>
                        {/* Header and close button */}
                        <div className={'bg-header'}>
                            <h2 className={'p-3'}>Change Password
                                    <a className="btn btn-lg btn-green float-right pl-2 pr-2 pt-0 pb-0"
                                    onClick={() => this.setState({ changePasswordIsOpen: false })}>
                                    <h1> X </h1>
                                </a>
                            </h2>
                        </div>
                        <ModalBody>
                            {/* Current Password */}
                            <label className="col-form-label">Current Password</label>
                            <input type="password" className="form-control"
                                onChange={i => this.setState({ password: i.target.value })} />
                            {/* New Password */}
                            <label className="col-form-label">New Password</label>
                            <input type="password" className="form-control"
                                onChange={i => this.setState({ newPassword: i.target.value })} />
                            {/* Confirm New Password */}
                            <label className="col-form-label">Confirm New Password</label>
                            <input type="password" className="form-control"
                                onChange={i => this.setState({ newConfirmPassword: i.target.value })} />
                            {/* Display status e.g Failed / Updated*/}
                            <h5 className={"mt-2 " + this.state.returnStatusPassword.bgColor}>
                                {this.state.returnStatusPassword.message}
                            </h5>
                            {/* Error messages*/}
                            <div className={"text-danger"}>{this.state.returnStatusPassword.error}</div>
                            {/* Password change submit button*/}
                            <button className="btn btn-lg btn-green col-12 mt-2" onClick={this.editPassword}>Submit</button>
                        </ModalBody>
                    </Modal>
                </div>
                {/* Display Errors */}
                <div className={"col-12"}>
                    {this.state.returnStatus.errors.map(err =>
                        <div key={err.id} className={"text-danger"}>* {err.message}</div>
                    )}
                </div>
                {/* Edit Button */}
                <div className={"col-12 mt-2"}>
                    <button type="submit" className="btn btn-lg btn-green col"
                        onClick={this.editAccountInfo}>
                        Edit
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
    getUserInfo,
    editAccountInfo,
    editAccountPassword
}
export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(mapDispatchToProps, dispatch)
)(AccountInfo);