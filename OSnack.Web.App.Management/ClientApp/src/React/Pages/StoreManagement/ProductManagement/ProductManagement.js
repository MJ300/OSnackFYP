import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Table } from 'reactstrap';
import { PageHeader } from '../../../Components/Text-OSnack';
import { Input } from '../../../Components/Inputs-OSnack';
import { Button, DropdownBtn } from '../../../Components/Buttons-OSnack';
import { GetAllRecords } from '../../../../_CoreFiles/CommonJs/AppConst.Shared';
import { oProduct, oStore, oCategory } from '../../../../_CoreFiles/CommonJs/Models-OSnack';
import AddModifyProductModal from './AddModifyProductModal';

class ProductManagement extends PureComponent {
   constructor(props) {
      super(props);
      this.state = {
         productList: [new oProduct({ id: 1, name: "test" })],
         storeList: [new oStore({ id: 1, name: "test" })],
         categoryList: [new oCategory()],
         searchValue: '',
         isOpenProductModal: false,
         selectedProduct: new oProduct(),
         selectedCategory: GetAllRecords,
         selectedStore: GetAllRecords,
         selectedActiveStatus: GetAllRecords,
      };

      this.editProduct = this.editProduct.bind(this);
   }
   async componentDidMount() {
   }

   async search() {

   }
   async activation() {

   }
   async editProduct(product) {
      this.setState({ selectedProduct: product, isOpenProductModal: true });
   }
   render() {
      return (
         <Container className="custom-container">
            <Row className="mt-2">
               <Row className="col-12 col-md-10 col-lg-8 p-3 mb-3 bg-white ml-auto mr-auto">
                  <PageHeader title="Product Management" />
                  {/***** Controls  ****/}
                  <Row className="col-12">
                     {/***** Search Input  ****/}
                     <Input placeholder="Search"
                        onChange={i => this.state.searchValue = i.target.value}
                        bindedValue={this.state.searchValue}
                        className="col-9 col-md-6 m-0 p-0"
                        inputClassName="form-control-lg"
                        inputCss="mt-1 m-0"
                        lblDisabled
                     />
                     <Button title="Search" className="col-3 col-md-3 btn-green"
                        onClick={this.search.bind(this)}
                     />

                     <Button title="New Product"
                        className="col-12 col-md-3 mt-4 mt-md-0 btn-green"
                        onClick={() => this.setState({ isOpenProductModal: true })}
                     />
                  </Row>
                  <Row className="col-12 mt-2">
                     <DropdownBtn title="Store"
                        className="col-12 col-md-4 mt-2 pl-md-1 pr-md-1 mt-md-0"
                        btnClassName="btn-white"
                        spanClassName="text-center dropdown-menu-right bg-white"
                        body={
                           <div>
                              {this.state.storeList.map(i =>
                                 <a key={i.name}
                                    className="dropdown-item text-nav"
                                    onClick={i => this.state.selectedStore = i}
                                    children={i.name}
                                 />

                              )}
                              <a className="dropdown-item text-nav"
                                 onClick={i => this.state.selectedStore = GetAllRecords}
                                 children='All' />
                           </div>
                        }
                     />
                     <DropdownBtn title="Category"
                        className="col-12 col-md-4 mt-2 pl-md-1 pr-md-1 mt-md-0"
                        btnClassName="btn-white"
                        spanClassName="text-center dropdown-menu-right bg-white"
                        body={
                           <div>
                              {this.state.categoryList.map(i =>
                                 <a key={i.name}
                                    className="dropdown-item text-nav"
                                    onClick={i => this.state.selectedCategory = i.id}
                                    children={i.name}
                                 />

                              )}
                              <a className="dropdown-item text-nav"
                                 onClick={i => this.state.selectedCategory = GetAllRecords}
                                 children='All' />
                           </div>
                        }
                     />

                     <DropdownBtn title="Status"
                        className="col-12 col-md-4 mt-2 pr-md-1 mt-md-0"
                        btnClassName="btn-white"
                        spanClassName="text-center dropdown-menu-right bg-white"
                        body={
                           <div>
                              <a className="dropdown-item text-nav"
                                 onClick={i => this.state.selectedActiveStatusDropdown = true}
                                 children="Active"
                              />
                              <a className="dropdown-item text-nav"
                                 onClick={i => this.state.selectedActiveStatusDropdown = false}
                                 children="Disabled"
                              />

                              <a className="dropdown-item text-nav"
                                 onClick={i => this.state.selectedActiveStatusDropdown = GetAllRecords}
                                 children='All' />
                           </div>
                        }
                     />


                  </Row>

                  {/***** Product Table  ****/}
                  <Row className="col-12">
                     <Table className="col-12 text-center" striped responsive>
                        <thead>
                           <tr>
                              <th>Name</th>
                              <th>Category</th>
                              <th>Status</th>
                              <th></th>
                              <th></th>
                              <th></th>
                           </tr>
                        </thead>
                        {this.state.productList.length > 0 &&
                           <tbody>
                              {this.state.productList.map((i) => {
                                 return (
                                    <tr key={i.id}>
                                       <td>{i.name}</td>
                                       <td>{i.category.name}</td>
                                       <td>{i.status ? "Active" : "Disabled"}</td>
                                       <td>{i.status == true ?
                                          <div className="p-0">
                                             <button className="btn btn-danger col-12 m-0"
                                                onClick={() => this.activation(i, false)}>
                                                Deactivate</button>
                                          </div>
                                          :
                                          <div className="p-0">
                                             <button className="btn btn-success col-12 m-0"
                                                onClick={() => this.activation(i, true)}>
                                                Activate</button>
                                          </div>
                                       }
                                       </td>
                                       <td>
                                          <div className="p-0">
                                             <button className="btn btn-primary col-12 m-0"
                                                onClick={() => this.editProduct(i)}>
                                                Modify Store Quantity</button>
                                          </div>
                                       </td>
                                       <td>
                                          <div className="p-0">
                                             <button className="btn btn-primary col-12 m-0"
                                                onClick={() => this.editProduct(i)}>
                                                Edit</button>
                                          </div>
                                       </td>
                                    </tr>
                                 );
                              })
                              }
                           </tbody>
                        }
                     </Table>
                  </Row>
                  {this.state.isOpenProductModal &&
                     <AddModifyProductModal isOpen={this.state.isOpenProductModal}
                        product={this.state.selectedProduct}
                        onCancel={() => this.setState({ isOpenProductModal: false, selectedProduct: new oProduct() })}
                        categoryList={this.state.categoryList}
                     />
                  }
               </Row>
            </Row>
         </Container >
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
)(ProductManagement);
