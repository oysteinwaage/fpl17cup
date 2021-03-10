import React from 'react';
import ReactDOM from 'react-dom';
import { Route } from 'react-router';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import './index.css';
import App from './App';
import { configureStore, history } from './store/configureStore';
window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

const store = configureStore();
ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <Route path="/" component={App} />
        </ConnectedRouter>
    </Provider>, document.getElementById('root'),
);
// registerServiceWorker();
