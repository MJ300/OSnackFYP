import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row } from 'reactstrap';
import Modal from 'reactstrap/lib/Modal';
import ModalBody from 'reactstrap/lib/ModalBody';
import { AlertTypes, oError, ProductUnitType, API_URL } from '../../../../_CoreFiles/CommonJs/AppConst.Shared';
import { getBase64fromUrlImage } from '../../../../_CoreFiles/CommonJs/AppFunc.Shared';
import { PageHeader, Alert } from '../../../Components/Text-OSnack';
import { Button, ButtonPopupConfirm } from '../../../Components/Buttons-OSnack';
import { oCategory } from '../../../../_CoreFiles/CommonJs/Models-OSnack';
import { Input, DropdownInput, ImageUpload } from '../../../Components/Inputs-OSnack';
import { putCategory, postCategory, deleteCategory } from '../../../../Redux/Actions/CategoryManagementAction';

class AddModifyCategoryModal extends PureComponent {
   constructor(props) {
      super(props);
      this.state = {
         alertList: [],
         alertType: AlertTypes.Error,
         category: new oCategory(),
      };

      this.checkApiCallResult = this.checkApiCallResult.bind(this);
      this.deleteCategory = this.deleteCategory.bind(this);
      this.submitCategory = this.submitCategory.bind(this);
   }
   async componentDidUpdate() {
      if (this.state.category.id !== this.props.category.id) {
         try {
            this.state.category = this.props.category;
            await getBase64fromUrlImage(API_URL + this.props.category.imagePath)
               .then(imgBase64 => {
                  this.state.category.imageBase64 = imgBase64;
                  this.forceUpdate();
               }).catch(() => {
                  this.forceUpdate();
               });
         } catch (e) { }
      }
      if (!this.props.isOpen) {
         this.state.alertList = [];
         this.state.category = new oCategory();
      }
   }

   async deleteCategory() {
      await this.props.deleteCategory(this.state.category,
         this.checkApiCallResult,
         ["Category was deleted"]);
      this.state.category.id = 0;
   }
   async submitCategory() {
      const { category, selectedImageBase64 } = this.state;

      /// if the selected image is not null
      /// then pass it as the selected image for the
      /// category object being sent to the server
      if (!(selectedImageBase64 == null))
         category.imageBase64 = selectedImageBase64;

      /// If the category object has ID more than 0
      /// then try to update the category
      if (category.id > 0) {
         await this.props.putCategory(category,
            await this.checkApiCallResult,
            ["Category Updated"]
         );
      }
      /// Else the category object is a new object
      /// then try to create a new record
      else if (category.id === 0) {
         await this.props.postCategory(category,
            await this.checkApiCallResult,
            ["New category was created"]
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
         category: result.category == null ? new oCategory() : result.category,
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
      let { alertList, alertType, category } = this.state;
      const { isOpen, toggle } = this.props;

      let isNewCategory = true;
      if (category.id > 0)
         isNewCategory = false;

      return (
         <Modal isOpen={isOpen} toggle={toggle}
            className='modal-dialog modal-dialog-centered' >
            <ModalBody>
               <PageHeader title={isNewCategory ? "New Category" : "Update Category"} />


               {/***** Status ****/}
               <label children="Status" className="col-2 p-0" />
               {!category.status ?
                  <button className="col-10 mt-2 btn btn-sm btn-danger m-0"
                     onClick={() => { category.status = true; this.forceUpdate(); }}>
                     Deactive</button>
                  :
                  <button className="col-10 mt-2 btn btn-sm btn-success m-0"
                     onClick={() => { category.status = false; this.forceUpdate(); }}>
                     Active</button>
               }

               {/***** Name & Price ****/}
               <Row>
                  <Input lblText="Name"
                     bindedValue={category.name}
                     onChange={i => category.name = i.target.value}
                     className="col-6" />
                  <Input lblText="Price"
                     bindedValue={category.price}
                     onChange={i => category.price = i.target.value}
                     className="col-6" />
               </Row>
               {/***** Unit Quantity and type ****/}
               <Row>
                  <Input lblText="Unit Quantity" type="number"
                     bindedValue={category.unitQuantity}
                     onChange={i => category.unitQuantity = i.target.value}
                     className="col-6 " />
                  <DropdownInput className="col-6" lblText="Unit"
                     selectedValue={category.unit}
                     onChange={i => category.unit = i.target.value}
                     list={ProductUnitType}
                     onSelect={i => category.unit = i.id}
                  />
               </Row>

               {/***** Image upload and show preview button ****/}
               <ImageUpload className="mt-4" initBase64={category.imageBase64}
                  onUploaded={(i) => this.state.category.imageBase64 = i} />

               <Alert alertItemList={alertList}
                  type={alertType}
                  className="col-12"
                  onClosed={() => this.setState({ alertList: [] })}
               />

               {/***** buttons ****/}
               <Row className="col-12 p-0 m-0 mt-2">
                  <Button title="Cancel"
                     className={isNewCategory ? "col-12 mt-2 btn-white col-sm-6" : "col-12 mt-2 btn-white col-sm-4"}
                     onClick={this.props.onCancel} />
                  {!isNewCategory &&
                     <div className="col-12 col-sm-8 p-0 m-0">
                        <ButtonPopupConfirm title="Delete"
                           popupMessage="Are you sure?"
                           className="col-12 col-sm-6 mt-2"
                           btnClassName="btn-red"
                           onConfirmClick={this.deleteCategory}
                        />
                        <ButtonPopupConfirm title="Update"
                           popupMessage="Are you sure?"
                           className="col-12 mt-2 col-sm-6"
                           btnClassName="btn-green"
                           onConfirmClick={this.submitCategory}
                        />
                     </div>
                  }
                  {isNewCategory &&
                     <Button title="Create"
                        className="col-12 mt-2 btn-green col-sm-6"
                        onClick={this.submitCategory} />
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
   putCategory,
   postCategory,
   deleteCategory,
};
/// Redux Connection before exporting the component
export default connect(
   mapStateToProps,
   dispatch => bindActionCreators(mapDispatchToProps, dispatch)
)(AddModifyCategoryModal);
