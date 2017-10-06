import React, {Component} from 'react';
import './Matches.css';
import {MatchesForGroup} from './Runder.js';
import {SelectBox, participatingRounds} from '../utils.js';


class Kamper extends Component {
    constructor(props) {
        super(props);
        this.state = {selectedRound: null};
    };

    changeSelectedRound() {
        this.setState({
            selectedRound: document.getElementsByName('selectBox')[0].value
        })
    };

    render() {
        return (
            <div>
                {/*<h2>{this.state.selectedRound && 'Runde ' + this.state.selectedRound}</h2>*/}
                {SelectBox(participatingRounds, this.changeSelectedRound.bind(this))}
                <MatchesForGroup chosenRound={this.state.selectedRound}/>
            </div>
        );
    }
}

export default Kamper;
