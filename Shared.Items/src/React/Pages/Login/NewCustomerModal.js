import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Modal, ModalBody } from 'reactstrap';
import { PageHeader } from '../../Components/Text-OSnack';
import { Input, CheckBox } from '../../Components/Inputs-OSnack';
import { Button } from '../../Components/Buttons-OSnack';
import { oUser } from '../../../_CoreFiles/CommonJs/Models-OSnack';

class NewCustomer extends PureComponent {
   constructor(props) {
      super(props);
      this.state = {
         user: new oUser(),
         termsAndCondition: false,
         confirmPassword: ""
      };
      this.createNewCustomer = this.createNewCustomer.bind(this);
   }
   async createNewCustomer() {

   }
   render() {
      return (
         <Modal isOpen={this.props.isOpen}
            className='modal-dialog modal-dialog-centered'>
            <ModalBody>
               <PageHeader title="New Customer" />
               <Row>

                  <Input lblText="Name *" type="text" className="col-6"
                     onChange={i => this.state.user.firstName = i.target.value}
                  />

                  <Input lblText="Surname *" type="text" className="col-6"
                     onChange={i => this.state.user.surname = i.target.value}
                  />

                  <Input lblText="Phone Number" type="text" className="col-12"
                     onChange={i => this.state.user.phoneNumber = i.target.value}
                  />


                  <Input lblText="Email *" type="email" className="col-12"
                     bindedValue={this.props.email}
                     onChange={i => this.state.user.email = i.target.value}
                  />

                  <Input lblText="Password *" type="password" className="col-6"
                     onChange={i => this.state.user.password = i.target.value}
                  />

                  <Input lblText="Confirm Password *" type="password" className="col-6"
                     onChange={i => this.state.confirmPassword = i.target.value}
                  />
                  <div className="col-12 mt-2">

                     <CheckBox className="mt-2 mb-2" onClick={() => this.state.user.subscribeNewsLetter = !this.state.user.subscribeNewsLetter}
                        lblText="Subscribe to our newsletter." />

                     <CheckBox className="mt-2 mb-2" onClick={() => this.state.user.termsAndCondition = !this.state.user.termsAndCondition}
                        lblText={<div>Agree to <a href="/termsandconditions" target="_blank">terms and conditions</a>.</div>} />

                     <Button title="Submit" className="col-6 mt-2 btn-green" onClick={this.forgotPassword} />
                     <Button title="Cancel" className="col-6 mt-2 btn-red"
                        onClick={this.props.onCancel} />
                  </div>
               </Row>
            </ModalBody>
         </Modal>
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
)(NewCustomer);
