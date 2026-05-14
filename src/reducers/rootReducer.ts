import { combineReducers } from 'redux';
import dataReducer from './dataReducer';
import liveDataReducer from './liveDataReducer';

const createRootReducer = () => combineReducers({
    data: dataReducer,
    liveData: liveDataReducer
});

export default createRootReducer;
