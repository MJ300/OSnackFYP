import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Modal, ModalBody } from 'reactstrap';
import { PageHeader, Alert } from '../../Components/Text-OSnack';
import { Input } from '../../Components/Inputs-OSnack';
import { Button } from '../../Components/Buttons-OSnack';
import { AlertTypes } from '../../../_CoreFiles/CommonJs/AppConst.Shared';

class UpdatePasswordModal extends PureComponent {
   constructor(props) {
      super(props);
      this.state = {
         user: props.user,
         confirmPassword: "",
         alertList: [{ key: '2', value: 'test' }],
         alertType: AlertTypes.Success,
      };
      this.updatePassword = this.updatePassword.bind(this);
   }
   async updatePassword() {

   }
   render() {
      return (
         <Modal isOpen={this.props.isOpen}
            className='modal-dialog modal-dialog-centered'>
            <ModalBody>
               <PageHeader title="Update Password" />
               <Input lblText="Password *" type="password" className="col-12"
                  onChange={i => this.state.user.password = i.target.value}
               />

               <Input lblText="Confirm Password *" type="password" className="col-12"
                  onChange={i => this.state.confirmPassword = i.target.value}
               />

               <div className="col-12 mt-2">
                  <Alert alertItemList={this.state.alertList}
                     type={this.state.alertType}
                     className="col-12"
                     onClosed={() => this.setState({ alertList: [] })}
                  />

                  <Button title="Cancel"
                     className="col-6 mt-2 btn-red"
                     onClick={this.props.onCancel} />
                  <Button title="Update"
                     className="col-6 mt-2 btn-green"
                     onClick={this.updatePassword} />
               </div>
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
)(UpdatePasswordModal);
