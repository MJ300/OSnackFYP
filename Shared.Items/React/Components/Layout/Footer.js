import React from 'react';
import { Container, Row } from 'reactstrap';
import { Link } from 'react-router-dom';

import { STORE_URL } from '../_CoreFiles/CommonJs/AppConst.Shared';

const Footer = () => {
    return (
        <footer className="footer pt-3 pb-3">
            <Container>
                <Row>
                    <div className='col-6 pt-3 pb-3 '>
                        <ul>
                            <li className='pt-2 h4 text-right'><a href={STORE_URL + "/Store"}>Store</a></li>
                            <li className='pt-2 h4 text-right'><Link to='/ContactUs'>Contact Us</Link></li>
                        </ul>
                    </div>
                    <div className='col-6 pt-3 pb-3'>
                        <ul>
                            <li className='pt-2 h4'><Link to='/Privacy'>Privacy</Link></li>
                            <li className='pt-2 h4'><Link to='/AboutUs'>About Us</Link></li>
                        </ul>
                    </div>
                    <div className="col-12 text-center">&copy; 2019 OSnack</div>
                </Row>
            </Container>
        </footer>
    );
}
export default Footer;
