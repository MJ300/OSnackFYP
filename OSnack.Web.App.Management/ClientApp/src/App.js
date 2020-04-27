///*** import required CSS Files
import 'bootstrap/dist/css/bootstrap.css';
import './_CoreFiles/main.css';

import React from 'react';
import { Switch } from 'react-router';

// Main Components such as pages, navbar, footer 
import ProtectedRoute from './_CoreFiles/CommonJs/ProtectedRoute';
import CustomRoute from './_CoreFiles/CommonJs/CustomRoute';
import NavMenu from './Components/NavMenu/NavMenu';
import Footer from './Components/Footer';
import Home from './Pages/Home/Home';
import PageNotFound from './Pages/Error/PageNotFound';
import Login from './Pages/Login/Login';

const App = () => {
    return (
        <div>
            <NavMenu />
            <Switch>
                {/***** Public Routes  ****/}
                <CustomRoute exact path='/Login' Render={props => <Login {...props} />} />

                {/***** Protected Routes ****/}
                <ProtectedRoute exact path='/' Render={props => <Home {...props} />} />

                {/***** Other Routes ****/}
                <CustomRoute path='*' Render={props => <PageNotFound {...props} />} />
            </Switch>
            <Footer />
        </div>
    );
}
export default App;