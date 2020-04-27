//#region *** *** Required Imports *** ***

import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//#endregion

/// Action to Show the navigation bar and footer components
import { getSilentAuthentication } from '../../Redux/Actions/AuthenticationAction';

/// Protected Route functional component is used
/// to decide the access to the routed component.
/// props values is received from the app.js component
/// Class Constructor. Set the local properties
const ProtectedRoute = props => {
    //silent Authentication check
    try {
        //props.getSilentAuthentication(props.Authentication.isAuthenticated, props.Authentication.user);
        props.getSilentAuthentication(props.Authentication.isAuthenticated, null);
    } catch (e) {
        props.getSilentAuthentication(props.Authentication.isAuthenticated);
    }

    // if the user is authenticated route them to the intended page
    if (props.Authentication.isAuthenticated) {
        return (<Route path={props.path} render={props.Render} />);
    }

    /// Otherwise redirect them to the login page
    return (<Redirect to="/Login" />);
}

/// Mapping the redux state with component's properties
const mapStateToProps = (state) => {
    return {
        Authentication: state.Authentication
    }
};
/// Map actions (which may include dispatch to redux store) to component
const mapDispatchToProps = {
    getSilentAuthentication
}
/// Redux Connection before exporting the component
export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(mapDispatchToProps, dispatch)
)(ProtectedRoute);