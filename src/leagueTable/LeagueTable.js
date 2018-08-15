import React, {Component} from 'react';
import '../App.css';
import './LeagueTable.css';
import Dialog from 'material-ui/Dialog';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import {dataz, currentRound, leagueStandings} from "../App.js";
import {SelectBox, players, allRounds} from '../utils.js';
import {customContentStyle} from '../matches/Kamper.js';
import {
    calculateStats, normalFact, makeMultipleResultsRows,
    makeMultipleResultsRowsWithSameScore
} from "../funfacts/Funfacts";

function makeRow(rank, teamAndManager, gwPoints, totalPoints, extraClassname = "") {
    return (
        <div className={"tabellRad" + extraClassname}>
            <div className="tableRank">{rank}</div>
            <div className="tableTeamAndManager">{teamAndManager}</div>
            <div className="tableGwScore">{gwPoints}</div>
            <div className="tableTotalScore">{totalPoints}</div>
        </div>
    )
}

class LeagueTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRound: null,
            selectedRoundDialog: null,
            dialogOpen: false,
            dialogPlayer: null

        };
        this.toggleDialog = this.toggleDialog.bind(this);
    };

    toggleDialog = (playerId) => {
        this.setState({
            dialogOpen: !this.state.dialogOpen,
            dialogPlayer: playerId,
            selectedRoundDialog: playerId ? this.state.selectedRoundDialog : null,
        });
    };

    changeSelectedRoundDialog() {
        this.setState({
            selectedRoundDialog: document.getElementsByName('selectBoxDialog')[0].value
        })
    };

    render() {
        let that = this;
        const actions = [
            <FlatButton
                label="Lukk"
                primary={true}
                onClick={() => this.toggleDialog(null)}
            />,
        ];
        const managerName = dataz[this.state.dialogPlayer] ? dataz[this.state.dialogPlayer].managerName : '';
        const statsOnPlayer = this.state.dialogPlayer ? calculateStats(this.state.selectedRoundDialog || this.state.selectedRound || currentRound, [this.state.dialogPlayer]) : null;

        const totalHits = statsOnPlayer && statsOnPlayer.mostTotalHitsTaken &&
            ( statsOnPlayer.mostTotalHitsTaken.length === 0 ? ['0p', 12345] : ['-' + statsOnPlayer.mostTotalHitsTaken[0][0] + 'p', statsOnPlayer.mostTotalHitsTaken[0][1]]);
        return (
            <div key="jallajalla" className="table-content">
                {makeRow('', 'Lag', 'GW', 'TOT', 'Header')}
                {leagueStandings.map(function (team) {
                    const teamAndManager = (
                        <div className="teamName">
                            <a onClick={() => that.toggleDialog(team.entry)}>
                                {team.entry_name}<br/>
                                <div className="managerName">{team.player_name}</div>
                            </a>
                        </div>
                    );
                    return makeRow(
                        team.rank,
                        teamAndManager,
                        team.event_total,
                        team.total,
                    );
                })}
                <MuiThemeProvider>
                    <Dialog
                        title={players[this.state.dialogPlayer] + ' - ' + managerName}
                        actions={actions}
                        modal={false}
                        open={this.state.dialogOpen}
                        onRequestClose={() => this.toggleDialog(null)}
                        contentStyle={customContentStyle}
                        autoScrollBodyContent={true}
                    >
                        {statsOnPlayer &&
                        <div className="dialog-content">
                            <div className="ff-round-facts">
                                <div className="ff-facts-header">
                                    Stats
                                    runde {this.state.selectedRoundDialog || this.state.selectedRound || currentRound}</div>
                                {SelectBox(allRounds, this.changeSelectedRoundDialog.bind(this), '', 'Dialog')}
                                {makeMultipleResultsRowsWithSameScore('Score', statsOnPlayer.highestRoundScore, true)}
                                {makeMultipleResultsRowsWithSameScore('Poeng på benken', statsOnPlayer.mostPointsOnBench, true)}
                                {normalFact('Klatring i ligaen', statsOnPlayer.highestLeagueClimber, true)}
                                {normalFact('Fall i ligaen', statsOnPlayer.largestLeageDrop, true)}
                                {makeMultipleResultsRows('Brukt chips', statsOnPlayer.chipsUsed, true)}
                                {makeMultipleResultsRows('Tatt hit', statsOnPlayer.hitsTaken, true)}
                            </div>
                            <div className="ff-total-facts">
                                <div className="ff-facts-header">Stats totalt</div>
                                {makeMultipleResultsRowsWithSameScore('Antall bytter', statsOnPlayer.mostTransfersUsed, true)}
                                {normalFact('Hits tatt', totalHits, true)}
                                {makeMultipleResultsRowsWithSameScore('Poeng på benken', statsOnPlayer.mostTotalPointsOnBench, true)}
                            </div>
                        </div>
                        }
                    </Dialog>
                </MuiThemeProvider>
            </div>
        );
    }
}

export default LeagueTable;
