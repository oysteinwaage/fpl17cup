import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';

import createRootReducer from '../reducers/rootReducer';

const history = createBrowserHistory();
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
function configureStore() {
  return createStore(
    createRootReducer(history),
    composeEnhancer(applyMiddleware(routerMiddleware(history), thunk)),
  );
}

export { history, configureStore };
