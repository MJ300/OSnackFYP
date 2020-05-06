///*** import required CSS Files
import 'bootstrap/dist/css/bootstrap.css';
import './_CoreFiles/main.css';

import React from 'react';
import { Switch } from 'react-router';

// Main Components such as pages, navbar, footer 
import ProtectedRoute from './_CoreFiles/CommonJs/ProtectedRoute';
import CustomRoute from './_CoreFiles/CommonJs/CustomRoute';
import NavMenu from './React/Components/NavMenu/NavMenu';
import Footer from './React/Components/Footer';
import Home from './React/Pages/Home/Home';
import PageNotFound from './React/Pages/Error/PageNotFound';
import Login from './React/Pages/Login/Login';
import MyAccount from './React/Pages/MyAccount/MyAccount';
import OrderManagement from './React/Pages/OrderManagement/OrderManagement';
import Statistics from './React/Pages/Statistics/Statistics';
import StoreQuickLinks from './React/Pages/StoreManagement/StoreQuickLinks';
import UserManagement from './React/Pages/UserManagement/UserManagement';
import ProductManagement from './React/Pages/StoreManagement/ProductManagement/ProductManagement';
import CategoryManagement from './React/Pages/StoreManagement/CategoryManagement/CategoryManagement';
import StoreManagement from './React/Pages/StoreManagement/StoreManagement/StoreManagement';

const App = () => {
   return (
      <div>
         <NavMenu />
         <Switch>
            {/***** Public Routes  ****/}
            <CustomRoute exact path='/Login' Render={props => <Login {...props} />} />

            {/***** Protected Routes ****/}
            <ProtectedRoute exact path='/' Render={props => <Home {...props} />} />
            <ProtectedRoute exact path='/MyAccount' Render={props => <MyAccount {...props} />} />
            <ProtectedRoute exact path='/OrderManagement' Render={props => <OrderManagement {...props} />} />
            <ProtectedRoute exact path='/Statistics' Render={props => <Statistics {...props} />} />
            <ProtectedRoute exact path='/StoreManagement' Render={props => <StoreQuickLinks {...props} />} />
            <ProtectedRoute exact path='/UserManagement' Render={props => <UserManagement {...props} />} />
            <ProtectedRoute exact path='/ProductManagement' Render={props => <ProductManagement {...props} />} />
            <ProtectedRoute exact path='/CategoryManagement' Render={props => <CategoryManagement {...props} />} />
            <ProtectedRoute exact path='/StorageManagement' Render={props => <StoreManagement {...props} />} />

            {/***** Other Routes ****/}
            <CustomRoute path='*' Render={props => <PageNotFound {...props} />} />
         </Switch>
         <Footer />
      </div>
   );
};
export default App;