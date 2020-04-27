import OrderReducer from './Reducers/OrderReducer';
import loginModalReducer from './Reducers/loginModalReducer';
import AuthenticationReducer from './Aut../Redux/Reducers/AuthenticationReducermport NavMenuReducer from './La../Redux / Reducers / NavMenuReducerimport NotifierReducer f../ Redux / Reducers / NotifierReducerducer';
import { combineReducers } from 'redux';

const AllReducers = combineReducers(
    {
        loginModal: loginModalReducer,
        auth: AuthenticationReducer,
        navMenu: NavMenuReducer,
        notifier: NotifierReducer,
        order: OrderReducer,
    });
export default AllReducers;