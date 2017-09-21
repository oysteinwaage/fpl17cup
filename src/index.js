import React from 'react';
import ReactDOM from 'react-dom';
import {Router,Route,IndexRoute, hashHistory} from 'react-router';
import './index.css';
import App from './App';
import Kamper from './Kamper';
import Grupper from './Grupper';
import Funfacts from './Funfacts';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Router history={hashHistory}>
                    <Route path="/" component={App}>
                        <IndexRoute component={Kamper}/>
                        <Route path="grupper" component={Grupper} />
                        <Route path="funfacts" component={Funfacts} />
                    </Route>
                </Router>, document.getElementById('root'));
registerServiceWorker();
