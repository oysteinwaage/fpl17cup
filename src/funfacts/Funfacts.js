import React, {Component} from 'react';
import '../App.css';
import './Funfacts.css';
import {SelectBox, roundsUpTilNow, roundJackass} from '../utils.js';
import {roundStats, isForFameAndGloryLeague} from '../Login.js';
import {transferDiff} from '../transfers/Transfers.js';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import LiveDataShown from "../components/liveDataShown";

function tempNullCheck(teamId, dataz) {
    return dataz[teamId] || {};
}

function tempNullCheckRound(teamId, round, dataz) {
    return tempNullCheck(teamId, dataz) && tempNullCheck(teamId, dataz)[round] ? tempNullCheck(teamId, dataz)[round] : {};
}

function hasCaptainPlayed(playerPoints, captainId) {
    return playerPoints[captainId] && playerPoints[captainId].explain[0][0].minutes.value > 0;
}

function calculateCaptainPointsForPlayer(playerPoints, captainData, p) {
    const multiplier = captainData[p].multiplier >= captainData[p].multiplierVice ? captainData[p].multiplier : captainData[p].multiplierVice;
    return hasCaptainPlayed(playerPoints, captainData[p].player) ?
        (playerPoints[captainData[p].player].stats.total_points * multiplier) :
        (playerPoints[captainData[p].vicePlayer].stats.total_points * multiplier);
}

function populateHighestValueListFor(list, value, player) {
    if (list.length === 0 || value > list[0][0]) {
        list = [[value, player]];
    } else if (list.length > 0 && value === list[0][0]) {
        list.push([value, player]);
    }
    return list;
}

function populateLowestValueListFor(list, value, player) {
    if (list.length === 0 || value < list[0][0]) {
        list = [[value, player]];
    } else if (list.length > 0 && value === list[0][0]) {
        list.push([value, player]);
    }
    return list;
}

