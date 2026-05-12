import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import {SelectBox} from '../utils.js';
import {
    calculateStats, normalFact, makeMultipleResultsRows,
    makeMultipleResultsRowsWithSameScore
} from "../funfacts/Funfacts";
import {showTeamsStatsModalFor} from "../actions/actions";
import {roundsUpTilNow} from "../utils";

class TeamStatsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRoundDialog: null,

        };
        this.toggleDialog = this.toggleDialog.bind(this);
    };

    toggleDialog = (playerId) => {
        this.props.onShowTeamStatsModal(playerId);
        this.setState({
            selectedRoundDialog: playerId ? this.state.selectedRoundDialog : null,
        });
    };

    changeSelectedRoundDialog() {
        this.setState({
            selectedRoundDialog: document.getElementsByName('selectBoxDialog')[0].value
        })
    };

    render() {
        const {players, currentRound, dataz, onShowTeamStatsModal, chosenTeamIdForModal} = this.props;
        if (!chosenTeamIdForModal) {
            return <React.Fragment/>;
        }

        const managerName = dataz[chosenTeamIdForModal] ? dataz[chosenTeamIdForModal].managerName : '';
        const statsOnPlayer = chosenTeamIdForModal ?
            calculateStats(this.state.selectedRoundDialog || currentRound, [chosenTeamIdForModal], null, null, currentRound, dataz)
            : null;

        const totalHits = statsOnPlayer && statsOnPlayer.mostTotalHitsTaken &&
            (statsOnPlayer.mostTotalHitsTaken.length === 0 ? ['0p', 12345] : ['-' + statsOnPlayer.mostTotalHitsTaken[0][0] + 'p', statsOnPlayer.mostTotalHitsTaken[0][1]]);
        return (
            <Dialog
                open={!!chosenTeamIdForModal}
                onClose={() => onShowTeamStatsModal(null)}
                scroll="paper"
                slotProps={{ paper: { style: customContentStyle } }}
            >
                <DialogTitle>{players[chosenTeamIdForModal] + ' - ' + managerName}</DialogTitle>
                <DialogContent>
                    {statsOnPlayer &&
                    <div className="dialog-content">
                        <div className="ff-round-facts">
                            <div className="ff-facts-header">
                                Stats
                                runde {this.state.selectedRoundDialog || currentRound}</div>
                            {SelectBox(roundsUpTilNow(currentRound), this.changeSelectedRoundDialog.bind(this), '', 'Dialog')}
                            {makeMultipleResultsRowsWithSameScore('Score', statsOnPlayer.highestRoundScore, players, true)}
                            {makeMultipleResultsRowsWithSameScore('Poeng på benken', statsOnPlayer.mostPointsOnBench, players, true)}
                            {normalFact('Klatring i ligaen', statsOnPlayer.highestLeagueClimber, players, true)}
                            {normalFact('Fall i ligaen', statsOnPlayer.largestLeageDrop, players, true)}
                            {makeMultipleResultsRows('Brukt chips', statsOnPlayer.chipsUsed, players, true)}
                            {makeMultipleResultsRows('Tatt hit', statsOnPlayer.hitsTaken, players, true)}
                        </div>
                        <div className="ff-total-facts">
                            <div className="ff-facts-header">Stats totalt</div>
                            {makeMultipleResultsRowsWithSameScore('Antall bytter', statsOnPlayer.mostTransfersUsed, players, true)}
                            {normalFact('Hits tatt', totalHits, players, true)}
                            {makeMultipleResultsRowsWithSameScore('Poeng på benken', statsOnPlayer.mostTotalPointsOnBench, players, true)}
                        </div>
                    </div>
                    }
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={() => onShowTeamStatsModal(null)}>Lukk</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export const customContentStyle = {
    width: '90%',
    maxWidth: 'none',
};

TeamStatsModal.propTypes = {
    players: PropTypes.object,
    dataz: PropTypes.object,
    currentRound: PropTypes.number,
    onShowTeamStatsModal: PropTypes.func,
    chosenTeamIdForModal: PropTypes.number
};

const mapStateToProps = state => ({
    players: state.data.players,
    currentRound: state.data.currentRound,
    dataz: state.data.dataz,
    chosenTeamIdForModal: state.data.showTeamStatsModal
});

const mapDispatchToProps = dispatch => ({
    onShowTeamStatsModal: (teamId) => dispatch(showTeamsStatsModalFor(teamId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TeamStatsModal);
