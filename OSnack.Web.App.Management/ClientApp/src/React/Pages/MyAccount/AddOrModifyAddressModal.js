import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Modal, ModalBody } from 'reactstrap';
import { PageHeader, Alert } from '../../Components/Text-OSnack';
import { Input } from '../../Components/Inputs-OSnack';
import { Button } from '../../Components/Buttons-OSnack';
import { AlertTypes } from '../../../_CoreFiles/CommonJs/AppConst.Shared';
import { oAddress } from '../../../_CoreFiles/CommonJs/Models-OSnack';

class AddOrModifyAddressModal extends PureComponent {
   constructor(props) {
      super(props);
      this.state = {
         address: new oAddress(),
         alertList: [{ key: '2', value: 'test' }],
         alertType: AlertTypes.Success,
      };
      this.updateAddress = this.updateAddress.bind(this);
   }
   async updateAddress() {

   }
   render() {
      this.state.address = this.props.address;
      const title = this.state.address.id === 0 ? "New Address" : "Update Address";
      const submitTxt = this.state.address.id === 0 ? "Create" : "Update";

      return (
         <Modal isOpen={this.props.isOpen}
            className='modal-dialog modal-dialog-centered'>
            <ModalBody>
               <PageHeader title={title} />


               <Input lblText="Name *" type="text" className="col-12"
                  bindedValue={this.state.address.name}
                  onChange={i => this.state.address.name = i.target.value}
               />

               <Input lblText="First Line *" type="text" className="col-12"
                  bindedValue={this.state.address.firstLine}
                  onChange={i => this.state.address.firstLine = i.target.value}
               />

               <Input lblText="Second Line" type="text" className="col-12"
                  bindedValue={this.state.address.secondLine}
                  onChange={i => this.state.address.secondLine = i.target.value}
               />

               <Input lblText="City *" type="text" className="col-12"
                  bindedValue={this.state.address.city}
                  onChange={i => this.state.address.city = i.target.value}
               />

               <Input lblText="Postcode *" type="text" className="col-12"
                  bindedValue={this.state.address.postcode}
                  onChange={i => this.state.address.postcode = i.target.value}
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
                  <Button title={submitTxt}
                     className="col-6 mt-2 btn-green"
                     onClick={this.addOrModifyAddress} />
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
)(AddOrModifyAddressModal);
