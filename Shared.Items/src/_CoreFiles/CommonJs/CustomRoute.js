import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

/// Action to Show the navigation bar and footer components
import { getSilentAuthentication } from '../../Redux/Actions/AuthenticationAction';


/// Protected Route functional component is used
/// to decide the access to the routed component.
/// props values is received from the app.js component
const CustomRoute = props => {
    //silent Authentication check
    //props.silentAuthentication(props.Authentication.isAuthenticated);
    props.getSilentAuthentication(props.Authentication.isAuthenticated);
    return (<Route path={props.path} render={props.Render} />);
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
)(CustomRoute); 