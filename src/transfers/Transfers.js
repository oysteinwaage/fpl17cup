import React, {Component} from 'react';
import './Transfers.css';
import {SelectBox, allRounds, playerIds, players} from '../utils.js';
import {dataz, currentRound} from '../App.js';

class Transfers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRound: null,
        };
    };

    changeSelectedRound() {
        this.setState({
            selectedRound: document.getElementsByName('selectBox')[0].value
        })
    };

    render() {
        const chosenRound = this.state.selectedRound || currentRound;
        return (
            <div>
                <div className="transfer-header"> {chosenRound === currentRound &&  'Runde ' + chosenRound}</div>
                {SelectBox(allRounds, this.changeSelectedRound.bind(this))}
                {/*<MuiThemeProvider>*/}
                {/*{MakeDropDownMenu(participatingRounds, this.state.selectedRound, this.changeSelectedRoundUi.bind(this))}*/}
                {/*</MuiThemeProvider>*/}
                <p>Her kommer plutselig en (forståelig) oversikt over hvilke spillere folk har byttet hver runde!</p>
                {playerIds.map(player => {
                    return transfersForTeamAndRound(player, chosenRound);
                })}
            </div>
        );
    }
}

function transfersForTeamAndRound(teamId, round) {
    if (teamId && round) {
        const roundId = 'round' + round;
        const transfersOut = dataz[teamId][roundId].transfersOut;
        const transfersIn = dataz[teamId][roundId].transfersIn;
        return teamId && round && (
                <div key={teamId} className="transfer-container">
                    <div className="transfer-team">{players[teamId]}</div>
                    <div className="transfer-transferlist-out">
                        {transfersOut && transfersOut.map(t => {
                            return <div key={teamId + round + t}
                                        className="transfer-player-out">{'SpillerId ut: ' + t[0] + ' - ' + t[1]}</div>
                        })}
                    </div>
                    <div className="transfer-transferlist-in">
                        {transfersIn && transfersIn.map(t => {
                            return <div key={teamId + round + t}
                                        className="transfer-player-in">{'SpillerId inn: ' + t[0] + ' - ' + t[1]}</div>
                        })}
                    </div>
                </div>
            );
    }
    return null;
}

export default Transfers;
