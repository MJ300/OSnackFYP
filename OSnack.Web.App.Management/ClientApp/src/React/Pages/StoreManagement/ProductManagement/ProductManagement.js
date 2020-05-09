import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Table } from 'reactstrap';
import { PageHeader, Alert } from '../../../Components/Text-OSnack';
import { Input } from '../../../Components/Inputs-OSnack';
import { Button, DropdownBtn } from '../../../Components/Buttons-OSnack';
import { AlertTypes, GetAllRecords, ProductUnitType, ConstMaxNumberOfPerItemsPage } from '../../../../_CoreFiles/CommonJs/AppConst.Shared';
import { getProducts } from '../../../../Redux/Actions/ProductManagmentAction';
import { oProduct } from '../../../../_CoreFiles/CommonJs/Models-OSnack';
import AddModifyProductModal from './AddModifyProductModal';
import { getAllStores } from '../../../../Redux/Actions/StoreManagementAction';
import { getAllCategories } from '../../../../Redux/Actions/CategoryManagementAction';


class ProductManagement extends PureComponent {
   constructor(props) {
      super(props);
      this.state = {
         alertList: [],
         alertType: AlertTypes.Error,
         storeProductList: [],
         storeList: [],
         categoryList: [],
         searchValue: '',
         isOpenProductModal: false,
         selectedProduct: new oProduct(),
         selectedCategory: GetAllRecords,
         selectedStore: GetAllRecords,
         listTotalCount: 0,
         SelectedPage: 1,
         MaxNumberPerItemsPage: ConstMaxNumberOfPerItemsPage,
         filterProductUnitValue: GetAllRecords,
         filterStatus: GetAllRecords,
      };

      this.editProduct = this.editProduct.bind(this);
      this.search = this.search.bind(this);
   }
   async componentDidMount() {
      await this.props.getAllCategories(
         ((result) => {
            if (result.errors.length > 0) {
               this.state.alertList = result.errors;
               return;
            }
            this.state.categoryList = result.categoryList;
         }).bind(this));

      await this.props.getAllStores(
         ((result) => {
            if (result.errors.length > 0) {
               this.state.alertList = result.errors;
               return;
            }
            this.state.storeList = result.storeList;
            this.state.selectedStore = result.storeList[0];
         }).bind(this));
      this.forceUpdate();
   }


