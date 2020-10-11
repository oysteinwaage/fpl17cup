import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import './Transfers.css';
import {updateIsLoadingData} from '../actions/actions';
import {roundsUpTilNow, SelectBox} from '../utils.js';
import {getPlayerScoresFor} from '../api.js';

export let loading = false;
export let transferDiff = {};

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
        const { currentRound } = this.props;
        const selectedRound = document.getElementsByName('selectBox')[0].value;
        if(selectedRound === 'Velg runde'){
            this.setState({
                selectedRound: null
            });
            this.fetchPlayerPoints(currentRound);
        } else {
            this.setState({
                selectedRound: parseInt(selectedRound)
            });
            this.fetchPlayerPoints(parseInt(selectedRound));
        }
    };

    // TODO flytt ut herfra og inn i initial-data-opphenting. Hent da samtidig opp alt som trengs for alle runder frem til gjeldende
    fetchPlayerPoints(round) {
        const { transferlist, onUpdateIsLoadingData } = this.props;
        let that = this;
        if (round) {
            loading = true;
            onUpdateIsLoadingData(true);
            let temp = transferlist.reduce(function (prev, curr) {
                prev.push(...curr.reduce((p, c) => {
                    if (c.event === round) p.push(c.element_out, c.element_in);
                    return p;
                }, []));
                return prev;
            }, []);
            getPlayerScoresFor([...new Set(temp)])
                .then(points => {
                    loading = false;
                    onUpdateIsLoadingData(false);
                    that.setState({playerPoints: points})
                })
                .catch(error => {
                    onUpdateIsLoadingData(false);
                    loading = false;
                    console.log('Error getPlayerScoresFor: ', error)
                });
        }
    }

    getSelectedRound() {
        return this.state.selectedRound || this.props.currentRound;
    }

    transfersForTeamAndRound(teamId, round) {
        const { players, dataz, roundStats } = this.props;
        const pp = this.state.playerPoints;
        const fplPlayers = roundStats.allPlayers;
        if (teamId && round && pp && !loading) {
            let totalPointsIn = 0;
            let totalPointsOut = 0;
            const roundId = 'round' + round;
            const transfers = dataz[teamId][roundId] ? dataz[teamId][roundId].transfers : [];
            const transfersForTeam = transfers && transfers.map(t => {
                const pointsIn = pp[t[0]].find(s => s.round === round).total_points;
                const pointsOut = pp[t[1]].find(s => s.round === round).total_points;
                totalPointsIn += pointsIn;
                totalPointsOut += pointsOut;
                const transferDiffClassname = `row-transfer-diff${pointsIn - pointsOut > 0 ? '-pluss' : pointsIn - pointsOut < 0 ? '-minus' : ''}`;
                return (
                    <div key={teamId + round + t} className={`transfer-row ${transferDiffClassname}`}>
                        <div key={teamId + round + t + 'in'} className="transfer-player">
                            {fplPlayers[t[0]].web_name + ' (' + pointsIn + 'p)'}
                        </div>
                        <div key={teamId + round + t + 'out'} className="transfer-player">
                            {fplPlayers[t[1]].web_name + ' (' + pointsOut + 'p)'}
                        </div>
                        <div key={teamId + round + t + 'time'} className="transfer-player-time">
                            {t[2]}
                        </div>

                    </div>
                )
            });
            const diff = totalPointsIn - totalPointsOut;
            transferDiff = {
                ...transferDiff,
                [teamId]: {
                    ...transferDiff[teamId],
                    [round]: diff
                }
            };

            return teamId && round && transfers && (
                <div key={teamId} className="transfer-container">
                    <div className="transfer-team">
                        {players[teamId]}
                        <span className={`transfer-diff${diff > 0 ? '-pluss' : diff < 0 ? '-minus' : ''}`}>
                            {` ( ${diff > 0 ? '+' : diff < 0 ? '-' : ''}${Math.abs(diff)}p )`}
                        </span>
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
            );
        }
        return null;
    }

    render() {
        const { currentRound, managerIds } = this.props;
        const chosenRound = this.getSelectedRound();
        if (this.state.playerPoints === null && !loading) {
            this.fetchPlayerPoints(chosenRound);
        }
        return (
            <div className="transfer-content">
                <div className="transfer-header"> {(chosenRound === currentRound && chosenRound !== null) && 'Runde ' + chosenRound}</div>
                {SelectBox(roundsUpTilNow(currentRound), this.changeSelectedRound.bind(this))}
                {managerIds.map(teamId => {
                    return this.transfersForTeamAndRound(teamId, chosenRound);
                })}
            </div>
        );
    }
}

Transfers.propTypes = {
    players: PropTypes.object,
    currentRound: PropTypes.number,
    managerIds: PropTypes.array,
    transferlist: PropTypes.array,
    dataz: PropTypes.object,
    roundStats: PropTypes.object,
    onUpdateIsLoadingData: PropTypes.func
};

const mapStateToProps = state => ({
    players: state.data.players,
    currentRound: state.data.currentRound,
    managerIds: state.data.managerIds,
    transferlist: state.data.transferlist,
    dataz: state.data.dataz,
    roundStats: state.data.roundStats
});

const mapDispatchToProps = dispatch => ({
    onUpdateIsLoadingData: (isLoading) => dispatch(updateIsLoadingData(isLoading)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Transfers);
