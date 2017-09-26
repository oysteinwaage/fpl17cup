import React, {Component} from 'react';
import './Matches.css';
import {MatchesForGroup} from './Runder.js';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {selectedRound: 3};
    };

    changeSelectedRound() {
        this.state.selectedRound = document.getElementsByName('selectBox')[0].value;
        this.forceUpdate();
    };

    render() {
        return (
            <div>
                <label> Velg runde: </label>
                <select className='select_style' name="selectBox" id="selectBox"
                        onChange={this.changeSelectedRound.bind(this)}>
                    <option value="3">3</option>
                    <option value="5">5</option>
                    <option value="7">7</option>
                    <option value="9">9</option>
                    <option value="11">11</option>
                    <option value="13">13</option>
                    <option value="15">15</option>
                    <option value="17">17</option>
                    <option value="19">19</option>
                </select>
                <h2>{'Runde ' + this.state.selectedRound}</h2>
                <MatchesForGroup chosenRound={this.state.selectedRound}/>
            </div>
        );
    }
}

export default App;