///*** import required CSS Files
import 'bootstrap/dist/css/bootstrap.css';
import '../src/components/_Main/Styles/main.css';
//import '../src/components/_MainApp/fonts.css';

import React from 'react';
import { Switch } from 'react-router';
import { Container } from 'reactstrap';

// Main Components such as pages, navbar, footer 
import NavMenu from './components/Layout/NavMenu';
import { Footer } from './components/Layout/Footer';
import Home from './Pages old/Home/Home';
import AboutUs from './Pages old/AboutUs/AboutUs';
import NewCustomer from './Pages old/NewCustomer/NewCustomer';
import Shop from './Pages old/Shop/Shop';
import Notifier from './components/Layout/PageNotifier';
import PageNotFound from './components/Layout/PageNotFound';
import ConfirmEmail from './components/Authentication/ConfirmEmail';
import ForgotPassword from './Pages old/PasswordPages/ForgotPassword';
import ResetPassword from './Pages old/PasswordPages/ResetPassword';
import AccountInfo from './Pages old/AccountInfo/AccountInfo';
import CustomRoute from './components/_Main/CustomRoute';

const App = () => {
    alert(test)
    return (
        <div>
            <NavMenu />
            <Container >
                <Switch>
                    <CustomRoute exact path='/' Render={props => <Home {...props} />} />
                    <CustomRoute exact path='/NewCustomer' Render={props => <NewCustomer {...props} />} />
                    <CustomRoute exact path='/ConfirmEmail' Render={props => <ConfirmEmail {...props} />} />
                    <CustomRoute exact path='/ForgotPassword' Render={props => <ForgotPassword {...props} />} />
                    <CustomRoute exact path='/ResetPassword' Render={props => <ResetPassword {...props} />} />
                    <CustomRoute exact path='/Shop' Render={props => <Shop {...props} />} />
                    <CustomRoute exact path='/AboutUs' Render={props => <AboutUs {...props} />} />
                    <CustomRoute exact path='/AccountInfo' Render={(props) => <AccountInfo {...props} />} />
                    <CustomRoute exact path='/Notifier' Render={props => <Notifier {...props} />} />
                    <CustomRoute path='*' Render={props => <PageNotFound {...props} />} />
                </Switch>
            </Container>
            <Footer />
        </div>
    );
}
export default App;