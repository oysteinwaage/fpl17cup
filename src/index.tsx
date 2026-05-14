import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Analytics } from '@vercel/analytics/react';
import './index.css';
import App from './App';
import { configureStore } from './store/configureStore';

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

const store = configureStore();
const root = createRoot(document.getElementById('root')!);
root.render(
    <Provider store={store}>
        <BrowserRouter>
            <Route path="/" component={App} />
        </BrowserRouter>
        <Analytics />
    </Provider>,
);
// registerServiceWorker();
