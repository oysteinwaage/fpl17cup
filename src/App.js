import React, {Component} from 'react';
import {Route, Switch} from 'react-router';
import Kamper from './matches/Kamper';
import Grupper from './groups/Groups';
import Funfacts from './funfacts/Funfacts';
import Transfers from './transfers/Transfers';
import LeagueTable from './leagueTable/LeagueTable';
import Login from './Login';

class App extends Component {

    render() {
        return (
            <div className="App">
                <Login/>
                <div className="content">
                    <Switch>
                        <Route path="/kamper" component={Kamper}/>
                        <Route path="/grupper" component={Grupper}/>
                        <Route exact path="/funfacts" component={Funfacts}/>
                        <Route path="/transfers" component={Transfers}/>
                        <Route path="/leaguetable" component={LeagueTable}/>
                    </Switch>
                </div>
                <footer className="footer">
                    All data collected from <a href="https://www.premierleague.com">www.premierleague.com</a>
                    <br/>
                    Check out their <a href="https://www.premierleague.com/terms-and-conditions">Terms and
                    conditions</a>
                </footer>
            </div>
        );
    }
}

export default App;
