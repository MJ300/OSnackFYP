import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row } from 'reactstrap';
import Modal from 'reactstrap/lib/Modal';
import ModalBody from 'reactstrap/lib/ModalBody';
import { AlertTypes, ProductUnitType } from '../../../../_CoreFiles/CommonJs/AppConst.Shared';
import { PageHeader, Alert } from '../../../Components/Text-OSnack';
import { Button } from '../../../Components/Buttons-OSnack';
import { oProduct } from '../../../../_CoreFiles/CommonJs/Models-OSnack';
import { Input, DropdownInput, ImageUpload } from '../../../Components/Inputs-OSnack';

class AddModifyProductModal extends PureComponent {
   constructor(props) {
      super(props);
      this.state = {
         alertList: [{ key: '2', value: 'test' }],
         alertType: AlertTypes.Warning,
         product: new oProduct(),
      };

      this.setActivation = this.setActivation.bind(this);
      this.uploadDocument = this.uploadDocument.bind(this);
   }
   async componentDidMount() {
      console.log(this.props.product);
      this.setState({ product: this.props.product });
   }
   async updateProduct() {

   }
   async setActivation(activationValue) {
      this.state.product.status = activationValue;

      this.forceUpdate();
   }
   async uploadDocument(files) {
      Promise.all([].map.call(files, (file) => {
         return new Promise((resolve, reject) => {
            var reader = new FileReader();
            reader.onloadend = () => {
               resolve({ result: reader.result, file: file });
            };
            reader.readAsDataURL(file);
         });
      })).then(async (results) => {
         this.setState({
            selectedImageBase64: results[0].result,
            isOpenImageCropModal: true
         });
      });
   }
   render() {
      if (!this.props.isOpen) {
         this.state.alertList = [];
         this.state.croppedImage = '';
         this.state.isOpenImageCropModal = false;
         this.state.product = new oProduct();
         this.state.selectedImageBase64 = '';
      }
      let isNewProduct = true;
      if (this.state.product.id > 0)
         isNewProduct = false;

      return (
         <Modal isOpen={this.props.isOpen}
            className='modal-dialog modal-dialog-centered' >
            <ModalBody>
               <PageHeader title={isNewProduct ? "New Product" : "Update Product"} />
               {this.state.croppedImage != '' &&
                  <Row className="col-12 ">
                     <img className="shop-card-product" src={this.state.croppedImage} />
                     <div className="col">
                        <button className="btn btn-sm btn-blue col float-center"
                           onClick={() => this.setState({ isOpenImageCropModal: true })}>
                           Edit Image</button>
                     </div>
                  </Row>
               }

               {/***** Status ****/}
               <label children="Status" className="col-2 p-0" />
               {!this.state.product.status ?
                  <button className="col-10 mt-2 btn btn-sm btn-danger m-0"
                     onClick={() => this.setActivation(true)}>
                     Deactive</button>
                  :
                  <button className="col-10 mt-2 btn btn-sm btn-success m-0"
                     onClick={() => this.setActivation(false)}>
                     Active</button>
               }

               <Row>
                  <Input lblText="Name"
                     bindedValue={this.state.product.name}
                     onChange={i => this.state.product.name = i.target.value}
                     className="col-6" />

                  <DropdownInput className="col-6" lblText="Category"
                     list={this.props.categoryList}
                     onSelect={i => this.state.product.category = i}

                  />
               </Row>
               <Row>
                  <Input lblText="Unit Quantity" type="number"
                     bindedValue={this.state.product.name}
                     onChange={i => this.state.product.name = i.target.value}
                     className="col-6 " />
                  <DropdownInput className="col-6" lblText="Unit"
                     list={ProductUnitType}
                     onSelect={i => this.state.product.unit = i}

                  />
               </Row>
               <Row>
                  <Input lblText="Price"
                     bindedValue={this.state.product.price}
                     onChange={i => this.state.product.price = i.target.value}
                     className="col-6" />

                  <div className="col-6">
                     <label children="p8b" className="text-transparent col-12" />
                     <Button title="Use Category Price"
                        className="col-12 btn-blue"
                        onClick={this.props.useCategoryPrice} />
                  </div>
               </Row>
               {/***** Image upload and show preview button ****/}
               <ImageUpload className="mt-4" initBase64={this.state.uploadedImageBase64}
                  onUploaded={(i) => this.state.product.imagePath = i} />

               <label children="Description" className="col-form-label" htmlFor="description" />
               <textarea id="description" maxLength="200" className="form-control col-12" />
               {/***** Alert and buttons ****/}
               <div className="col-12 p-0 mt-2">
                  <Alert alertItemList={this.state.alertList}
                     type={this.state.alertType}
                     className="col-12"
                     onClosed={() => this.setState({ alertList: [] })}
                  />

                  <Button title="Cancel"
                     className={isNewProduct ? "col-12 mt-2 btn-white col-sm-6" : "col-12 mt-2 btn-white col-sm-4"}
                     onClick={this.props.onCancel} />
                  {!isNewProduct &&
                     <Button title="Delete"
                        className="col-12 col-sm-4 mt-2 btn-red"
                        onClick={this.updateProduct.bind(this)} />
                  }
                  <Button title={isNewProduct ? "Create" : "Update"}
                     className={isNewProduct ? "col-12 mt-2 btn-green col-sm-6" : "col-12 mt-2 btn-green col-sm-4"}
                     onClick={this.updateProduct.bind(this)} />
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
)(AddModifyProductModal);
