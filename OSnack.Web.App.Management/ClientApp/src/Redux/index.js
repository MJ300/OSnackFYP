import { combineReducers } from 'redux';
import AuthenticationReducer from './Reducers/AuthenticationReducer';

const AllReducers = combineReducers(
    {
        Authentication: AuthenticationReducer
    });
export default AllReducers;