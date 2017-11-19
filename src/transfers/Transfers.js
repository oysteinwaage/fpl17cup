import React, {Component} from 'react';
import $ from 'jquery';
import './Transfers.css';
import {SelectBox, allRounds, players} from '../utils.js';
import {dataz, currentRound, fplPlayers, loadedPlayerIds} from '../App.js';

class Transfers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRound: null,
            playerPoints: null,
        };
        this.fetchPlayerPoints = this.fetchPlayerPoints.bind(this);
        this.transfersForTeamAndRound = this.transfersForTeamAndRound.bind(this);
    };

    changeSelectedRound() {
        this.setState({
            selectedRound: document.getElementsByName('selectBox')[0].value
        })
        this.fetchPlayerPoints(document.getElementsByName('selectBox')[0].value);
    };

    fetchPlayerPoints(round) {
        let that = this;
        if (round) {
            $.get("/api/playerscores?round=" + round).done(function (result) {
                that.setState({
                    playerPoints: result,
                })
            });
        }
    }

    getSelectedRound() {
        return this.state.selectedRound || currentRound;
    }

    transfersForTeamAndRound(teamId, round) {
        const pp = this.state.playerPoints;
        if (teamId && round && pp) {
            let totalPointsIn = 0;
            let totalPointsOut = 0;
            const roundId = 'round' + round;
            const transfers = dataz[teamId][roundId] ? dataz[teamId][roundId].transfers : [];
            const transfersForTeam = transfers && transfers.map(t => {
                const pointsIn = pp[t[0]].stats.total_points;
                const pointsOut = pp[t[1]].stats.total_points;
                totalPointsIn += pointsIn;
                totalPointsOut += pointsOut;
                return (
                    <div key={teamId + round + t} className="transfer-row">
                        <div key={teamId + round + t + 'in'} className="transfer-player">
                            {fplPlayers[t[0] - 1].web_name + ' (' + pointsIn + 'p)'}
                        </div>
                        <div key={teamId + round + t + 'out'} className="transfer-player">
                            {fplPlayers[t[1] - 1].web_name + ' (' +pointsOut + 'p)'}
                        </div>
                        <div key={teamId + round + t + 'time'} className="transfer-player-time">
                            {t[2]}
                        </div>

                    </div>
                )
            })
            return teamId && round && transfers && (
                <div key={teamId} className="transfer-container">
                    <div className="transfer-team">{players[teamId]}</div>
                    <div className="transfer-transferlist">
                        <div className="transfer-row">
                            <div className="transfer-player">{'Inn (' + totalPointsIn + 'p)'}</div>
                            <div className="transfer-player">{'Ut (' + totalPointsOut + 'p)'}</div>
                            <div className="transfer-player-time">Tidspunkt</div>
                        </div>
                        {transfersForTeam}
                    </div>
                </div>
            );
        }
        return null;
    }

    render() {
        const chosenRound = this.getSelectedRound();
        if(this.state.playerPoints === null){
            this.fetchPlayerPoints(chosenRound);
        }
        return (
            <div className="transfer-content">
                <div className="transfer-header"> {(chosenRound === currentRound && chosenRound !== null) && 'Runde ' + chosenRound}</div>
                {SelectBox(allRounds, this.changeSelectedRound.bind(this))}
                {/*<MuiThemeProvider>*/}
                {/*{MakeDropDownMenu(participatingRounds, this.state.selectedRound, this.changeSelectedRoundUi.bind(this))}*/}
                {/*</MuiThemeProvider>*/}
                {loadedPlayerIds.map(player => {
                    return this.transfersForTeamAndRound(player, chosenRound);
                })}
            </div>
        );
    }
}

export default Transfers;
