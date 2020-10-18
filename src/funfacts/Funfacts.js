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
    (managers || []).forEach(function (teamId) {
        const roundNullsafe = tempNullCheckRound(teamId, 'round' + round, dataz);
        const points = roundNullsafe.points;
        const pointsOnBench = roundNullsafe.pointsOnBench;
        const transfersUsed = tempNullCheck(teamId, dataz).totalTransfers;
        const totalPointsOnBench = tempNullCheck(teamId, dataz).totalPointsOnBench;
        const totalHitsTaken = tempNullCheck(teamId, dataz).totalHitsTaken;
        const captainPoints = playerPoints && playerPoints[1] && captainData[teamId] && calculateCaptainPointsForPlayer(playerPoints, captainData, teamId);

        if (points !== null && points !== undefined) {
            highestRoundScore = populateHighestValueListFor(highestRoundScore, points, teamId);
            lowestRoundScore = populateLowestValueListFor(lowestRoundScore, points, teamId);
        }
        if (pointsOnBench !== null && pointsOnBench !== undefined) {
            mostPointsOnBench = populateHighestValueListFor(mostPointsOnBench, pointsOnBench, teamId);
        }
        if (captainPoints !== null && captainPoints !== undefined) {
            const captainName = hasCaptainPlayed(playerPoints, captainData[teamId].player) ?
                roundStats.allPlayers[captainData[teamId].player - 1].web_name :
                roundStats.allPlayers[captainData[teamId].vicePlayer - 1].web_name;
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
    }
}

function convertForView(data, dataz) {
    return tempNullCheck(data[1], dataz).lastRoundLeagueRank + ' => ' + tempNullCheck(data[1], dataz).leagueRank;
}

class Funfacts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            highestScorePlayer: '?',
            highestRoundScore: '?',
            lowestScorePlayer: '?',
            lowestRoundScore: '?',
            selectedRound: props.currentRound,
            captainData: {},
            playerPoints: null,
        };
        this.fetchCaptainData = this.fetchCaptainData.bind(this);
    };

    // TODO denne må flyttes til Login.js og gjøres ETTER currentRound er satt!
    componentDidMount() {
        // let round = 1;
        // let totalCaptainPoints = {};
        // TODO må hentes via nytt API
        // while (round <= currentRound) {
        //     $.get("/api/captain?round=" + round).done(function (result) {
        //         managerIds.forEach(pId => {
        //             Object.assign(totalCaptainPoints, {
        //                 playerId: pId,
        //                 totalCapPoints: totalCaptainPoints.totalCapPoints + result[pId]
        //             })
        //         })
        //     });
        //     round++;
        // }
    }

    changeSelectedRound() {
        this.setState(
            Object.assign(this.state, {
                selectedRound: document.getElementsByName('selectBox')[0].value
            }));
        this.fetchCaptainData(document.getElementsByName('selectBox')[0].value);
    };

    fetchCaptainData(round) {
        let that = this;
        // TODO må hentes via nytt API
        // if (round) {
        //     $.get("/api/captain?round=" + round).done(function (result) {
        //         Object.assign(that.state.captainData, result)
        //         console.log("kapteinData: ", result);
        //     });
        //     $.get("/api/playerscores?round=" + round).done(function (result) {
        //         that.setState({
        //             playerPoints: result,
        //         })
        //     });
        // }
    }

    render() {
        const {currentRound, managerIds, dataz, players, isCurrentRoundFinished, liveScore} = this.props;
        const {playerPoints, selectedRound, captainData} = this.state;

        // TODO dette her er ikke riktig lenger. Hent kapteinsdata samtidig som alt annet i Login om det er mulig
        if (playerPoints === null) {
            this.fetchCaptainData(selectedRound);
        }
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
                        {normalFact('Beste klatrer i vår liga', score.highestLeagueClimber, players)}
                        {normalFact('Største fall i vår liga', score.largestLeageDrop, players)}
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
