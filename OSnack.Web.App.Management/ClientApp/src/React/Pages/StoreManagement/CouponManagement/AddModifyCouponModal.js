import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row } from 'reactstrap';
import Modal from 'reactstrap/lib/Modal';
import ModalBody from 'reactstrap/lib/ModalBody';
import { AlertTypes, oError } from '../../../../_CoreFiles/CommonJs/AppConst.Shared';
import { PageHeader, Alert } from '../../../Components/Text-OSnack';
import { Button, ButtonPopupConfirm } from '../../../Components/Buttons-OSnack';
import { oCoupon } from '../../../../_CoreFiles/CommonJs/Models-OSnack';
import { Input } from '../../../Components/Inputs-OSnack';
import { putCoupon, postCoupon, deleteCoupon } from '../../../../Redux/Actions/CouponManagementAction';

class AddModifyCouponModal extends PureComponent {
   constructor(props) {
      super(props);
      this.state = {
         alertList: [],
         alertType: AlertTypes.Error,
         coupon: new oCoupon(),
      };
      this.resetAlert = this.resetAlert.bind(this);
      this.checkApiCallResult = this.checkApiCallResult.bind(this);
   }
   async componentDidUpdate() {
      if (this.state.coupon.id !== this.props.coupon.id) {
         try {
            this.state.coupon = this.props.coupon;
            this.forceUpdate();
         } catch (e) { }
      }
      if (!this.props.isOpen) {
         this.state.alertList = [];
         this.state.coupon = new oCoupon();
      }
   }


   async deleteCoupon() {
      this.resetAlert();
      await this.props.deleteCoupon(this.state.coupon,
         this.checkApiCallResult,
         ["Coupon was deleted"]);

      try {
         await this.props.onActionCompleted();
      } catch (e) { }
   }
   async submitCoupon() {
      this.resetAlert();
      if (this.state.coupon.id > 0) {
         await this.props.putCoupon(this.state.coupon,
            this.checkApiCallResult,
            ["Coupon Updated"]
         );
      } else if (this.state.coupon.id === 0) {
         await this.props.postCoupon(this.state.coupon,
            this.checkApiCallResult,
            ["New coupon was created"]
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
         coupon: result.coupon == null ? new oCoupon() : result.coupon,
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
         this.state.coupon = new oCoupon();
      }
      let isNewCoupon = true;
      if (this.state.coupon.id > 0)
         isNewCoupon = false;

      return (
         <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}
            className='modal-dialog modal-dialog-centered' >
            <ModalBody>
               <PageHeader title={isNewCoupon ? "New Coupon" : "Update Coupon"} />
               {/***** Status ****/}
               <label children="Status" className="col-2 p-0" />
               {!this.state.coupon.status ?
                  <button className="col-10 mt-2 btn btn-sm btn-danger m-0"
                     onClick={() => { this.state.coupon.status = true; this.forceUpdate(); }}>
                     Deactive</button>
                  :
                  <button className="col-10 mt-2 btn btn-sm btn-success m-0"
                     onClick={() => { this.state.coupon.status = false; this.forceUpdate(); }}>
                     Active</button>
               }
               <Row>
                  <Input lblText="Name"
                     key={this.state.coupon.id}
                     bindedValue={this.state.coupon.name}
                     onChange={i => this.state.coupon.name = i.target.value}
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
                     className={isNewCoupon ? "col-12 mt-2 btn-white col-sm-6" : "col-12 mt-2 btn-white col-sm-4"}
                     onClick={this.props.onCancel} />
                  {!isNewCoupon &&
                     <div className="col-12 col-sm-8 p-0 m-0">
                        <ButtonPopupConfirm title="Delete"
                           popupMessage="Are you sure?"
                           className="col-12 col-sm-6 mt-2"
                           btnClassName="btn-red"
                           onConfirmClick={this.deleteCoupon.bind(this)}
                        />
                        <ButtonPopupConfirm title="Update"
                           popupMessage="Are you sure?"
                           className="col-12 mt-2 col-sm-6"
                           btnClassName="btn-green"
                           onConfirmClick={this.submitCoupon.bind(this)}
                        />
                     </div>
                  }
                  {isNewCoupon &&
                     <Button title="Create"
                        className="col-12 mt-2 btn-green col-sm-6"
                        onClick={this.submitCoupon.bind(this)} />
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
/// Map actions (which may include dispatch to redux coupon) to component
const mapDispatchToProps = {
   putCoupon,
   postCoupon,
   deleteCoupon,
};
/// Redux Connection before exporting the component
export default connect(
   mapStateToProps,
   dispatch => bindActionCreators(mapDispatchToProps, dispatch)
)(AddModifyCouponModal);
