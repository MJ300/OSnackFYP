import React from 'react';
import { Container, Row } from 'reactstrap';
import { Link } from 'react-router-dom';

import { STORE_URL } from '../../_CoreFiles/CommonJs/AppConst.Shared';

const Footer = () => {
   return (
      <footer className="footer pt-3 pb-3">
         <Container className="w-100">
            <Row className="col-12 pt-3 pb-3">
               <div className='col-12 col-sm-6'>
                  <ul>
                     <li className='pt-2 h5 text-center text-sm-right'><Link to='/Privacy'>Privacy</Link></li>
                     <li className='pt-2 h5 text-center text-sm-right'><Link to='/AboutUs'>About Us</Link></li>
                     <li className='pt-2 h5 text-center text-sm-right'><Link to="TermsAndConditions">Terms and conditions</Link></li>
                  </ul>
               </div>
               <div className='col-12 col-sm-6'>
                  <ul>
                     <li className='pt-2 h5 text-center text-sm-left'><Link to='/ContactUs'>Contact Us</Link></li>
                     <li className='pt-2 h5 text-center text-sm-left'><a href={STORE_URL + "/Store"}>Store</a></li>
                     <li className='pt-2 h5 text-center text-sm-left'><Link to="NewsLetterSubscribtion">Subscribe to our Newsletter</Link></li>
                  </ul>
               </div>
               <div className="col-12">
                  <ul>
                     <li className="h4 text-center">&copy; 2019 OSnack</li>
                  </ul>
               </div>
            </Row>
         </Container>
      </footer>
   );
};
export default Footer;
