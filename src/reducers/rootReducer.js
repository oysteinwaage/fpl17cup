import { combineReducers } from 'redux';
import dataReducer from './dataReducer';
import liveDataReducer from "./liveDataReducer";

const rootReducer = combineReducers({
    data: dataReducer,
    liveData: liveDataReducer
});

export default rootReducer;
