import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row } from 'reactstrap';
import Modal from 'reactstrap/lib/Modal';
import ModalBody from 'reactstrap/lib/ModalBody';
import { AlertTypes, oError } from '../../../../_CoreFiles/CommonJs/AppConst.Shared';
import { PageHeader, Alert } from '../../../Components/Text-OSnack';
import { Button, ButtonPopupConfirm } from '../../../Components/Buttons-OSnack';
import { oStore } from '../../../../_CoreFiles/CommonJs/Models-OSnack';
import { Input } from '../../../Components/Inputs-OSnack';
import { putStore, postStore, deleteStore } from '../../../../Redux/Actions/StoreManagementAction';

class AddModifyStoreModal extends PureComponent {
   constructor(props) {
      super(props);
      this.state = {
         alertList: [],
         alertType: AlertTypes.Error,
         store: new oStore(),
      };
      this.resetAlert = this.resetAlert.bind(this);
      this.checkApiCallResult = this.checkApiCallResult.bind(this);
   }
   async componentDidMount() {
      this.setState({ store: this.props.store });
   }

   async deleteStore() {
      this.resetAlert();
      await this.props.deleteStore(this.state.store,
         this.checkApiCallResult,
         ["Store was deleted"]);

      try {
         await this.props.onActionCompleted();
      } catch (e) { }
   }
   async submitStore() {
      this.resetAlert();
      if (this.state.store.id > 0) {
         await this.props.putStore(this.state.store,
            this.checkApiCallResult,
            ["Store Updated"]
         );
      } else if (this.state.store.id === 0) {
         await this.props.postStore(this.state.store,
            this.checkApiCallResult,
            ["New store was created"]
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
         store: result.store == null ? new oStore() : result.store,
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
         this.state.store = new oStore();
      }
      let isNewStore = true;
      if (this.state.store.id > 0)
         isNewStore = false;

      return (
         <Modal isOpen={this.props.isOpen}
            className='modal-dialog modal-dialog-centered' >
            <ModalBody>
               <PageHeader title={isNewStore ? "New Store" : "Update Store"} />
               {/***** Status ****/}
               <label children="Status" className="col-2 p-0" />
               {!this.state.store.status ?
                  <button className="col-10 mt-2 btn btn-sm btn-danger m-0"
                     onClick={() => { this.state.store.status = true; this.forceUpdate(); }}>
                     Deactive</button>
                  :
                  <button className="col-10 mt-2 btn btn-sm btn-success m-0"
                     onClick={() => { this.state.store.status = false; this.forceUpdate(); }}>
                     Active</button>
               }
               <Row>
                  <Input lblText="Name"
                     key={this.state.store.id}
                     bindedValue={this.state.store.name}
                     onChange={i => this.state.store.name = i.target.value}
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
                     className={isNewStore ? "col-12 mt-2 btn-white col-sm-6" : "col-12 mt-2 btn-white col-sm-4"}
                     onClick={this.props.onCancel} />
                  {!isNewStore &&
                     <div className="col-12 col-sm-8 p-0 m-0">
                        <ButtonPopupConfirm title="Delete"
                           popupMessage="Are you sure?"
                           className="col-12 col-sm-6 mt-2"
                           btnClassName="btn-red"
                           onConfirmClick={this.deleteStore.bind(this)}
                        />
                        <ButtonPopupConfirm title="Update"
                           popupMessage="Are you sure?"
                           className="col-12 mt-2 col-sm-6"
                           btnClassName="btn-green"
                           onConfirmClick={this.submitStore.bind(this)}
                        />
                     </div>
                  }
                  {isNewStore &&
                     <Button title="Create"
                        className="col-12 mt-2 btn-green col-sm-6"
                        onClick={this.submitStore.bind(this)} />
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
/// Map actions (which may include dispatch to redux store) to component
const mapDispatchToProps = {
   putStore,
   postStore,
   deleteStore,
};
/// Redux Connection before exporting the component
export default connect(
   mapStateToProps,
   dispatch => bindActionCreators(mapDispatchToProps, dispatch)
)(AddModifyStoreModal);
