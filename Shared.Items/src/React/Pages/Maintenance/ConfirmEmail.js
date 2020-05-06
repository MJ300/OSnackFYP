import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container } from 'reactstrap';
import { PageHeader } from '../../Components/Text-OSnack';

class ConfirmEmail extends PureComponent {
   constructor(props) {
      super(props);
      this.state = {
         token: window.location.pathname.replace("/ConfirmEmail/", ""),
      };
   }
   async componentDidMount() {

   }
   render() {
      return (
         <Container>
            <PageHeader title="ConfirmEmail" />
         </Container>
      );
   }
}
/// Mapping the redux state with component's properties
const mapStateToProps = (state) => {
   return {
   };
};
/// Map actions (which may include dispatch to redux store) to component
const mapDispatchToProps = {
};
/// Redux Connection before exporting the component
export default connect(
   mapStateToProps,
   dispatch => bindActionCreators(mapDispatchToProps, dispatch)
)(ConfirmEmail);
