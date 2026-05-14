import React, {Component} from 'react';
import {connect} from 'react-redux';
import './Transfers.css';
import {updateIsLoadingData} from '../actions/actions';
import {roundsUpTilNow, SelectBox} from '../utils';
import {getPlayerScoresFor} from '../api';
import LiveDataShown from '../components/liveDataShown';
import { RootState, DataState, RoundStats } from '../types';

export let loading = false;
export let transferDiff: Record<number, Record<number, number>> = {};

interface TransfersProps {
    players: Record<number, string>;
    currentRound: number | null;
    managerIds: number[];
    transferlist: any[][];
    dataz: DataState['dataz'];
    roundStats: RoundStats;
    onUpdateIsLoadingData: (isLoading: boolean) => void;
    isCurrentRoundFinished: boolean;
}

interface TransfersState {
    selectedRound: number | null;
    playerPoints: any;
}

class Transfers extends Component<TransfersProps, TransfersState> {
    constructor(props: TransfersProps) {
        super(props);
        this.state = {
            selectedRound: null,
            playerPoints: null,
        };
        this.fetchPlayerPoints = this.fetchPlayerPoints.bind(this);
        this.transfersForTeamAndRound = this.transfersForTeamAndRound.bind(this);
    }

    changeSelectedRound(): void {
        const { currentRound } = this.props;
        const selectEl = document.getElementsByName('selectBox')[0] as HTMLSelectElement;
        const selectedRound = selectEl ? selectEl.value : 'Velg runde';
        if (selectedRound === 'Velg runde') {
            this.setState<'selectedRound'>({
                selectedRound: null
            });
            this.fetchPlayerPoints(currentRound);
        } else {
            this.setState<'selectedRound'>({
                selectedRound: parseInt(selectedRound)
            });
            this.fetchPlayerPoints(parseInt(selectedRound));
        }
    }

    fetchPlayerPoints(round: number | null): void {
        const { transferlist, onUpdateIsLoadingData } = this.props;
        if (round) {
            loading = true;
            onUpdateIsLoadingData(true);
            let temp = transferlist.reduce(function (prev: number[], curr: any[]) {
                prev.push(...curr.reduce((p: number[], c: any) => {
                    if (c.event === round) p.push(c.element_out, c.element_in);
                    return p;
                }, []));
                return prev;
            }, []);
            getPlayerScoresFor([...new Set(temp)] as number[])
                .then(points => {
                    loading = false;
                    onUpdateIsLoadingData(false);
                    this.setState<'playerPoints'>({playerPoints: points});
                })
                .catch(error => {
                    onUpdateIsLoadingData(false);
                    loading = false;
                    console.log('Error getPlayerScoresFor: ', error);
                });
        }
    }

    componentDidMount(): void {
        if (this.state.playerPoints === null && !loading) {
            this.fetchPlayerPoints(this.getSelectedRound());
        }
    }

    getSelectedRound(): number | null {
        return this.state.selectedRound || this.props.currentRound;
    }

    transfersForTeamAndRound(teamId: number, round: number | null): React.ReactElement | null {
        const { dataz, roundStats } = this.props;
        const pp = this.state.playerPoints;
        const fplPlayers = (roundStats as any).allPlayers;
        if (teamId && round && pp && !loading) {
            let totalPointsIn = 0;
            let totalPointsOut = 0;
            const roundId = 'round' + round;
            const transfers = dataz[teamId][roundId] ? dataz[teamId][roundId].transfers : [];
            const transfersForTeam = transfers && transfers.map((t: [number, number, string]) => {
                const pointsIn = (pp[t[0]].find((s: any) => s.round === round) || {total_points: 0}).total_points;
                const pointsOut = (pp[t[1]].find((s: any) => s.round === round) || {total_points: 0}).total_points;
                totalPointsIn += pointsIn;
                totalPointsOut += pointsOut;
                const transferDiffClassname = `row-transfer-diff${pointsIn - pointsOut > 0 ? '-pluss' : pointsIn - pointsOut < 0 ? '-minus' : ''}`;
                const tKey = `${t[0]}-${t[1]}`;
                return (
                    <div key={teamId + round + tKey} className={`transfer-row ${transferDiffClassname}`}>
                        <div key={teamId + round + tKey + 'in'} className="transfer-player">
                            {fplPlayers[t[0]].web_name + ' (' + pointsIn + 'p)'}
                        </div>
                        <div key={teamId + round + tKey + 'out'} className="transfer-player">
                            {fplPlayers[t[1]].web_name + ' (' + pointsOut + 'p)'}
                        </div>
                        <div key={teamId + round + tKey + 'time'} className="transfer-player-time">
                            {t[2]}
                        </div>
                    </div>
                );
            });
            const diff = totalPointsIn - (totalPointsOut + (dataz[teamId][roundId].takenHit || 0));
            transferDiff = {
                ...transferDiff,
                [teamId]: {
                    ...transferDiff[teamId],
                    [round]: diff
                }
            };

            return teamId && round && transfers ? (
                <div key={teamId} className="transfer-container">
                    <div className="transfer-team">
                        {dataz[teamId].name}
                        <span className={`transfer-diff${diff > 0 ? '-pluss' : diff < 0 ? '-minus' : ''}`}>
                            {` ( ${diff > 0 ? '+' : diff < 0 ? '-' : ''}${Math.abs(diff)}p )`}
                        </span>
                        <br />
                        <div className="subName">{dataz[teamId].managerName}</div>
                    </div>
                    <div className="transfer-transferlist">
                        <div className={`transfer-header-row`}>
                            <div className="transfer-player-header">{'Inn (' + totalPointsIn + 'p)'}</div>
                            <div className="transfer-player-header">{'Ut (' + totalPointsOut + 'p)'}</div>
                            <div className="transfer-player-time">Tidspunkt</div>
                        </div>
                        {transfersForTeam}
                    </div>
                </div>
            ) : null;
        }
        return null;
    }

    render() {
        const { currentRound, managerIds, isCurrentRoundFinished } = this.props;
        const chosenRound = this.getSelectedRound();
        return (
            <div className="transfer-content">
                { !isCurrentRoundFinished && <LiveDataShown /> }
                <div className="transfer-header"> {(chosenRound === currentRound && chosenRound !== null) && 'Runde ' + chosenRound}</div>
                {SelectBox(roundsUpTilNow(currentRound), this.changeSelectedRound.bind(this))}
                <div className="subName sentrér">(Alle poeng for total differanse inkluderer potensielle minuspoeng for hits)</div>
                {managerIds.map(teamId => {
                    return this.transfersForTeamAndRound(teamId, chosenRound);
                })}
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    players: state.data.players,
    currentRound: state.data.currentRound,
    managerIds: state.data.managerIds,
    transferlist: state.data.transferlist,
    dataz: state.data.dataz,
    roundStats: state.data.roundStats,
    isCurrentRoundFinished: state.data.isCurrentRoundFinished,
});

const mapDispatchToProps = (dispatch: any) => ({
    onUpdateIsLoadingData: (isLoading: boolean) => dispatch(updateIsLoadingData(isLoading)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Transfers);
