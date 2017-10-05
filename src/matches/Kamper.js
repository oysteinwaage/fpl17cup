import React, {Component} from 'react';
import './Matches.css';
import {MatchesForGroup} from './Runder.js';


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
                <div className='selectBoxContainer'>
                    <select className='select_style' name="selectBox" id="selectBox"
                            onChange={this.changeSelectedRound.bind(this)}>
                        <option value={null}>Velg runde</option>
                        <option value="3">Runde 3</option>
                        <option value="5">Runde 5</option>
                        <option value="7">Runde 7</option>
                        <option value="9">Runde 9</option>
                        <option value="11">Runde 11</option>
                        <option value="13">Runde 13</option>
                        <option value="15">Runde 15</option>
                        <option value="17">Runde 17</option>
                        <option value="19">Runde 19</option>
                        <option value="21">Runde 21</option>
                    </select>
                </div>
                <MatchesForGroup chosenRound={this.state.selectedRound}/>
            </div>
        );
    }
}

export default Kamper;
