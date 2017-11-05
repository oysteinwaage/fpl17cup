import React, {Component} from 'react';
import $ from 'jquery';
import '../App.css';
import './Funfacts.css';
import {playerIds, players, SelectBox, allRounds, roundJackass} from '../utils.js';
import {currentRound, dataz, fplPlayers} from '../App.js';

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

export function calculateStats(round, players, playerPoints, captainData) {
    let highestRoundScore = [0, ''];
    let lowestRoundScore = [666, ''];
    let mostPointsOnBench2 = [];
    let mostTotalPointsOnBench = [0, ''];
    let mostTransfersUsed = [0, ''];
    let mostTotalHitsTaken = [0, ''];
    let highestLeagueClimber = [0, ''];
    let largestLeageDrop = [0, ''];
    let mostCaptainPoints = [];
    let lowestCaptainPoints = [];
    let chipsUsed = [];
    let hitsTaken = [];
    players.forEach(function (p) {
        const roundNullsafe = tempNullCheckRound(p, 'round' + round);
        const points = roundNullsafe.points;
        const pointsOnBench = roundNullsafe.pointsOnBench;
        const transfersUsed = tempNullCheck(p).totalTransfers;
        const totalPointsOnBench = tempNullCheck(p).totalPointsOnBench;
        const totalHitsTaken = tempNullCheck(p).totalHitsTaken;
        const captainPoints = playerPoints && playerPoints[1] && captainData[p] && calculateCaptainPointsForPlayer(playerPoints, captainData, p);

        if (points > highestRoundScore[0]) {
            highestRoundScore[0] = points;
            highestRoundScore[1] = p;
        } else if (points < lowestRoundScore[0]) {
            lowestRoundScore[0] = points;
            lowestRoundScore[1] = p;
        }
        if (pointsOnBench) {
            if (mostPointsOnBench2.length === 0 || pointsOnBench > mostPointsOnBench2[0][0]) {
                mostPointsOnBench2 = [[pointsOnBench, p]];
            } else if (mostPointsOnBench2.length > 0 && pointsOnBench === mostPointsOnBench2[0][0]) {
                mostPointsOnBench2.push([pointsOnBench, p]);
            }
        }
        if (totalPointsOnBench > mostTotalPointsOnBench[0]) {
            mostTotalPointsOnBench[0] = totalPointsOnBench;
            mostTotalPointsOnBench[1] = p;
        }
        if (totalHitsTaken > mostTotalHitsTaken[0]) {
            mostTotalHitsTaken[0] = totalHitsTaken;
            mostTotalHitsTaken[1] = p;
        }
        if (transfersUsed > mostTransfersUsed[0]) {
            mostTransfersUsed[0] = transfersUsed;
            mostTransfersUsed[1] = p;
        }

        if (captainPoints) {
            const captainName = hasCaptainPlayed(playerPoints, captainData[p].player) ?
                fplPlayers[captainData[p].player - 1].web_name :
                fplPlayers[captainData[p].vicePlayer - 1].web_name;
            if (mostCaptainPoints.length === 0 || captainPoints > mostCaptainPoints[0][0]) {
                mostCaptainPoints = [[captainPoints, p, captainName]];
            } else if (mostCaptainPoints.length > 0 && captainPoints === mostCaptainPoints[0][0]) {
                mostCaptainPoints.push([captainPoints, p, captainName]);
            }
        }

        if (captainPoints) {
            const captainName = hasCaptainPlayed(playerPoints, captainData[p].player) ?
                fplPlayers[captainData[p].player - 1].web_name :
                fplPlayers[captainData[p].vicePlayer - 1].web_name;
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
    });
    highestLeagueClimber[0] = convertForView(highestLeagueClimber);
    largestLeageDrop[0] = convertForView(largestLeageDrop);
    hitsTaken.sort(function (a, b) {
        return b[1].slice(1, -1) - a[1].slice(1, -1);
    });
    return {
        highestRoundScore,
        lowestRoundScore,
        mostPointsOnBench2,
        mostTotalPointsOnBench,
        mostTotalHitsTaken,
        mostTransfersUsed,
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
        while (round <= currentRound) {
            $.get("/api/captain?round=" + round).done(function (result) {
                playerIds.forEach(pId => {
                    Object.assign(totalCaptainPoints, {
                        playerId: pId,
                        totalCapPoints: totalCaptainPoints.totalCapPoints + result[pId]
                    })
                })
            });
            round++;
        }
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
        if (round) {
            $.get("/api/captain?round=" + round).done(function (result) {
                Object.assign(that.state.captainData, result)
                console.log("kapteinData: ", result);
            });
            $.get("/api/playerscores?round=" + round).done(function (result) {
                that.setState({
                    playerPoints: result,
                })
                console.log('state siste: ', that.state);
            });
        }
    }

    render() {
        if (this.state.playerPoints === null) {
            this.fetchCaptainData(this.state.selectedRound);
        }
        let score = calculateStats(this.state.selectedRound, playerIds, this.state.playerPoints, this.state.captainData);
        const totalHits = ['-' + score.mostTotalHitsTaken[0] + 'p', score.mostTotalHitsTaken[1]];
        const roundJackasText = roundJackass['round' + this.state.selectedRound];
        return (
            <div className="ff-content-container">
                {!roundJackasText &&
                <p style={{'textAlign': 'center', 'fontSize': 'small', 'width': '100%'}}>(Kun kapteinspoeng oppdateres
                    live, resten oppdateres når FPL oppdaterer sine data)</p>
                }
                {roundJackasText &&
                <div className="ff-rundens-smell">
                    <div className="ff-rundens-smell-header">"Rundens drittfyr"</div>
                    <div className="ff-rundens-smell-content"><span
                        dangerouslySetInnerHTML={{__html: roundJackasText}}/></div>
                    <div className="ff-rundens-smell-signature"> Koz&Klemz Mr. X</div>
                </div>
                }
                <div className="ff-round-facts">
                    <div className="ff-facts-header">Stats runde {this.state.selectedRound}</div>
                    {SelectBox(allRounds, this.changeSelectedRound.bind(this))}
                    {normalFact('Høyest score', score.highestRoundScore)}
                    {normalFact('Lavest score', score.lowestRoundScore)}
                    {makeMultipleResultsRowsWithSameScore('Flest poeng på benken', score.mostPointsOnBench2)}
                    {normalFact('Beste klatrer i vår liga', score.highestLeagueClimber)}
                    {normalFact('Største fall i vår liga', score.largestLeageDrop)}
                    {makeMultipleResultsRowsWithSameScore('Flest kapteinspoeng', score.mostCaptainPoints)}
                    {makeMultipleResultsRowsWithSameScore('Færrest kapteinspoeng', score.lowestCaptainPoints)}
                    {makeMultipleResultsRows('Brukt chips', score.chipsUsed)}
                    {makeMultipleResultsRows('Tatt hit', score.hitsTaken)}
                </div>
                <div className="ff-total-facts">
                    <div className="ff-facts-header">Stats totalt</div>
                    {normalFact('Flest bytter', score.mostTransfersUsed)}
                    {normalFact('Mest hits tatt', totalHits)}
                    {normalFact('Flest poeng på benk', score.mostTotalPointsOnBench)}
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

export function makeMultipleResultsRowsWithSameScore(text, data) {
    let firstRow = true;
    return data.length === 0 ? null : (
        <div className={"ff-multiple-results-container"}>
            <div className="ff-normal-fact-text">{text}</div>
            <div className="ff-normal-fact-result">
                {data.map(d => {
                    const points = firstRow ? d[0] : '';
                    const player = players[d[1]] + (d[2] ? ' (' + d[2] + ')' : '');
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
