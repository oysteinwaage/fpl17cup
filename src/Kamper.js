import React, {Component} from 'react';
import './App.css';
import {Match} from './utils.js'
import {MatchesForGroup} from './Runder.js';

class App extends Component {
    render() {
        return (
            <div>

                <h2>Runde X</h2>
                <p>Her skal kamper for valgt runde ligge</p>
                <MatchesForGroup round={3}/>
            </div>
        );
    }
}

export default App;
