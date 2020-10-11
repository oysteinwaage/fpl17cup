import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router';
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
        <Login />
        <div className="content">
          <Switch>
              <Route path="/kamper" component={Kamper} />
              <Route path="/grupper" component={Grupper} />
              <Route exact path="/funfacts" component={Funfacts} />
              <Route path="/transfers" component={Transfers} />
              <Route path="/leaguetable" component={LeagueTable} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
