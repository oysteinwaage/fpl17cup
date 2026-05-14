import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import Funfacts from './funfacts/Funfacts';
import Transfers from './transfers/Transfers';
import LeagueTable from './leagueTable/LeagueTable';
import Login from './Login';

class App extends Component<{}, {}> {
    render() {
        return (
            <div>
                <Login />
                <div className="flex justify-center py-5 bg-gray-50 min-h-[calc(100vh-120px)]">
                    <Switch>
                        <Route exact path="/funfacts"   component={Funfacts} />
                        <Route path="/transfers"        component={Transfers} />
                        <Route path="/leaguetable"      component={LeagueTable} />
                    </Switch>
                </div>
                <footer className="py-3 text-xs text-gray-500 text-center border-t border-gray-200">
                    All data collected from{' '}
                    <a href="https://www.premierleague.com" className="underline hover:text-gray-700">
                        www.premierleague.com
                    </a>
                    {' · '}
                    <a href="https://www.premierleague.com/terms-and-conditions" className="underline hover:text-gray-700">
                        Terms and conditions
                    </a>
                </footer>
            </div>
        );
    }
}

export default App;
