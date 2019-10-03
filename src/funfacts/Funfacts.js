import React, {Component} from 'react';
import '../App.css';
import './Funfacts.css';
import {players, SelectBox, allRounds, roundJackass} from '../utils.js';
import {currentRound, dataz, fplPlayers, loadedPlayerIds, isForFameAndGloryLeague} from '../App.js';

function tempNullCheck(teamId) {
    return dataz[teamId] || {};
}

function tempNullCheckRound(teamId, round) {
    return tempNullCheck(teamId) && tempNullCheck(teamId)[round] ? tempNullCheck(teamId)[round] : {};
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

function populateHighestValueListFor(list, value, player){
    if (list.length === 0 || value > list[0][0]) {
        list = [[value, player]];
    } else if (list.length > 0 && value === list[0][0]) {
        list.push([value, player]);
    }
    return list;
}
function populateLowestValueListFor(list, value, player){
    if (list.length === 0 || value < list[0][0]) {
        list = [[value, player]];
    } else if (list.length > 0 && value === list[0][0]) {
        list.push([value, player]);
    }
    return list;
}

export function calculateStats(round, players, playerPoints, captainData) {
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
    players.forEach(function (p) {
        const roundNullsafe = tempNullCheckRound(p, 'round' + round);
        const points = roundNullsafe.points;
        const pointsOnBench = roundNullsafe.pointsOnBench;
        const transfersUsed = tempNullCheck(p).totalTransfers;
        const totalPointsOnBench = tempNullCheck(p).totalPointsOnBench;
        const totalHitsTaken = tempNullCheck(p).totalHitsTaken;
        const captainPoints = playerPoints && playerPoints[1] && captainData[p] && calculateCaptainPointsForPlayer(playerPoints, captainData, p);

        if(points !== null && points !== undefined){
            highestRoundScore = populateHighestValueListFor(highestRoundScore, points, p);
            lowestRoundScore = populateLowestValueListFor(lowestRoundScore, points, p);
        }
        if (pointsOnBench !== null && pointsOnBench !== undefined) {
            mostPointsOnBench = populateHighestValueListFor(mostPointsOnBench, pointsOnBench, p);
        }
        if (captainPoints !== null && captainPoints !== undefined) {
            const captainName = hasCaptainPlayed(playerPoints, captainData[p].player) ?
                fplPlayers[captainData[p].player - 1].web_name :
                fplPlayers[captainData[p].vicePlayer - 1].web_name;
            if (mostCaptainPoints.length === 0 || captainPoints > mostCaptainPoints[0][0]) {
                mostCaptainPoints = [[captainPoints, p, captainName]];
            } else if (mostCaptainPoints.length > 0 && captainPoints === mostCaptainPoints[0][0]) {
                mostCaptainPoints.push([captainPoints, p, captainName]);
            }
            if (lowestCaptainPoints.length === 0 || captainPoints < lowestCaptainPoints[0][0]) {
                lowestCaptainPoints = [[captainPoints, p, captainName]];
            } else if (lowestCaptainPoints.length > 0 && captainPoints === lowestCaptainPoints[0][0]) {
                lowestCaptainPoints.push([captainPoints, p, captainName])
            }
        }
        if (roundNullsafe.chipsPlayed) {
            chipsUsed.push([p, roundNullsafe.chipsPlayed.chipName]);
        }
        if (roundNullsafe.takenHit > 0) {
            hitsTaken.push([p, '-' + roundNullsafe.takenHit + 'p']);
        }
        if (round + '' === currentRound + '') {
            const leagueClimb = tempNullCheck(p).leagueClimb;
            if (leagueClimb > highestLeagueClimber[0]) {
                highestLeagueClimber[0] = leagueClimb;
                highestLeagueClimber[1] = p;
            } else if (leagueClimb < largestLeageDrop[0]) {
                largestLeageDrop[0] = leagueClimb;
                largestLeageDrop[1] = p;
            }
        }

        if(totalPointsOnBench !== null && totalPointsOnBench !== undefined){
            mostTotalPointsOnBench = populateHighestValueListFor(mostTotalPointsOnBench, totalPointsOnBench, p);
            lowestTotalPointsOnBench = populateLowestValueListFor(lowestTotalPointsOnBench, totalPointsOnBench, p);
        }
        if(totalHitsTaken !== null && totalHitsTaken !== undefined){
            mostTotalHitsTaken = populateHighestValueListFor(mostTotalHitsTaken, totalHitsTaken, p);
            lowestTotalHitsTaken = populateLowestValueListFor(lowestTotalHitsTaken, totalHitsTaken, p);
        }
        if(transfersUsed !== null && transfersUsed !== undefined){
            mostTransfersUsed = populateHighestValueListFor(mostTransfersUsed, transfersUsed, p);
            fewestTransfersUsed = populateLowestValueListFor(fewestTransfersUsed, transfersUsed, p);
        }
    });
    highestLeagueClimber[0] = convertForView(highestLeagueClimber);
    largestLeageDrop[0] = convertForView(largestLeageDrop);
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
        chipsUsed,
        hitsTaken,
    }
}

