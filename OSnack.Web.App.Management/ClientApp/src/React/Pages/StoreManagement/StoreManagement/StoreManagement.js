import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Table } from 'reactstrap';
import { PageHeader, Alert } from '../../../Components/Text-OSnack';
import { Input } from '../../../Components/Inputs-OSnack';
import { Button } from '../../../Components/Buttons-OSnack';
import { oStore } from '../../../../_CoreFiles/CommonJs/Models-OSnack';
import AddModifyStoreModal from './AddModifyStoreModal';
import { getStores } from '../../../../Redux/Actions/StoreManagementAction';
import { AlertTypes, GetAllRecords } from '../../../../_CoreFiles/CommonJs/AppConst.Shared';
import { Pagination } from '../../../Components/Misc-OSnack';

class StoreManagement extends PureComponent {
   constructor(props) {
      super(props);
      this.state = {
         alertList: [],
         alertType: AlertTypes.Error,
         storeList: [],
         searchValue: '',
         isOpenStoreModal: false,
         selectedStore: new oStore(),
         listTotalCount: 0,
         SelectedPage: 1,
         MaxNumberPerItemsPage: 10
      };

      this.editStore = this.editStore.bind(this);
      this.search = this.search.bind(this);
   }
   async search(SelectedPage, MaxNumberPerItemsPage) {
      if (!(SelectedPage == null))
         this.state.SelectedPage = SelectedPage;
      if (!(MaxNumberPerItemsPage == null))
         this.state.MaxNumberPerItemsPage = MaxNumberPerItemsPage;

      let searchVal = GetAllRecords;
      if (this.state.searchValue != null && this.state.searchValue != '')
         searchVal = this.state.searchValue;

      await this.props.getStores(this.state.SelectedPage, this.state.MaxNumberPerItemsPage, searchVal,
         ((result) => {
            if (result.errors.length > 0) {
               this.setState({ alertList: result.errors });
               return;
            }
            this.setState({ storeList: result.storeList, listTotalCount: result.totalCount });
         }).bind(this));
   }

   async editStore(store) {
      console.log(store);
      this.setState({ selectedStore: store, isOpenStoreModal: true });
   }

   render() {
      return (
         <Container className="custom-container">
            <Row className="mt-2">
               <Row className="col-12 col-md-10 col-lg-8 p-3 mb-3 bg-white ml-auto mr-auto">
                  <PageHeader title="Store Management" />
                  {/***** Controls  ****/}
                  <Row className="col-12 p-0 m-0">
                     <Alert alertItemList={this.state.alertList}
                        type={this.state.alertType}
                        className="col-12 mb-2"
                        onClosed={() => this.setState({ alertList: [] })}
                     />
                     {/***** Search Input  ****/}
                     <Input placeholder="Search"
                        onChange={i => this.setState({ searchValue: i.target.value })}
                        bindedValue={this.state.searchValue}
                        className="col-7 col-md-6 m-0 p-0"
                        inputClassName="form-control-lg"
                        inputCss="mt-1 m-0"
                        key="searchInput"
                        lblDisabled
                     />
                     <Button title={this.state.searchValue === '' ? 'Show All' : 'Search'}
                        className="col-5 col-md-2 btn-green btn-lg"
                        onClick={async () => await this.search(this.state.SelectedPage, this.state.MaxNumberPerItemsPage)}
                     />

                     <Button title="New Store"
                        className="col-12 col-md-4 mt-2 mt-md-0 btn-green btn-lg"
                        onClick={() => this.setState({ isOpenStoreModal: true })}
                     />
                  </Row>

                  {/***** Store Table  ****/}
                  <Row className="col-12 p-0 m-0">
                     <Table className="col-12 text-center" striped responsive>
                        <thead>
                           <tr>
                              <th>Store Name</th>
                              <th>Status</th>
                              <th></th>
                           </tr>
                        </thead>
                        {this.state.storeList.length > 0 &&
                           <tbody>
                              {this.state.storeList.map((i) => {
                                 return (
                                    <tr key={i.id}>
                                       <td>{i.name}</td>
                                       <td>{i.status ? "Active" : "Disabled"}</td>
                                       <td>
                                          <div className="p-0 m-0">
                                             <button className="btn btn-sm btn-blue col-12 m-0"
                                                onClick={() => this.editStore(i)}>
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
                     <Pagination setListOnLoad={false}
                        setList={this.search}
                        listCount={this.state.listTotalCount} />
                  </Row>
                  {this.state.isOpenStoreModal &&
                     <AddModifyStoreModal isOpen={this.state.isOpenStoreModal}
                        store={this.state.selectedStore}
                        onActionCompleted={this.search}
                        onCancel={() => this.setState({ isOpenStoreModal: false, selectedStore: new oStore() })}
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
   getStores,
};
/// Redux Connection before exporting the component
export default connect(
   mapStateToProps,
   dispatch => bindActionCreators(mapDispatchToProps, dispatch)
)(StoreManagement);
