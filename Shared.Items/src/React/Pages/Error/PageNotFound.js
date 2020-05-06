import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row } from 'reactstrap';
import { PageHeader } from '../../Components/Text-OSnack';
import { API_URL } from '../../../_CoreFiles/CommonJs/AppConst.Shared';

class PageNotFound extends PureComponent {
   constructor(props) {
      super(props);
      this.state = {
         State1: null,
      };
   }
   async componentDidMount() {

   }
   render() {
      return (
         <Container className="custom-container">
            <PageHeader title="(404)" />
            <Row>
               <img className="col-md-6 col-12 ml-auto mr-auto"
                  src={API_URL + "/Images/IdkFace(Mango).png"}
                  alt='Page Not Found' />
            </Row>
            <Row>
               <h4 children="Page Not Found" className="col-md-6 col-12 ml-auto mr-auto text-center" />
            </Row>
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
)(PageNotFound);