function convertForView(data) {
    return tempNullCheck(data[1]).lastRoundLeagueRank + ' => ' + tempNullCheck(data[1]).leagueRank;
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            highestScorePlayer: '?',
            highestRoundScore: '?',
            lowestScorePlayer: '?',
            lowestRoundScore: '?',
            selectedRound: currentRound,
            captainData: {},
            playerPoints: null,
        };
        // this.calculateStats = this.calculateStats.bind(this);
        this.fetchCaptainData = this.fetchCaptainData.bind(this);
    };

    // TODO denne må flyttes til App.js og gjøres ETTER currentRound er satt!
    componentDidMount() {
        let round = 1;
        let totalCaptainPoints = {};
        // TODO må hentes via nytt API
        // while (round <= currentRound) {
        //     $.get("/api/captain?round=" + round).done(function (result) {
        //         loadedPlayerIds.forEach(pId => {
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
        if (this.state.playerPoints === null) {
            this.fetchCaptainData(this.state.selectedRound);
        }
        let score = calculateStats(this.state.selectedRound, loadedPlayerIds, this.state.playerPoints, this.state.captainData);
        let totalHits = score.mostTotalHitsTaken || [];
        if(totalHits[0]){
            totalHits[0] = ['-' + score.mostTotalHitsTaken[0][0] + 'p', score.mostTotalHitsTaken[0][1]];
        }
        let totalFewestHits = score.lowestTotalHitsTaken || [];
        if(totalFewestHits[0]){
            totalFewestHits[0] = [score.lowestTotalHitsTaken[0][0] === 0 ? 0 + 'p' :'-' + score.lowestTotalHitsTaken[0][0] + 'p', score.lowestTotalHitsTaken[0][1]];
        }
        const roundJackasText = roundJackass['round' + this.state.selectedRound];
        return (
            <div className="ff-content-container">
                {(!roundJackasText || !isForFameAndGloryLeague()) &&
                <p style={{'textAlign': 'center', 'fontSize': 'small', 'width': '100%'}}>(Kun kapteinspoeng oppdateres
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
                    <div className="ff-facts-header">Stats runde {this.state.selectedRound}</div>
                    {SelectBox(allRounds, this.changeSelectedRound.bind(this))}
                    {makeMultipleResultsRowsWithSameScore('Høyest score', score.highestRoundScore)}
                    {makeMultipleResultsRowsWithSameScore('Lavest score', score.lowestRoundScore)}
                    {makeMultipleResultsRowsWithSameScore('Flest poeng på benken', score.mostPointsOnBench)}
                    {normalFact('Beste klatrer i vår liga', score.highestLeagueClimber)}
                    {normalFact('Største fall i vår liga', score.largestLeageDrop)}
                    {makeMultipleResultsRowsWithSameScore('Flest kapteinspoeng', score.mostCaptainPoints)}
                    {makeMultipleResultsRowsWithSameScore('Færrest kapteinspoeng', score.lowestCaptainPoints)}
                    {makeMultipleResultsRows('Brukt chips', score.chipsUsed)}
                    {makeMultipleResultsRows('Tatt hit', score.hitsTaken)}
                </div>
                <div className="ff-total-facts">
                    <div className="ff-facts-header">Stats totalt</div>
                    {makeMultipleResultsRowsWithSameScore('Flest bytter', score.mostTransfersUsed)}
                    {makeMultipleResultsRowsWithSameScore('Færrest bytter', score.fewestTransfersUsed)}
                    {makeMultipleResultsRowsWithSameScore('Mest hits tatt', totalHits)}
                    {makeMultipleResultsRowsWithSameScore('Minst hits tatt', totalFewestHits)}
                    {makeMultipleResultsRowsWithSameScore('Flest poeng på benk', score.mostTotalPointsOnBench)}
                    {makeMultipleResultsRowsWithSameScore('Færrest poeng på benk', score.lowestTotalPointsOnBench)}
                </div>
            </div>
        );
    }
}

export function makeMultipleResultsRows(text, data, onlyScore) {
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

// export function makeMultipleResultsRowsWithSameScore(text, data) {
//     let firstRow = true;
//     return data.length === 0 ? null : (
//         <div className={"ff-multiple-results-container"}>
//             <div className="ff-normal-fact-text">{text}</div>
//             <div className="ff-normal-fact-result">
//                 {data.map(d => {
//                     const points = firstRow ? d[0] : '';
//                     const player = players[d[1][0]] + ' (' + d[1][1] + ')';
//                     firstRow = false;
//                     return (
//                         <div key={d[1][0] + 'r'} className="ff-multiple-result-facts-2">
//                             <div key={d[1][0] + 'p'} className="ff-multiple-result-facts-points">{points}</div>
//                             <div key={d[1][0] + 'p2'} className="ff-multiple-result-facts-player">{player}</div>
//                         </div>
//                     )
//                 })}
//             </div>
//         </div>
//     )
// }

export function makeMultipleResultsRowsWithSameScore(text, data, onlyScore = false) {
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

export function normalFact(text, data, onlyScore) {
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

export default App;
