import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import dataReducer from './dataReducer';
import liveDataReducer from "./liveDataReducer";

const createRootReducer = (history) => combineReducers({
    router: connectRouter(history),
    data: dataReducer,
    liveData: liveDataReducer
});

export default createRootReducer;
