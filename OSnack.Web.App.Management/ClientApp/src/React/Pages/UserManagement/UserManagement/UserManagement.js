import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Table } from 'reactstrap';
import { PageHeader, Alert } from '../../../Components/Text-OSnack';
import { Input } from '../../../Components/Inputs-OSnack';
import { Button, DropdownBtn } from '../../../Components/Buttons-OSnack';
import { oUser } from '../../../../_CoreFiles/CommonJs/Models-OSnack';
import { getUsers } from '../../../../Redux/Actions/UserManagementAction';
import { AlertTypes, GetAllRecords, ConstMaxNumberOfPerItemsPage, oError } from '../../../../_CoreFiles/CommonJs/AppConst.Shared';
import { Pagination } from '../../../Components/Misc-OSnack';
import AddModifyUserModal from './AddModifyUserModal';
import { getAllRoles } from '../../../../Redux/Actions/RoleManagementAction';

class UserManagement extends PureComponent {
   constructor(props) {
      super(props);
      this.state = {
         alertList: [],
         alertType: AlertTypes.Error,
         userList: [],
         selectedUser: new oUser(),
         roleList: [],
         filterRoleValue: GetAllRecords,
         searchValue: '',
         isOpenUserModal: false,
         listTotalCount: 0,
         SelectedPage: 1,
         MaxNumberPerItemsPage: ConstMaxNumberOfPerItemsPage,
         filterStatus: GetAllRecords,
      };

      this.editUser = this.editUser.bind(this);
      this.search = this.search.bind(this);
   }

   async componentDidMount() {
      const result = await this.props.getAllRoles();
      if (result.roleList.length === 0)
         this.state.alertList.push(new oError({ key: "0", value: "Unable to load role list." }));
      else if (result.roleList.length > 0)
         this.setState({ roleList: result.roleList });
   }
   //#region *** *** Search the API for the selected page with...
   /// the maximum number of items search value specified. *** ***
   //#endregion
   async search(SelectedPage, MaxNumberPerItemsPage) {
      /// if the selected values are null then set them to their
      /// default values
      if (!(SelectedPage == null))
         this.state.SelectedPage = SelectedPage;
      if (!(MaxNumberPerItemsPage == null))
         this.state.MaxNumberPerItemsPage = MaxNumberPerItemsPage;
      let searchVal = GetAllRecords;
      if (this.state.searchValue != null && this.state.searchValue != '')
         searchVal = this.state.searchValue;

      /// call the api action with the necessary variables
      /// to get a list of intended Users
      await this.props.getUsers(
         /// values need for search functionality
         /// to work on the server
         this.state.SelectedPage,
         this.state.MaxNumberPerItemsPage,
         searchVal,
         this.state.filterRoleValue,
         // call back method from the action after the call ends
         ((result) => {
            /// if there are any errors set the alert list to it
            if (result.errors.length > 0) {
               this.setState({ alertList: result.errors });
               return;
            }
            /// else there are no errors so set the user list and total count number of the request
            this.setState({ userList: result.userList, listTotalCount: result.totalCount });
         }).bind(this));
   }

   /// Select a user and open the add/modify user modal
   async editUser(user) {
      this.setState({ selectedUser: user, isOpenUserModal: true });
   }

   render() {

      return (
         <Container className="custom-container">
            <Row className="mt-2">
               <Row className="col-12 col-md-10 col-lg-8 p-3 mb-3 bg-white ml-auto mr-auto">
                  <PageHeader title="User Management" />
                  {/***** Search Input and new user button  ****/}
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

                     <Button title="New User"
                        className="col-12 col-md-4 mt-2 mt-md-0 btn-green btn-lg"
                        onClick={() => this.editUser(new oUser())}
                     />
                  </Row>

                  {/***** Filter Drop-downs ****/}
                  <Row className="col-12 m-0 p-0 mt-2 mb-2">
                     <label className="col-auto align-self-center" children="Filter by: " />
                     <DropdownBtn
                        title={this.state.filterRoleValue === GetAllRecords
                           ? <React.Fragment>Role: ( All ) </React.Fragment>
                           : <React.Fragment>Role: ( {this.state.filterRoleValue} )</React.Fragment>
                        }
                        className="col-12 col-md-auto mt-2 pl-md-1 pr-md-1 mt-md-0"
                        btnClassName="btn-white"
                        spanClassName="text-center dropdown-menu-right bg-white"
                        body={
                           <div>
                              {this.state.roleList.map(i =>
                                 <a key={i.name}
                                    className="dropdown-item text-nav"
                                    onClick={() => this.setState({ filterRoleValue: i.name })}
                                    children={i.name}
                                 />
                              )}
                              <a className="dropdown-item text-nav"
                                 onClick={() => this.setState({ filterRoleValue: GetAllRecords })}
                                 children='All' />
                           </div>
                        }
                     />
                  </Row>

                  {/***** User Table  ****/}
                  <Row className="col-12 p-0 m-0">
                     <Table className="col-12 text-center" striped responsive>
                        <thead>
                           <tr>
                              <th>Name</th>
                              <th>Surname</th>
                              <th>Role</th>
                              <th>Email</th>
                              <th>Phone Number</th>
                              <th></th>
                           </tr>
                        </thead>
                        {this.state.userList.length > 0 &&
                           <tbody>
                              {this.state.userList.map((i) => {
                                 return (
                                    <tr key={i.id}>
                                       <td>{i.firstName}</td>
                                       <td>{i.surname}</td>
                                       <td>{i.role.name}</td>
                                       <td>{i.email}</td>
                                       <td>{i.phoneNumber}</td>
                                       <td>
                                          <div className="p-0 m-0">
                                             <button className="btn btn-sm btn-blue col-12 m-0"
                                                onClick={() => this.editUser(i)}>
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

                  {/***** Add/ modify user modal  ****/}
                  <AddModifyUserModal isOpen={this.state.isOpenUserModal}
                     user={this.state.selectedUser}
                     roleList={this.state.roleList}
                     onActionCompleted={this.search}
                     toggle={() => this.setState({ isOpenUserModal: !this.state.isOpenUserModal })}
                     onCancel={() => this.setState({ isOpenUserModal: false, selectedUser: new oUser() })} />
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
/// Map actions (which may include dispatch to redux user) to component
const mapDispatchToProps = {
   getUsers,
   getAllRoles
};
/// Redux Connection before exporting the component
export default connect(
   mapStateToProps,
   dispatch => bindActionCreators(mapDispatchToProps, dispatch)
)(UserManagement);
