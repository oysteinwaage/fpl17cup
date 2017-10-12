import React, {Component} from 'react';
import './Matches.css';
import Dialog from 'material-ui/Dialog';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import {MatchesForGroup} from './Runder.js';
import {SelectBox, participatingRounds, players, allRounds} from '../utils.js';
import {dataz, currentRound} from "../App.js";
import {calculateStats, normalFact, makeMultipleResultsRows} from "../funfacts/Funfacts";

class Kamper extends Component {
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

    changeSelectedRound() {
        this.setState({
            selectedRound: document.getElementsByName('selectBox')[0].value
        })
    };

    changeSelectedRoundDialog() {
        this.setState({
            selectedRoundDialog: document.getElementsByName('selectBoxDialog')[0].value
        })
    };

    render() {
        const actions = [
            <FlatButton
                label="Lukk"
                primary={true}
                onClick={() => this.toggleDialog(null)}
            />,
        ];
        const managerName = dataz[this.state.dialogPlayer] ? dataz[this.state.dialogPlayer].managerName : '';
        const statsOnPlayer = this.state.dialogPlayer ? calculateStats(this.state.selectedRoundDialog || this.state.selectedRound || currentRound, [this.state.dialogPlayer]) : null;
        console.log('stats: ', statsOnPlayer);
        const totalHits = statsOnPlayer && ['-' + statsOnPlayer.mostTotalHitsTaken[0] + 'p', statsOnPlayer.mostTotalHitsTaken[1]];
        return (
            <div>
                {/*<h2>{this.state.selectedRound && 'Runde ' + this.state.selectedRound}</h2>*/}
                {SelectBox(participatingRounds, this.changeSelectedRound.bind(this))}
                <MatchesForGroup chosenRound={this.state.selectedRound} onToggleDialog={this.toggleDialog}/>
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
                                    Stats runde {this.state.selectedRoundDialog || this.state.selectedRound || currentRound}</div>
                                {SelectBox(allRounds, this.changeSelectedRoundDialog.bind(this), '', 'Dialog')}
                                {normalFact('Score', statsOnPlayer.highestRoundScore, true)}
                                {normalFact('Poeng på benken', statsOnPlayer.mostPointsOnBench, true)}
                                {normalFact('Klatring i ligaen', statsOnPlayer.highestLeagueClimber, true)}
                                {normalFact('Fall i ligaen', statsOnPlayer.largestLeageDrop, true)}
                                {makeMultipleResultsRows('Brukt chips', statsOnPlayer.chipsUsed, true)}
                                {makeMultipleResultsRows('Tatt hit', statsOnPlayer.hitsTaken, true)}
                            </div>
                            <div className="ff-total-facts">
                                <div className="ff-facts-header">Stats totalt</div>
                                {normalFact('Antall bytter', statsOnPlayer.mostTransfersUsed, true)}
                                {normalFact('Hits tatt', totalHits, true)}
                                {normalFact('Poeng på benken', statsOnPlayer.mostTotalPointsOnBench, true)}
                            </div>
                        </div>
                        }
                    </Dialog>
                </MuiThemeProvider>
            </div>
        );
    }
}

const customContentStyle = {
    width: '90%',
    maxWidth: 'none',
    height: '90%',
    maxHeight: 'none',
};
export default Kamper;
