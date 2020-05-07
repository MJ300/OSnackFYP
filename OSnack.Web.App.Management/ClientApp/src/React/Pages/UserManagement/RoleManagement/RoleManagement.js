import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Table } from 'reactstrap';
import { PageHeader, Alert } from '../../../Components/Text-OSnack';
import { Input } from '../../../Components/Inputs-OSnack';
import { Button, DropdownBtn } from '../../../Components/Buttons-OSnack';
import { oRole } from '../../../../_CoreFiles/CommonJs/Models-OSnack';
import AddModifyRoleModal from './AddModifyRoleModal';
import { getRoles } from '../../../../Redux/Actions/RoleManagementAction';
import { AlertTypes, GetAllRecords, ConstMaxNumberOfPerItemsPage, AccessClaims } from '../../../../_CoreFiles/CommonJs/AppConst.Shared';
import { Pagination } from '../../../Components/Misc-OSnack';

class RoleManagement extends PureComponent {
   constructor(props) {
      super(props);
      this.state = {
         alertList: [],
         alertType: AlertTypes.Error,
         roleList: [],
         selectedRole: new oRole(),
         filterAccessClaimValue: GetAllRecords,
         searchValue: '',
         isOpenRoleModal: false,
         listTotalCount: 0,
         SelectedPage: 1,
         MaxNumberPerItemsPage: ConstMaxNumberOfPerItemsPage
      };

      this.editRole = this.editRole.bind(this);
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

      await this.props.getRoles(
         this.state.SelectedPage,
         this.state.MaxNumberPerItemsPage,
         searchVal,
         this.state.filterAccessClaimValue,
         ((result) => {
            if (result.errors.length > 0) {
               this.setState({ alertList: result.errors });
               return;
            }
            this.setState({ roleList: result.roleList, listTotalCount: result.totalCount });
         }).bind(this));
   }

   async editRole(role) {
      this.setState({ selectedRole: role, isOpenRoleModal: true });
   }

   render() {
      return (
         <Container className="custom-container">
            <Row className="mt-2">
               <Row className="col-12 col-md-10 col-lg-8 p-3 mb-3 bg-white ml-auto mr-auto">
                  <PageHeader title="Role Management" />
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

                     <Button title="New Role"
                        className="col-12 col-md-4 mt-2 mt-md-0 btn-green btn-lg"
                        onClick={() => this.setState({ isOpenRoleModal: true })}
                     />
                  </Row>

                  {/***** Filter Drop-downs ****/}
                  <Row className="col-12 m-0 p-0 mt-2 mb-2">
                     <label className="col-auto align-self-center" children="Filter by: " />
                     <DropdownBtn
                        title={this.state.filterAccessClaimValue === GetAllRecords
                           ? <React.Fragment>Access Claim Type: ( All ) </React.Fragment>
                           : <React.Fragment>Access Claim Type: ( {this.state.filterAccessClaimValue} )</React.Fragment>
                        }
                        className="col-12 col-md-auto mt-2 pl-md-1 pr-md-1 mt-md-0"
                        btnClassName="btn-white"
                        spanClassName="text-center dropdown-menu-right bg-white"
                        body={
                           <div>
                              {AccessClaims.List.map(i =>
                                 <a key={i}
                                    className="dropdown-item text-nav"
                                    onClick={() => this.setState({ filterAccessClaimValue: i.name })}
                                    children={i.name}
                                 />
                              )}
                              <a className="dropdown-item text-nav"
                                 onClick={() => this.setState({ filterAccessClaimValue: GetAllRecords })}
                                 children='All' />
                           </div>
                        }
                     />
                  </Row>

                  {/***** Role Table  ****/}
                  <Row className="col-12 p-0 m-0">
                     <Table className="col-12 text-center" striped responsive>
                        <thead>
                           <tr>
                              <th>Role Name</th>
                              <th>Access Claim</th>
                              <th></th>
                           </tr>
                        </thead>
                        {this.state.roleList.length > 0 &&
                           <tbody>
                              {this.state.roleList.map((i) => {
                                 return (
                                    <tr key={i.id}>
                                       <td>{i.name}</td>
                                       <td>{i.accessClaim}</td>
                                       <td>
                                          <div className="p-0 m-0">
                                             <button className="btn btn-sm btn-blue col-12 m-0"
                                                onClick={() => this.editRole(i)}>
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
                  <AddModifyRoleModal isOpen={this.state.isOpenRoleModal}
                     toggle={i => this.setState({ isOpenRoleModal: !this.state.isOpenRoleModal })}
                     role={this.state.selectedRole}
                     onActionCompleted={this.search}
                     onCancel={() => this.setState({ isOpenRoleModal: false, selectedRole: new oRole() })}
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
/// Map actions (which may include dispatch to redux role) to component
const mapDispatchToProps = {
   getRoles,
};
/// Redux Connection before exporting the component
export default connect(
   mapStateToProps,
   dispatch => bindActionCreators(mapDispatchToProps, dispatch)
)(RoleManagement);
