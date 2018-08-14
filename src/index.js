import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import './index.css';
import App from './App';
import Kamper from './matches/Kamper';
import Grupper from './groups/Groups';
import Funfacts from './funfacts/Funfacts';
import Transfers from './transfers/Transfers';
import LeagueTable from './leagueTable/LeagueTable';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <Route path="kamper" component={Kamper}/>
            <Route path="grupper" component={Grupper}/>
            <IndexRoute component={Funfacts}/>
            <Route path="transfers" component={Transfers}/>
            <Route path="leaguetable" component={LeagueTable}/>
        </Route>
    </Router>, document.getElementById('root'));
registerServiceWorker();
