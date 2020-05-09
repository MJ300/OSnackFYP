import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row } from 'reactstrap';
import Modal from 'reactstrap/lib/Modal';
import ModalBody from 'reactstrap/lib/ModalBody';
import { AlertTypes, oError, ProductUnitType, API_URL, ddLookup } from '../../../../_CoreFiles/CommonJs/AppConst.Shared';
import { getBase64fromUrlImage } from '../../../../_CoreFiles/CommonJs/AppFunc.Shared';
import { PageHeader, Alert } from '../../../Components/Text-OSnack';
import { Button, ButtonPopupConfirm } from '../../../Components/Buttons-OSnack';
import { Input, DropdownInput, ImageUpload } from '../../../Components/Inputs-OSnack';
import { oProduct, oCategory } from '../../../../_CoreFiles/CommonJs/Models-OSnack';
import { putProduct, postProduct, deleteProduct, getStoresProduct } from '../../../../Redux/Actions/ProductManagmentAction';
import { getAllCategories } from '../../../../Redux/Actions/CategoryManagementAction';

class AddModifyProductModal extends PureComponent {
   constructor(props) {
      super(props);
      this.state = {
         alertList: [{ key: '2', value: 'test' }],
         alertType: AlertTypes.Warning,
         isOpen: false,
         product: new oProduct(),
         selectedStore: [],
         storeProduct: [],
         categoryList: []
      };
      this.state.product.category = null;
      this.resetAlert = this.resetAlert.bind(this);
      this.checkApiCallResult = this.checkApiCallResult.bind(this);
      this.deleteProduct = this.deleteProduct.bind(this);
      this.submitProduct = this.submitProduct.bind(this);
   }
   async componentDidMount() {
      this.state.product = this.props.product;
      try {
         await getBase64fromUrlImage(API_URL + this.props.product.imagePath)
            .then(imgBase64 => {
               this.state.product.imageBase64 = imgBase64;
            });
      } catch (e) { }
      await this.props.getAllCategories(
         ((result) => {
            if (result.errors.length > 0) {
               this.state.alertList = result.errors;
               return;
            }
            this.state.categoryList = result.categoryList;
         }).bind(this));

      await this.props.getStoresProduct(
         ((result) => {
            if (result.errors.length > 0) {
               this.state.alertList = result.errors;
               return;
            }
            this.state.storeList = result.storeList;
         }).bind(this));
      console.log(this.state.product);
      this.forceUpdate();
   }

   async deleteProduct() {
      this.resetAlert();
      await this.props.deleteProduct(this.state.product,
         await this.checkApiCallResult,
         ["Product was deleted"]);
   }

   async submitProduct() {
      this.resetAlert();
      console.log(eval(this.state.product));
      /// if the selected image is not null
      /// then pass it as the selected image for the
      /// product object being sent to the server
      if (!(this.state.selectedImageBase64 == null))
         this.state.product.imageBase64 = this.state.selectedImageBase64;
      /// If the product object has ID more than 0
      /// then try to update the product
      if (this.state.product.id > 0) {
         await this.props.putProduct(this.state.product,
            await this.checkApiCallResult,
            ["Product Updated"]
         );
      }
      /// Else the product object is a new object
      /// then try to create a new record
      else if (this.state.product.id === 0) {
         this.props.postProduct(this.state.product,
            await this.checkApiCallResult,
            ["New product was created"]
         );
      }
   }


   async checkApiCallResult(result, successMessage) {
      if (result.errors.length > 0) {
         this.setState({ alertList: result.errors, alertType: AlertTypes.Error });
         return;
      }

      this.setState({
         product: result.product == null ? new oProduct() : result.product,
         alertList: [new oError({ key: "s", value: successMessage })],
         alertType: AlertTypes.Success
      });

      try {
         await this.props.onActionCompleted();
      } catch (e) { }
   }

   resetAlert() {
      this.state.alertList = [];
      this.state.alertType = AlertTypes.Error;
   }


