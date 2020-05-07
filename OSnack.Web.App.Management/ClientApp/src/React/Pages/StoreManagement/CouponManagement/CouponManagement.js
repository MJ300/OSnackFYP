import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Table } from 'reactstrap';
import { PageHeader, Alert } from '../../../Components/Text-OSnack';
import { Input } from '../../../Components/Inputs-OSnack';
import { Button } from '../../../Components/Buttons-OSnack';
import { oCoupon } from '../../../../_CoreFiles/CommonJs/Models-OSnack';
import AddModifyCouponModal from './AddModifyCouponModal';
import { getCoupons } from '../../../../Redux/Actions/CouponManagementAction';
import { AlertTypes, GetAllRecords, ConstMaxNumberOfPerItemsPage } from '../../../../_CoreFiles/CommonJs/AppConst.Shared';
import { Pagination } from '../../../Components/Misc-OSnack';

class CouponManagement extends PureComponent {
   constructor(props) {
      super(props);
      this.state = {
         alertList: [],
         alertType: AlertTypes.Error,
         couponList: [],
         searchValue: '',
         isOpenCouponModal: false,
         selectedCoupon: new oCoupon(),
         listTotalCount: 0,
         SelectedPage: 1,
         MaxNumberPerItemsPage: ConstMaxNumberOfPerItemsPage
      };

      this.editCoupon = this.editCoupon.bind(this);
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

      await this.props.getCoupons(this.state.SelectedPage, this.state.MaxNumberPerItemsPage, searchVal,
         ((result) => {
            if (result.errors.length > 0) {
               this.setState({ alertList: result.errors });
               return;
            }
            this.setState({ couponList: result.couponList, listTotalCount: result.totalCount });
         }).bind(this));
   }

   async editCoupon(coupon) {
      console.log(coupon);
      this.setState({ selectedCoupon: coupon, isOpenCouponModal: true });
   }

   render() {
      return (
         <Container className="custom-container">
            <Row className="mt-2">
               <Row className="col-12 col-md-10 col-lg-8 p-3 mb-3 bg-white ml-auto mr-auto">
                  <PageHeader title="Coupon Management" />
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
                        keyVal="searchInput"
                        lblDisabled
                     />
                     <Button title={this.state.searchValue === '' ? 'Show All' : 'Search'}
                        className="col-5 col-md-2 btn-green btn-lg"
                        onClick={async () => await this.search(this.state.SelectedPage, this.state.MaxNumberPerItemsPage)}
                     />

                     <Button title="New Coupon"
                        className="col-12 col-md-4 mt-2 mt-md-0 btn-green btn-lg"
                        onClick={() => this.setState({ isOpenCouponModal: true })}
                     />
                  </Row>

                  {/***** Coupon Table  ****/}
                  <Row className="col-12 p-0 m-0">
                     <Table className="col-12 text-center" striped responsive>
                        <thead>
                           <tr>
                              <th>Coupon Name</th>
                              <th>Status</th>
                              <th></th>
                           </tr>
                        </thead>
                        {this.state.couponList.length > 0 &&
                           <tbody>
                              {this.state.couponList.map((i) => {
                                 return (
                                    <tr key={i.id}>
                                       <td>{i.name}</td>
                                       <td>{i.status ? "Active" : "Disabled"}</td>
                                       <td>
                                          <div className="p-0 m-0">
                                             <button className="btn btn-sm btn-blue col-12 m-0"
                                                onClick={() => this.editCoupon(i)}>
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
                  <AddModifyCouponModal isOpen={this.state.isOpenCouponModal}
                     toggle={i => this.setState({ isOpenCouponModal: !this.state.isOpenCouponModal })}
                     coupon={this.state.selectedCoupon}
                     onActionCompleted={this.search}
                     onCancel={() => this.setState({ isOpenCouponModal: false, selectedCoupon: new oCoupon() })}
                  />
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
/// Map actions (which may include dispatch to redux coupon) to component
const mapDispatchToProps = {
   getCoupons,
};
/// Redux Connection before exporting the component
export default connect(
   mapStateToProps,
   dispatch => bindActionCreators(mapDispatchToProps, dispatch)
)(CouponManagement);
