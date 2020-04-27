import  React from 'react';
import { Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { confirmEmail } from './Actions/ConfirmEmailAction';

const ConfirmEmail = (props) => {
    const token = window.location.pathname.replace("/ConfirmEmail/","");
    const result = props.confirmEmail(token);
    if (result != null) {
        return (
            <div>
                <Redirect to="/Notifier" />
            </div>
        );
    }
}
//// REMOVE THIS
const mapStateToProps = (state) => {
    return ({
    })
};
const mapDispatchToProps = {
    confirmEmail,
}
export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(mapDispatchToProps, dispatch)
)(ConfirmEmail);