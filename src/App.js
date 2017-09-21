import React, { Component } from 'react';
import {IndexLink,Link} from 'react-router';
import './App.css';

class App extends Component {
    componentDidMount() {
            fetch('https://fantasy.premierleague.com/drf/entry/1727710/event/5/picks', {
            method: 'GET',
            mode: 'cors',
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(text) {
            console.log('Request successful', text);
        })
        .catch(function(error) {
            console.log('Request failed', error);
        });
    }
  render() {
    return (
        <div>
            <div className="overHeader oh2">
                <h1>For Fame And Glory FPL'17 Cup-O-Rama</h1>
            </div>
            <ul className="header">
                <li><IndexLink to="/" activeClassName="active">Kamper</IndexLink></li>
                <li><Link to="/grupper" activeClassName="active">Grupper</Link></li>
                <li><Link to="/funfacts" activeClassName="active">Funfacts</Link></li>
            </ul>
            <div className="content">
                {this.props.children}
            </div>
        </div>
    );
  }
}

export default App;
