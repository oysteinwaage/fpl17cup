import React, {Component} from 'react';
import {connect} from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import {SelectBox} from '../utils';
import {
    calculateStats, normalFact, makeMultipleResultsRows,
    makeMultipleResultsRowsWithSameScore
} from '../funfacts/Funfacts';
import {showTeamsStatsModalFor} from '../actions/actions';
import {roundsUpTilNow} from '../utils';
import { RootState, DataState } from '../types';

function StatRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="ff-multiple-results-container">
            <div className="ff-normal-fact-text">{label}</div>
            <div className="ff-normal-fact-result">{value}</div>
        </div>
    );
}

interface TeamStatsModalProps {
    players: Record<number, string>;
    dataz: DataState['dataz'];
    currentRound: number | null;
    onShowTeamStatsModal: (teamId: number | null) => void;
    chosenTeamIdForModal: number | null;
}

interface TeamStatsModalState {
    selectedRoundDialog: string | number | null;
}

class TeamStatsModal extends Component<TeamStatsModalProps, TeamStatsModalState> {
    constructor(props: TeamStatsModalProps) {
        super(props);
        this.state = {
            selectedRoundDialog: null,
        };
        this.toggleDialog = this.toggleDialog.bind(this);
    }

    toggleDialog = (playerId: number | null): void => {
        this.props.onShowTeamStatsModal(playerId);
        this.setState({
            selectedRoundDialog: playerId ? this.state.selectedRoundDialog : null,
        });
    };

    changeSelectedRoundDialog(): void {
        const selectEl = document.getElementsByName('selectBoxDialog')[0] as HTMLSelectElement;
        this.setState({
            selectedRoundDialog: selectEl ? selectEl.value : null
        });
    }

    render() {
        const {players, currentRound, dataz, onShowTeamStatsModal, chosenTeamIdForModal} = this.props;
        if (!chosenTeamIdForModal) {
            return <React.Fragment/>;
        }

        const selectedRound = this.state.selectedRoundDialog || currentRound;
        const teamData = dataz[chosenTeamIdForModal] || {};
        const managerName = teamData.managerName || '';
        const roundData: any = teamData['round' + selectedRound] || {};

        const statsOnPlayer = calculateStats(selectedRound!, [chosenTeamIdForModal], null, null, currentRound, dataz);

        const totalHits = statsOnPlayer.mostTotalHitsTaken.length === 0
            ? ['0p', 12345]
            : ['-' + statsOnPlayer.mostTotalHitsTaken[0][0] + 'p', statsOnPlayer.mostTotalHitsTaken[0][1]];

        const captainPoints: number | null = roundData.captain?.captainPoints ?? null;
        const gwRank: number | null = roundData.gwRank ?? null;

        let totalCaptainPoints = 0;
        let hasAnyCaptainData = false;
        Object.keys(teamData).filter(k => k.startsWith('round')).forEach(roundKey => {
            const rd = teamData[roundKey];
            if (rd?.captain && rd.captain.captainPoints != null) {
                totalCaptainPoints += rd.captain.captainPoints;
                hasAnyCaptainData = true;
            }
        });
        const squadValue: number | null = teamData.currentSquadValue ?? null;
        const globalRank: number | null = teamData.currentOverallRank ?? null;

        return (
            <Dialog
                open={!!chosenTeamIdForModal}
                onClose={() => onShowTeamStatsModal(null)}
                scroll="paper"
                slotProps={{ paper: { style: customContentStyle } }}
            >
                <DialogTitle>{players[chosenTeamIdForModal] + ' - ' + managerName}</DialogTitle>
                <DialogContent>
                    <div className="dialog-content">
                        <div className="ff-round-facts">
                            <div className="ff-facts-header">Stats runde {selectedRound}</div>
                            {SelectBox(roundsUpTilNow(currentRound), this.changeSelectedRoundDialog.bind(this), '', 'Dialog')}
                            {makeMultipleResultsRowsWithSameScore('Score', statsOnPlayer.highestRoundScore, players, true)}
                            {makeMultipleResultsRowsWithSameScore('Poeng på benken', statsOnPlayer.mostPointsOnBench, players, true)}
                            {captainPoints != null && <StatRow label="Kapteinspoeng" value={captainPoints + 'p'} />}
                            {gwRank != null && <StatRow label="GW rank" value={gwRank.toLocaleString()} />}
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
                            {hasAnyCaptainData && <StatRow label="Total kapteinspoeng" value={totalCaptainPoints + 'p'} />}
                            {squadValue != null && <StatRow label="Lagets verdi" value={'£' + (squadValue / 10).toFixed(1) + 'm'} />}
                            {globalRank != null && <StatRow label="Global rank" value={globalRank.toLocaleString()} />}
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={() => onShowTeamStatsModal(null)}>Lukk</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export const customContentStyle: React.CSSProperties = {
    width: '90%',
    maxWidth: 'none',
};

const mapStateToProps = (state: RootState) => ({
    players: state.data.players,
    currentRound: state.data.currentRound,
    dataz: state.data.dataz,
    chosenTeamIdForModal: state.data.showTeamStatsModal
});

const mapDispatchToProps = (dispatch: any) => ({
    onShowTeamStatsModal: (teamId: number | null) => dispatch(showTeamsStatsModalFor(teamId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TeamStatsModal);