   async search(SelectedPage, MaxNumberPerItemsPage) {

      if (!(SelectedPage == null))
         this.state.SelectedPage = SelectedPage;

      if (!(MaxNumberPerItemsPage == null))
         this.state.MaxNumberPerItemsPage = MaxNumberPerItemsPage;

      let searchVal = GetAllRecords;
      if (this.state.searchValue != null && this.state.searchValue != '')
         searchVal = this.state.searchValue;

      await this.props.getProducts(
         this.state.SelectedPage,
         this.state.MaxNumberPerItemsPage,
         this.state.selectedStore.id,
         this.state.selectedCategory,
         searchVal,
         this.state.filterProductUnitValue,
         this.state.filterStatus,
         ((result) => {
            if (result.errors.length > 0) {
               this.setState({ alertList: result.errors });
               return;
            }
            this.setState({ storeProductList: result.storeProductList, listTotalCount: result.totalCount });
         }).bind(this));
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
                  {/***** Search Input and new product button  ****/}
                  <Row className="col-12 m-0 p-0">
                     <Alert alertItemList={this.state.alertList}
                        type={this.state.alertType}
                        className="col-12 mb-2"
                        onClosed={() => this.setState({ alertList: [] })}
                     />
                     <Input placeholder="Search"
                        onChange={i => this.setState({ searchValue: i.target.value })}
                        bindedValue={this.state.searchValue}
                        className="col-7 col-md-6 m-0 p-0"
                        inputClassName="form-control-lg"
                        inputCss="mt-1 m-0"
                        keyVal="searchInput"
                        lblDisabled
                     />
                     <Button title={this.state.searchValue === '' ? 'Show All' : 'Search'}
                        className="col-5 col-md-2 btn-green btn-lg"
                        onClick={async () => await this.search(this.state.SelectedPage, this.state.MaxNumberPerItemsPage)}
                     />

                     <Button title="New Product"
                        className="col-12 col-md-4 mt-2 mt-md-0 btn-green btn-lg"
                        onClick={() => this.setState({ isOpenProductModal: true })}
                     />
                  </Row>

                  {/***** Filter drop-down menus  ****/}
                  <Row className="col-12 m-0 p-0 mt-2 mb-2">
                     <label className="col-auto align-self-center" children="Filter by: " />
                     <DropdownBtn title={<React.Fragment>Store Name: ({this.state.selectedStore.name})</React.Fragment>
                     }
                        className="col-12 col-md mt-2 pl-md-1 pr-md-1 mt-md-0"
                        btnClassName="btn-white"
                        spanClassName="text-center dropdown-menu-right bg-white"
                        body={
                           <div>
                              {this.state.storeList.map(i =>
                                 <a key={i.name}
                                    className="dropdown-item text-nav"
                                    onClick={() => this.setState({ selectedStore: i })}
                                    children={i.name}
                                 />

                              )}
                           </div>
                        }
                     />
                     <DropdownBtn title={this.state.selectedCategory === GetAllRecords
                        ? <React.Fragment>Category: (All) </React.Fragment>
                        : <React.Fragment>Category: ({this.state.selectedCategory.name})</React.Fragment>
                     }
                        className="col-12 col-md mt-2 pl-md-1 pr-md-1 mt-md-0"
                        btnClassName="btn-white"
                        spanClassName="text-center dropdown-menu-right bg-white"
                        body={
                           <div>
                              {this.state.categoryList.map(i =>
                                 <a key={i.name}
                                    className="dropdown-item text-nav"
                                    onClick={() => this.setState({ selectedCategory: i })}
                                    children={i.name}
                                 />

                              )}
                              <a className="dropdown-item text-nav"
                                 onClick={i => this.setState({ selectedCategory: GetAllRecords })}
                                 children='All' />
                           </div>
                        }
                     />

                     <DropdownBtn title={this.state.filterStatus === GetAllRecords
                        ? <React.Fragment>Status: (All) </React.Fragment>
                        : <React.Fragment>Status: ({this.state.filterStatus ? "Active" : "Disabled"})</React.Fragment>
                     }
                        className="col-12 col-md mt-2 pl-md-1 pr-md-1 mt-md-0"
                        btnClassName="btn-white"
                        spanClassName="text-center dropdown-menu-right bg-white"
                        body={
                           <div>
                              <a className="dropdown-item text-nav"
                                 onClick={i => this.setState({ filterStatus: true })}
                                 children="Active"
                              />
                              <a className="dropdown-item text-nav"
                                 onClick={i => this.setState({ filterStatus: false })}
                                 children="Disabled"
                              />

                              <a className="dropdown-item text-nav"
                                 onClick={i => this.setState({ filterStatus: GetAllRecords })}
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
                              <th className="underline"><a>Name</a></th>
                              <th className="">Category</th>
                              <th className="">Price</th>
                              <th className="">Unit</th>
                              <th className="">Unit Quantity</th>
                              <th className="">Status</th>
                              <th></th>
                           </tr>
                        </thead>
                        {this.state.storeProductList.length > 0 &&
                           <tbody>
                              {console.log(this.state.storeProductList)}
                              {this.state.storeProductList.map((i) => {
                                 return (
                                    <tr key={i.productId}>
                                       <td>{i.product.name}</td>
                                       <td>{i.product.category.name}</td>
                                       <td>{i.product.price}</td>
                                       <td>{ProductUnitType[i.product.unit].name || "Error"}</td>
                                       <td>{i.product.unitQuantity}</td>
                                       <td>{i.status != true ? "Active" : "Disabled"
                                       }
                                       </td>
                                       <td>
                                          <div className="p-0">
                                             <button className="btn btn-primary col-12 m-0"
                                                onClick={() => this.editProduct(i.product)}>
                                                Modify Store Quantity</button>
                                          </div>
                                       </td>
                                       <td>
                                          <div className="p-0">
                                             <button className="btn btn-primary col-12 m-0"
                                                onClick={() => this.editProduct(i.product)}>
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
   getProducts,
   getAllCategories,
   getAllStores
};
/// Redux Connection before exporting the component
export default connect(
   mapStateToProps,
   dispatch => bindActionCreators(mapDispatchToProps, dispatch)
)(ProductManagement);
