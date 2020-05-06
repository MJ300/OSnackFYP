import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row } from 'reactstrap';
import { PageHeader, Alert } from '../../Components/Text-OSnack';
import { Input } from '../../Components/Inputs-OSnack';
import { oUser, oAddress } from '../../../_CoreFiles/CommonJs/Models-OSnack';
import { Button, DropdownBtn } from '../../Components/Buttons-OSnack';
import UpdatePasswordModal from './UpdatePasswordModal';
import { AlertTypes } from '../../../_CoreFiles/CommonJs/AppConst.Shared';
import AddOrModifyAddressModal from './AddOrModifyAddressModal';

class MyAccount extends PureComponent {
   constructor(props) {
      super(props);
      this.state = {
         user: new oUser(),
         isOpenPasswordModal: false,
         isOpenAddressModal: false,
         selectedAddress: new oAddress(),
         alertList: [{ key: '2', value: 'test' }],
         alertType: AlertTypes.Error,
      };
      this.addOrModifyAddress = this.addOrModifyAddress.bind(this);
      this.updateUser = this.updateUser.bind(this);
   }

   async componentDidMount() {
      this.setState({ user: this.props.Authentication.user });
   }

   async addOrModifyAddress(address) {
      this.setState({ isOpenAddressModal: true, selectedAddress: address });
   }
   async updateUser() {
   }
   render() {
      return (
         <Container className="custom-container">
            <Row className="mt-2">
               <div className="col-12 col-md-8 col-lg-6 pt-3 bg-white ml-auto mr-auto">
                  <Row className="mb-3">
                     <PageHeader title="My Account" className="col-12 col-md-6 mb-0" />

                     <DropdownBtn title="My Addresses"
                        className="col-12 col-md-6 mt-2 pr-2 pl-md-1 mt-md-0 align-self-end"
                        btnClassName="btn-white"
                        spanClassName="text-center dropdown-menu-right bg-white"
                        body={
                           <div className="p-0 m-0">
                              {this.state.user.addresses.map(address =>
                                 <a className="dropdown-item text-nav"
                                    onClick={() => this.addOrModifyAddress(address)}
                                    children={
                                       <div>
                                          <div>Name: {address.name}</div>
                                          <div>First Line: </div>
                                          <div>{address.firstLine}</div>
                                          <div>Second Line: </div>
                                          <div>{address.secondLine}</div>
                                          <div>City: {address.city}</div>
                                          <div>Postcode: {address.postcode}</div>
                                       </div>
                                    }
                                 />

                              )}
                              <a className="dropdown-item text-nav"
                                 onClick={() => this.addOrModifyAddress(new oAddress())}
                                 children='New Address' />
                           </div>
                        }
                     />
                  </Row>
                  <Row>
                     <Input lblText="Name *" type="text" className="col-6"
                        bindedValue={this.state.user.firstName}
                        onChange={i => this.state.user.firstName = i.target.value}
                     />

                     <Input lblText="Surname *" type="text" className="col-6"
                        bindedValue={this.state.user.surname}
                        onChange={i => this.state.user.surname = i.target.value}
                     />

                     <Input lblText="Phone Number" type="text" className="col-12"
                        bindedValue={this.state.user.phoneNumber}
                        onChange={i => this.state.user.phoneNumber = i.target.value}
                     />


                     <Input lblText="Email *" type="email" className="col-12"
                        bindedValue={this.props.email}
                        onChange={i => this.state.user.email = i.target.value}
                     />

                     <div className="col-12 mt-2">
                        <Alert alertItemList={this.state.alertList}
                           type={this.state.alertType}
                           className="col-12"
                           onClosed={() => this.setState({ alertList: [] })}
                        />

                        <Button title="Change Password" className="col-12 col-md-6 mt-2 btn-blue" onClick={() => this.setState({ isOpenPasswordModal: !this.state.isOpenPasswordModal })} />
                        <Button title="Update" className="col-12 col-md-6 mt-2 btn-green" onClick={this.updateUser} />
                     </div>
                  </Row>

                  <UpdatePasswordModal isOpen={this.state.isOpenPasswordModal} user={this.props.Authentication.user}
                     onCancel={() => this.setState({ isOpenPasswordModal: !this.state.isOpenPasswordModal })} />

                  <AddOrModifyAddressModal isOpen={this.state.isOpenAddressModal} address={this.state.selectedAddress}
                     onCancel={() => this.setState({ isOpenAddressModal: !this.state.isOpenAddressModal })} />

               </div>
            </Row>
         </Container>
      );
   }
}
/// Mapping the redux state with component's properties
const mapStateToProps = (state) => {
   return {
      Authentication: state.Authentication
   };
};
/// Map actions (which may include dispatch to redux store) to component
const mapDispatchToProps = {
};
/// Redux Connection before exporting the component
export default connect(
   mapStateToProps,
   dispatch => bindActionCreators(mapDispatchToProps, dispatch)
)(MyAccount);