export function calculateStats(round, managers, playerPoints, captainData, currentRound, dataz) {
    let highestRoundScore = [];
    let lowestRoundScore = [];
    let mostPointsOnBench = [];
    let highestLeagueClimber = [0, ''];
    let largestLeageDrop = [0, ''];
    let mostCaptainPoints = [];
    let lowestCaptainPoints = [];
    let chipsUsed = [];
    let hitsTaken = [];
    let mostTotalPointsOnBench = [];
    let lowestTotalPointsOnBench = [];
    let mostTransfersUsed = [];
    let fewestTransfersUsed = [];
    let mostTotalHitsTaken = [];
    let lowestTotalHitsTaken = [];
    let bestTransferDiff = [];
    let worstTransferDiff = [];
    let bestGlobalRankThisRound = [];
    let worstGlobalRankThisRound = [];
    let bestOverallGlobalRank = [];
    let worstOverallGlobalRank = [];
    let highestSquadValue = [];
    let mostTotalCaptainPoints = [];
    let fewestTotalCaptainPoints = [];
    (managers || []).forEach(function (teamId) {
        const roundNullsafe = tempNullCheckRound(teamId, 'round' + round, dataz);
        const points = roundNullsafe.points;
        const pointsOnBench = roundNullsafe.pointsOnBench;
        const transfersUsed = tempNullCheck(teamId, dataz).totalTransfers;
        const totalPointsOnBench = tempNullCheck(teamId, dataz).totalPointsOnBench;
        const totalHitsTaken = tempNullCheck(teamId, dataz).totalHitsTaken;

        // Captain points: live calculation for current round, pre-computed for historical rounds
        const liveCaptain = captainData[teamId];
        const historicalCaptain = roundNullsafe.captain;
        let captainPoints = null;
        let captainName = null;
        if (liveCaptain && playerPoints && playerPoints[1]) {
            captainPoints = calculateCaptainPointsForPlayer(playerPoints, captainData, teamId);
            if (captainPoints !== null && captainPoints !== undefined) {
                const activeCaptainId = hasCaptainPlayed(playerPoints, liveCaptain.player) ? liveCaptain.player : liveCaptain.vicePlayer;
                captainName = roundStats.allPlayers && roundStats.allPlayers[activeCaptainId] ? roundStats.allPlayers[activeCaptainId].web_name : null;
            }
        } else if (historicalCaptain && historicalCaptain.captainPoints !== null && historicalCaptain.captainPoints !== undefined) {
            captainPoints = historicalCaptain.captainPoints;
            if (historicalCaptain.player && roundStats.allPlayers) {
                captainName = roundStats.allPlayers[historicalCaptain.player] ? roundStats.allPlayers[historicalCaptain.player].web_name : null;
            }
        }

        if (points !== null && points !== undefined) {
            highestRoundScore = populateHighestValueListFor(highestRoundScore, points, teamId);
            lowestRoundScore = populateLowestValueListFor(lowestRoundScore, points, teamId);
        }
        if (pointsOnBench !== null && pointsOnBench !== undefined) {
            mostPointsOnBench = populateHighestValueListFor(mostPointsOnBench, pointsOnBench, teamId);
        }
        if (captainPoints !== null && captainPoints !== undefined && captainName) {
            if (mostCaptainPoints.length === 0 || captainPoints > mostCaptainPoints[0][0]) {
                mostCaptainPoints = [[captainPoints, teamId, captainName]];
            } else if (mostCaptainPoints.length > 0 && captainPoints === mostCaptainPoints[0][0]) {
                mostCaptainPoints.push([captainPoints, teamId, captainName]);
            }
            if (lowestCaptainPoints.length === 0 || captainPoints < lowestCaptainPoints[0][0]) {
                lowestCaptainPoints = [[captainPoints, teamId, captainName]];
            } else if (lowestCaptainPoints.length > 0 && captainPoints === lowestCaptainPoints[0][0]) {
                lowestCaptainPoints.push([captainPoints, teamId, captainName])
            }
        }
        if (roundNullsafe.chipsPlayed) {
            chipsUsed.push([teamId, roundNullsafe.chipsPlayed.chipName]);
        }
        if (roundNullsafe.takenHit > 0) {
            hitsTaken.push([teamId, '-' + roundNullsafe.takenHit + 'p']);
        }
        if (round + '' === currentRound + '') {
            const leagueClimb = tempNullCheck(teamId, dataz).leagueClimb;
            if (leagueClimb > highestLeagueClimber[0]) {
                highestLeagueClimber[0] = leagueClimb;
                highestLeagueClimber[1] = teamId;
            } else if (leagueClimb < largestLeageDrop[0]) {
                largestLeageDrop[0] = leagueClimb;
                largestLeageDrop[1] = teamId;
            }
        }

        if (totalPointsOnBench !== null && totalPointsOnBench !== undefined) {
            mostTotalPointsOnBench = populateHighestValueListFor(mostTotalPointsOnBench, totalPointsOnBench, teamId);
            lowestTotalPointsOnBench = populateLowestValueListFor(lowestTotalPointsOnBench, totalPointsOnBench, teamId);
        }
        if (transferDiff && Object.keys(transferDiff).length && transferDiff[teamId][round]) {
            bestTransferDiff = populateHighestValueListFor(bestTransferDiff, transferDiff[teamId][round], teamId);
            worstTransferDiff = populateLowestValueListFor(worstTransferDiff, transferDiff[teamId][round], teamId);
        }
        if (totalHitsTaken !== null && totalHitsTaken !== undefined) {
            mostTotalHitsTaken = populateHighestValueListFor(mostTotalHitsTaken, totalHitsTaken, teamId);
            lowestTotalHitsTaken = populateLowestValueListFor(lowestTotalHitsTaken, totalHitsTaken, teamId);
        }
        if (transfersUsed !== null && transfersUsed !== undefined) {
            mostTransfersUsed = populateHighestValueListFor(mostTransfersUsed, transfersUsed, teamId);
            fewestTransfersUsed = populateLowestValueListFor(fewestTransfersUsed, transfersUsed, teamId);
        }

        const gwRank = roundNullsafe.gwRank;
        if (gwRank && gwRank > 0) {
            bestGlobalRankThisRound = populateLowestValueListFor(bestGlobalRankThisRound, gwRank, teamId);
            worstGlobalRankThisRound = populateHighestValueListFor(worstGlobalRankThisRound, gwRank, teamId);
        }
        const currentRank = tempNullCheck(teamId, dataz).currentOverallRank;
        if (currentRank && currentRank > 0) {
            bestOverallGlobalRank = populateLowestValueListFor(bestOverallGlobalRank, currentRank, teamId);
            worstOverallGlobalRank = populateHighestValueListFor(worstOverallGlobalRank, currentRank, teamId);
        }
        const currentSquadValue = tempNullCheck(teamId, dataz).currentSquadValue;
        if (currentSquadValue && currentSquadValue > 0) {
            highestSquadValue = populateHighestValueListFor(highestSquadValue, currentSquadValue, teamId);
        }

        let totalCapPoints = 0;
        let hasAnyCaptainData = false;
        Object.keys(tempNullCheck(teamId, dataz)).filter(k => k.startsWith('round')).forEach(roundKey => {
            const rd = tempNullCheck(teamId, dataz)[roundKey];
            if (rd.captain && rd.captain.captainPoints !== null && rd.captain.captainPoints !== undefined) {
                totalCapPoints += rd.captain.captainPoints;
                hasAnyCaptainData = true;
            }
        });
        if (hasAnyCaptainData) {
            mostTotalCaptainPoints = populateHighestValueListFor(mostTotalCaptainPoints, totalCapPoints, teamId);
            fewestTotalCaptainPoints = populateLowestValueListFor(fewestTotalCaptainPoints, totalCapPoints, teamId);
        }
    });
    highestLeagueClimber[0] = convertForView(highestLeagueClimber, dataz);
    largestLeageDrop[0] = convertForView(largestLeageDrop, dataz);
    hitsTaken.sort(function (a, b) {
        return b[1].slice(1, -1) - a[1].slice(1, -1);
    });
    return {
        highestRoundScore,
        lowestRoundScore,
        mostPointsOnBench,
        mostTotalPointsOnBench,
        lowestTotalPointsOnBench,
        mostTotalHitsTaken,
        lowestTotalHitsTaken,
        mostTransfersUsed,
        fewestTransfersUsed,
        highestLeagueClimber,
        largestLeageDrop,
        mostCaptainPoints,
        lowestCaptainPoints,
        bestTransferDiff,
        worstTransferDiff,
        chipsUsed,
        hitsTaken,
        bestGlobalRankThisRound,
        worstGlobalRankThisRound,
        bestOverallGlobalRank,
        worstOverallGlobalRank,
        highestSquadValue,
        mostTotalCaptainPoints,
        fewestTotalCaptainPoints,
    }
}

