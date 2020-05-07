import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row } from 'reactstrap';
import Modal from 'reactstrap/lib/Modal';
import ModalBody from 'reactstrap/lib/ModalBody';
import { AlertTypes, oError, AccessClaims } from '../../../../_CoreFiles/CommonJs/AppConst.Shared';
import { PageHeader, Alert } from '../../../Components/Text-OSnack';
import { Button, ButtonPopupConfirm } from '../../../Components/Buttons-OSnack';
import { oRole } from '../../../../_CoreFiles/CommonJs/Models-OSnack';
import { Input, DropdownInput } from '../../../Components/Inputs-OSnack';
import { putRole, postRole, deleteRole } from '../../../../Redux/Actions/RoleManagementAction';

class AddModifyRoleModal extends PureComponent {
   constructor(props) {
      super(props);
      this.state = {
         alertList: [],
         alertType: AlertTypes.Error,
         role: new oRole(),
      };
      this.resetAlert = this.resetAlert.bind(this);
      this.checkApiCallResult = this.checkApiCallResult.bind(this);
   }
   async componentDidUpdate() {
      if (this.state.role.id !== this.props.role.id) {
         try {
            this.state.role = this.props.role;
            this.forceUpdate();
         } catch (e) { }
      }
      if (!this.props.isOpen) {
         this.state.alertList = [];
         this.state.role = new oRole();
      }
   }


   async deleteRole() {
      this.resetAlert();
      await this.props.deleteRole(this.state.role,
         this.checkApiCallResult,
         ["Role was deleted"]);

      try {
         await this.props.onActionCompleted();
      } catch (e) { }
   }
   async submitRole() {
      console.log();
      this.resetAlert();
      if (this.state.role.id > 0) {
         await this.props.putRole(this.state.role,
            this.checkApiCallResult,
            ["Role Updated"]
         );
      } else if (this.state.role.id === 0) {
         await this.props.postRole(this.state.role,
            this.checkApiCallResult,
            ["New role was created"]
         );
      }

      try {
         await this.props.onActionCompleted();
      } catch (e) { }
   }

   checkApiCallResult(result, successMessage) {
      if (result.errors.length > 0) {
         this.setState({ alertList: result.errors, alertType: AlertTypes.Error });
         return;
      }

      this.setState({
         role: result.role == null ? new oRole() : result.role,
         alertList: [new oError({ key: "s", value: successMessage })],
         alertType: AlertTypes.Success
      });
   }
   resetAlert() {
      this.state.alertList = [];
      this.state.alertType = AlertTypes.Error;
   }

   render() {
      if (!this.props.isOpen) {
         this.state.alertList = [];
         this.state.role = new oRole();
      }
      let isNewRole = true;
      if (this.state.role.id > 0)
         isNewRole = false;

      return (
         <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}
            className='modal-dialog modal-dialog-centered' >
            <ModalBody>
               <PageHeader title={isNewRole ? "New Role" : "Update Role"} />

               <Row>
                  <DropdownInput className="col-12" lblText="Access Claim"
                     selectedValue={this.state.role.accessClaim}
                     onChange={i => this.state.role.accessClaim = AccessClaims.List[i.target.value].name}
                     lblDisabled
                     list={AccessClaims.List}
                     onSelect={claim => this.state.role.accessClaim = claim.name}
                  />
                  <Input lblText="Role Name"
                     key={this.state.role.id}
                     bindedValue={this.state.role.name}
                     onChange={i => this.state.role.name = i.target.value}
                     className="col-12" />
               </Row>

               <Alert alertItemList={this.state.alertList}
                  type={this.state.alertType}
                  className="col-12"
                  onClosed={() => this.setState({ alertList: [] })}
               />
               {/***** buttons ****/}
               <Row className="col-12 p-0 m-0 mt-2">
                  <Button title="Cancel"
                     className={isNewRole ? "col-12 mt-2 btn-white col-sm-6" : "col-12 mt-2 btn-white col-sm-4"}
                     onClick={this.props.onCancel} />
                  {!isNewRole &&
                     <div className="col-12 col-sm-8 p-0 m-0">
                        <ButtonPopupConfirm title="Delete"
                           popupMessage="Are you sure?"
                           className="col-12 col-sm-6 mt-2"
                           btnClassName="btn-red"
                           onConfirmClick={this.deleteRole.bind(this)}
                        />
                        <ButtonPopupConfirm title="Update"
                           popupMessage="Are you sure?"
                           className="col-12 mt-2 col-sm-6"
                           btnClassName="btn-green"
                           onConfirmClick={this.submitRole.bind(this)}
                        />
                     </div>
                  }
                  {isNewRole &&
                     <Button title="Create"
                        className="col-12 mt-2 btn-green col-sm-6"
                        onClick={this.submitRole.bind(this)} />
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
/// Map actions (which may include dispatch to redux role) to component
const mapDispatchToProps = {
   putRole,
   postRole,
   deleteRole,
};
/// Redux Connection before exporting the component
export default connect(
   mapStateToProps,
   dispatch => bindActionCreators(mapDispatchToProps, dispatch)
)(AddModifyRoleModal);
