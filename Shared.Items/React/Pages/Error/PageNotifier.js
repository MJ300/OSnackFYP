import  React from 'react';
import { Container } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loading from './Loading';
import { silentAuthentication } from '../Authentication/Actions/AuthenticationAction';
import { Link } from 'react-router-dom';

class Notifier extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        if (!this.props.auth.isAuthenticated)
            this.props.silentAuthentication();
    }
    render() {
        if (this.props.notifier.bgColor == "") {
            return (
                <div className={"error-page "}>
                    <Loading />
                    <br />
                    <Link className="h4 text-bold boarder-bottom" to="/">Click here to go to home page.</Link>
                </div>
            )
        }
        return (
            <Container>
                <div className={"error-page " + this.props.notifier.bgColor}>
                    <h2 className="mb-3">{this.props.notifier.message}</h2>
                    {this.props.notifier.links.map(link => {
                        return (
                            <div className="pb-2">
                                <Link className="h4 text-bold col-12 boarder-bottom" to={link.linkTo}>{link.displayName}</Link>
                            </div>
                        )
                    })}
                    <div className="pb-2">
                        <Link className="h4 text-bold col-12 boarder-bottom" to="/">Go to home page.</Link>
                    </div>
                </div>
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    return ({
        notifier: state.notifier,
        auth: state.auth,
    })
}
const mapDispatchToProps = {
    silentAuthentication
}
export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(mapDispatchToProps, dispatch)
)(Notifier);