function convertForView(data, dataz) {
    return tempNullCheck(data[1], dataz).lastRoundLeagueRank + ' => ' + tempNullCheck(data[1], dataz).leagueRank;
}

class Funfacts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRound: props.currentRound,
        };
    };

    changeSelectedRound() {
        this.setState({ selectedRound: document.getElementsByName('selectBox')[0].value });
    };

    render() {
        const {currentRound, managerIds, dataz, players, isCurrentRoundFinished, liveScore} = this.props;
        const {selectedRound} = this.state;
        const playerPoints = null;
        const captainData = {};

        if (!isCurrentRoundFinished) {
            managerIds.forEach(id => {
                dataz[id]['round' + currentRound].points = liveScore[id] && liveScore[id].totalPoints;
                dataz[id]['round' + currentRound].pointsOnBench = liveScore[id] && liveScore[id].benchPoints;
            })
        }

        let score = calculateStats(selectedRound, managerIds, playerPoints, captainData, currentRound, dataz);
        let totalHits = score.mostTotalHitsTaken || [];
        if (totalHits[0]) {
            totalHits[0] = ['-' + score.mostTotalHitsTaken[0][0] + 'p', score.mostTotalHitsTaken[0][1]];
        }
        let totalFewestHits = score.lowestTotalHitsTaken || [];
        if (totalFewestHits[0]) {
            totalFewestHits[0] = [score.lowestTotalHitsTaken[0][0] === 0 ? 0 + 'p' : '-' + score.lowestTotalHitsTaken[0][0] + 'p', score.lowestTotalHitsTaken[0][1]];
        }
        const roundJackasText = roundJackass['round' + selectedRound];
        const disclaimerText = "(Pr. nå er alt utenom endring i ligaplassering live for valgt runde. Stats totalt er ikke live)";
        return (
            <div className="table-content">
                {!isCurrentRoundFinished && currentRound == this.state.selectedRound && <LiveDataShown text={disclaimerText}/> }
                <div className="ff-content-container">
                    {(!roundJackasText || !isForFameAndGloryLeague()) && false &&
                    <p style={{'textAlign': 'center', 'fontSize': 'small', 'width': '100%'}}>(Kun kapteinspoeng
                        oppdateres
                        live, resten oppdateres når FPL oppdaterer sine data)</p>
                    }
                    {roundJackasText && isForFameAndGloryLeague() &&
                    <div className="ff-rundens-smell">
                        <div className="ff-rundens-smell-header">Velkommen folkens!!</div>
                        <div className="ff-rundens-smell-content"><span
                            dangerouslySetInnerHTML={{__html: roundJackasText}}/></div>
                        <div className="ff-rundens-smell-signature"> Koz&Klemz Mr. Waage</div>
                    </div>
                    }
                    <div className="ff-round-facts">
                        <div className="ff-facts-header">Stats runde {selectedRound}</div>
                        {SelectBox(roundsUpTilNow(currentRound), this.changeSelectedRound.bind(this))}
                        {makeMultipleResultsRowsWithSameScore('Høyest score', score.highestRoundScore, players)}
                        {makeMultipleResultsRowsWithSameScore('Lavest score', score.lowestRoundScore, players)}
                        {makeMultipleResultsRowsWithSameScore('Flest poeng på benken', score.mostPointsOnBench, players)}
                        {makeMultipleResultsRowsWithSameScore('Best diff bytter', score.bestTransferDiff, players)}
                        {makeMultipleResultsRowsWithSameScore('Dårligst diff bytter', score.worstTransferDiff, players)}
                        {normalFact('Beste klatrer', score.highestLeagueClimber, players)}
                        {normalFact('Største fall', score.largestLeageDrop, players)}
                        {makeMultipleResultsRowsStacked('Beste GW rank', score.bestGlobalRankThisRound.map(([r, t]) => [r.toLocaleString(), t]), players)}
                        {makeMultipleResultsRowsStacked('Lavest GW rank', score.worstGlobalRankThisRound.map(([r, t]) => [r.toLocaleString(), t]), players)}
                        {makeMultipleResultsRowsWithSameScore('Flest kapteinspoeng', score.mostCaptainPoints, players)}
                        {makeMultipleResultsRowsWithSameScore('Færrest kapteinspoeng', score.lowestCaptainPoints, players)}
                        {makeMultipleResultsRows('Brukt chips', score.chipsUsed, players)}
                        {makeMultipleResultsRows('Tatt hit', score.hitsTaken, players)}
                    </div>
                    <div className="ff-total-facts">
                        <div className="ff-facts-header">Stats totalt</div>
                        {makeMultipleResultsRowsWithSameScore('Flest bytter', score.mostTransfersUsed, players)}
                        {makeMultipleResultsRowsWithSameScore('Færrest bytter', score.fewestTransfersUsed, players)}
                        {makeMultipleResultsRowsWithSameScore('Mest hits tatt', totalHits, players)}
                        {makeMultipleResultsRowsWithSameScore('Minst hits tatt', totalFewestHits, players)}
                        {makeMultipleResultsRowsWithSameScore('Flest poeng på benk', score.mostTotalPointsOnBench, players)}
                        {makeMultipleResultsRowsWithSameScore('Færrest poeng på benk', score.lowestTotalPointsOnBench, players)}
                        {makeMultipleResultsRowsWithSameScore('Mest kapteinspoeng', score.mostTotalCaptainPoints, players)}
                        {makeMultipleResultsRowsWithSameScore('Færrest kapteinspoeng', score.fewestTotalCaptainPoints, players)}
                        {makeMultipleResultsRowsStacked('Best global rank', score.bestOverallGlobalRank.map(([r, t]) => [r.toLocaleString(), t]), players)}
                        {makeMultipleResultsRowsStacked('Lavest global rank', score.worstOverallGlobalRank.map(([r, t]) => [r.toLocaleString(), t]), players)}
                        {makeMultipleResultsRowsStacked('Høyest squad-verdi', score.highestSquadValue.map(([v, t]) => ['£' + (v / 10).toFixed(1) + 'm', t]), players)}
                    </div>
                </div>
            </div>
        );
    }
}

