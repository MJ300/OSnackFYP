import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row } from 'reactstrap';
import Modal from 'reactstrap/lib/Modal';
import ModalBody from 'reactstrap/lib/ModalBody';
import { AlertTypes, oError, ProductUnitType, API_URL } from '../../../../_CoreFiles/CommonJs/AppConst.Shared';
import { PageHeader, Alert } from '../../../Components/Text-OSnack';
import { Button, ButtonPopupConfirm } from '../../../Components/Buttons-OSnack';
import { oUser } from '../../../../_CoreFiles/CommonJs/Models-OSnack';
import { Input, DropdownInput, ImageUpload } from '../../../Components/Inputs-OSnack';
import { putUser, postUser, deleteUser } from '../../../../Redux/Actions/UserManagementAction';

class AddModifyUserModal extends PureComponent {
   constructor(props) {
      super(props);
      this.state = {
         alertList: [],
         alertType: AlertTypes.Error,
         user: new oUser(),
         isPasswordDisabled: true,
      };

      this.checkApiCallResult = this.checkApiCallResult.bind(this);
      this.deleteUser = this.deleteUser.bind(this);
      this.submitUser = this.submitUser.bind(this);
   }

   async componentDidUpdate() {
      if (this.state.user.id !== this.props.user.id) {
         try {
            this.state.user = this.props.user;
            this.forceUpdate();
         } catch (e) { }
      }
      if (!this.props.isOpen) {
         this.state.alertList = [];
         this.state.user = new oUser();
      }
   }

   async deleteUser() {
      await this.props.deleteUser(this.state.user,
         this.checkApiCallResult,
         ["User was deleted"]);
      this.state.user.id = 0;
   }
   async submitUser() {
      /// If the user object has ID more than 0
      /// then try to update the user
      if (this.state.user.id > 0) {
         await this.props.putUser(this.state.user,
            await this.checkApiCallResult,
            ["User Updated"]
         );
      }
      /// Else the user object is a new object
      /// then try to create a new record
      else if (this.state.user.id === 0) {
         await this.props.postUser(this.state.user,
            await this.checkApiCallResult,
            ["New user was created"]
         );
      }
   }

   async checkApiCallResult(result, successMessage) {
      this.state.alertList = [];
      this.state.alertType = AlertTypes.Error;

      if (result.errors.length > 0) {
         this.setState({ alertList: result.errors, alertType: AlertTypes.Error });
         return;
      }

      this.setState({
         user: result.user == null ? new oUser() : result.user,
         alertList: [new oError({ key: "s", value: successMessage })],
         alertType: AlertTypes.Success
      });
      /// Invoke the on action completed method of the parent
      /// element if there is any provided otherwise catch the error
      try {
         await this.props.onActionCompleted();
      } catch (e) { }
   }
   render() {
      let { alertList, alertType, user, confirmPassword } = this.state;
      const { isOpen, toggle, roleList } = this.props;

      let isNewUser = true;
      if (user.id > 0)
         isNewUser = false;

      return (
         <Modal isOpen={isOpen} toggle={toggle}
            className='modal-dialog modal-dialog-centered' >
            <ModalBody>
               <PageHeader title={isNewUser ? "New User" : "Update User"} />

               {/***** Name & Surname ****/}
               <Row>
                  <Input lblText="Name" type="text"
                     bindedValue={user.firstName}
                     onChange={i => user.firstName = i.target.value}
                     className="col-6" />
                  <Input lblText="Surname" type="text"
                     bindedValue={user.surname}
                     onChange={i => user.surname = i.target.value}
                     className="col-6" />
               </Row>
               {/***** phone Number and role ****/}
               <Row>
                  <Input lblText="Phone" type="text"
                     bindedValue={user.phoneNumber}
                     onChange={i => user.phoneNumber = i.target.value}
                     className="col-6 " />
                  <DropdownInput className="col-6" lblText="Role"
                     selectedValue={user.role.id}
                     onChange={i => user.role.id = i.target.value}
                     list={roleList}
                     onSelect={i => user.role = i}
                  />
               </Row>
               {/***** Email ****/}
               <Row>
                  <Input lblText="Email" type="email"
                     bindedValue={user.email}
                     onChange={i => user.email = i.target.value}
                     className="col-12 " />
               </Row>
               {/***** Password and confirm password ****/}
               <Row className="col-12 p-0 m-0 mt-2">
                  <label className="col-12 p-0"
                     children="Password will be generated or set new password implicitly." />
                  <Input lblText="Password" type="password"
                     bindedValue={user.password}
                     onChange={i => user.password = i.target.value}
                     className="col-6 m-0 p-0 pr-2"
                     lblDisabled
                     disabled={this.state.isPasswordDisabled}
                  />

                  <Button title="Set Password"
                     className="col-6 pr-2 btn-blue "
                     onClick={() => this.setState({ isPasswordDisabled: !this.state.isPasswordDisabled })} />
               </Row>


               <Alert alertItemList={alertList}
                  type={alertType}
                  className="col-12"
                  onClosed={() => this.setState({ alertList: [] })}
               />

               {/***** buttons ****/}
               <Row className="col-12 p-0 m-0 mt-2">
                  <Button title="Cancel"
                     className={isNewUser ? "col-12 mt-2 btn-white col-sm-6" : "col-12 mt-2 btn-white col-sm-4"}
                     onClick={this.props.onCancel} />
                  {!isNewUser &&
                     <div className="col-12 col-sm-8 p-0 m-0">
                        <ButtonPopupConfirm title="Delete"
                           popupMessage="Are you sure?"
                           className="col-12 col-sm-6 mt-2"
                           btnClassName="btn-red"
                           onConfirmClick={this.deleteUser}
                        />
                        <ButtonPopupConfirm title="Update"
                           popupMessage="Are you sure?"
                           className="col-12 mt-2 col-sm-6"
                           btnClassName="btn-green"
                           onConfirmClick={this.submitUser}
                        />
                     </div>
                  }
                  {isNewUser &&
                     <Button title="Create"
                        className="col-12 mt-2 btn-green col-sm-6"
                        onClick={this.submitUser} />
                  }
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
/// Map actions (which may include dispatch to redux user) to component
const mapDispatchToProps = {
   putUser,
   postUser,
   deleteUser,
};
/// Redux Connection before exporting the component
export default connect(
   mapStateToProps,
   dispatch => bindActionCreators(mapDispatchToProps, dispatch)
)(AddModifyUserModal);
