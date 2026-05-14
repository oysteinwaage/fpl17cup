import { createStore, compose, applyMiddleware, Store } from 'redux';
import thunk from 'redux-thunk';

import createRootReducer from '../reducers/rootReducer';

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
        __MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__: boolean;
    }
}

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

function configureStore(): Store {
  return createStore(
    createRootReducer(),
    composeEnhancer(applyMiddleware(thunk)),
  );
}

export { configureStore };