export function makeMultipleResultsRows(text, data, players, onlyScore) {
    return data.length === 0 ? null : (
        <div className={"ff-multiple-results-container"}>
            <div className="ff-normal-fact-text">{text}</div>
            <div className="ff-normal-fact-result">
                {data.map(d => {
                    const text = onlyScore ? d[1] : players[d[0]] + ' (' + d[1] + ')';
                    return (
                        <div key={d[0]} className="ff-multiple-result-facts">
                            {text}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export function makeMultipleResultsRowsWithSameScore(text, data, players, onlyScore = false) {
    let firstRow = true;
    return data.length === 0 ? null : (
        <div className={"ff-multiple-results-container"}>
            <div className="ff-normal-fact-text">{text}</div>
            <div className="ff-normal-fact-result">
                {data.map(d => {
                    const points = firstRow ? d[0] : '';
                    const player = onlyScore ? '' : (players[d[1]] + (d[2] ? ' (' + d[2] + ')' : ''));
                    firstRow = false;
                    return (
                        <div key={d[1] + 'r'} className="ff-multiple-result-facts-2">
                            <div key={d[1] + 'p'} className="ff-multiple-result-facts-points">{points}</div>
                            <div key={d[1] + 'p2'} className="ff-multiple-result-facts-player">{player}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export function makeMultipleResultsRowsStacked(text, data, players) {
    let firstRow = true;
    return data.length === 0 ? null : (
        <div className="ff-multiple-results-container">
            <div className="ff-normal-fact-text">{text}</div>
            <div className="ff-normal-fact-result">
                {data.map(d => {
                    const value = firstRow ? d[0] : '';
                    firstRow = false;
                    return (
                        <div key={d[1] + 'r'} className="ff-multiple-result-facts-2-stacked">
                            <div>{value}</div>
                            <div>{players[d[1]]}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export function normalFact(text, data, players, onlyScore) {
    const teamName = onlyScore ? '' : ' (' + players[data[1]] + ')';
    return data[1] && (
        <div className={"ff-normal-fact-container"}>
            <div className="ff-normal-fact-text">{text}</div>
            <div className="ff-normal-fact-result">
                {data[0] + teamName}
            </div>
        </div>
    )
}

Funfacts.propTypes = {
    players: PropTypes.object,
    dataz: PropTypes.object,
    currentRound: PropTypes.number,
    managerIds: PropTypes.array,
    isCurrentRoundFinished: PropTypes.bool,
    liveScore: PropTypes.object
};

const mapStateToProps = state => ({
    players: state.data.players,
    currentRound: state.data.currentRound,
    managerIds: state.data.managerIds,
    dataz: state.data.dataz,
    isCurrentRoundFinished: state.data.isCurrentRoundFinished,
    liveScore: state.liveData.fplManagersLiveScore
});

export default connect(mapStateToProps)(Funfacts);
