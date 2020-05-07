import React from 'react';
import { Row, Container } from 'reactstrap';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../Components/Text-OSnack';

const StoreManagementQuickLinks = (props) => {
   return (
      <Container className="custom-container">
         <Row className="col-12 col-md-10 col-lg-8 p-3 pb-4 bg-white ml-auto mr-auto">
            <PageHeader title="Store Management" />
            <Row className="col-12">
               <div className="col-12 col-md-6 ml-auto mr-auto">
                  <h3 children="Quick Links" className="col-12 text-center mt-2" />
                  <Link children="Product Management" to="/ProductManagement"
                     className="col-12 mt-2 btn btn-lg btn-green" />
                  <Link children="Category Management" to="/CategoryManagement"
                     className="col-12 mt-2 btn btn-lg btn-green" />
                  <Link children="Coupon Management" to="/CouponManagement"
                     className="col-12 mt-2 btn btn-lg btn-green" />
                  <Link children="Store Management" to="/StoreManagement"
                     className="col-12 mt-2 btn btn-lg btn-green" />
               </div>
            </Row>
         </Row>
      </Container>
   );
};
export default StoreManagementQuickLinks;