   render() {
      let { alertList, alertType, product, categoryList } = this.state;
      const { isOpen } = this.props;
      if (!isOpen) {
         alertList = [];
         product = new oProduct();
      }
      let isNewProduct = true;
      if (product.id > 0)
         isNewProduct = false;

      return (
         <Modal isOpen={isOpen}
            className='modal-dialog modal-dialog-centered' >
            <ModalBody>
               <PageHeader title={isNewProduct ? "New Product" : "Update Product"} />


               {/***** Name & Price ****/}
               <Row>
                  <Input lblText="Name"
                     bindedValue={product.name}
                     onChange={i => this.state.product.name = i.target.value}
                     className="col-6" />
                  <DropdownInput className="col-6 " lblText="Category"
                     selectedValue={product.category === null ? null : product.category.id}
                     onChange={i => this.state.product.category.id = new oCategory(i).id}
                     list={categoryList}
                  />

               </Row>
               {/***** Unit Quantity and type ****/}
               <Row >
                  <Input lblText="Price"
                     bindedValue={product.price}
                     onChange={i => this.state.product.price = i.target.value}
                     className="col-6" />
                  <DropdownInput className="col-6" lblText="Unit"
                     selectedValue={product.unit}
                     onChange={i => this.state.product.unit = new ddLookup(i).id}
                     list={ProductUnitType}
                  />
               </Row>
               {!isNewProduct &&
                  <Row className="col-12 m-0 p-0">
                     <Input lblText="Store Name"
                        bindedValue={this.state.selectedStore.name}
                        className="col-6 " disable={true} />

                     <Input lblText="Quantity"
                        bindedValue={this.state.storeProduct.quantity}
                        onChange={i => this.state.storeProduct.quantity = i.target.value}
                        className="col-6" />

                  </Row>}
               {/***** Image upload and show preview button ****/}
               <ImageUpload className="mt-4" initBase64={product.imageBase64}
                  onUploaded={(i) => this.state.product.imageBase64 = i} />
               <Alert alertItemList={alertList}
                  type={alertType}
                  className="col-12"
                  onClosed={() => this.setState({ alertList: [] })}
               />

               {/***** buttons ****/}
               <Row className="col-12 p-0 m-0 mt-2">
                  <Button title="Cancel"
                     className={isNewProduct ? "col-12 mt-2 btn-white col-sm-6" : "col-12 mt-2 btn-white col-sm-4"}
                     onClick={this.props.onCancel} />
                  {!isNewProduct &&
                     <div className="col-12 col-sm-8 p-0 m-0">
                        <ButtonPopupConfirm title="Delete"
                           popupMessage="Are you sure?"
                           className="col-12 col-sm-6 mt-2"
                           btnClassName="btn-red"
                           onConfirmClick={this.deleteProduct}
                        />
                        <ButtonPopupConfirm title="Update"
                           popupMessage="Are you sure?"
                           className="col-12 mt-2 col-sm-6"
                           btnClassName="btn-green"
                           onConfirmClick={this.submitProduct}
                        />
                     </div>
                  }
                  {isNewProduct &&
                     <Button title="Create"
                        className="col-12 mt-2 btn-green col-sm-6"
                        onClick={this.submitProduct} />
                  }
               </Row>

               {this.state.isOpen &&
                  <AddModifyProductModal isOpen={this.state.isOpen}
                     product={this.state.selectedProduct}
                     onCancel={() => this.setState({ isOpenProductModal: false, selectedProduct: new oProduct() })}
                     storeList={this.state.storeList}
                  />
               }
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
   putProduct,
   postProduct,
   deleteProduct,
   getAllCategories,
   getStoresProduct
};
/// Redux Connection before exporting the component
export default connect(
   mapStateToProps,
   dispatch => bindActionCreators(mapDispatchToProps, dispatch)
)(AddModifyProductModal);
