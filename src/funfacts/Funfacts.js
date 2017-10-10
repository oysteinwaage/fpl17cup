import React, {Component} from 'react';
import '../App.css';
import './Funfacts.css';
import {playerIds, players, SelectBox, allRounds, roundJackass} from '../utils.js';
import {currentRound, dataz} from '../App.js';

//TODO inntil jeg får fikset redux med state
function tempNullCheck(teamId) {
    return dataz[teamId] || {};
}

function tempNullCheckRound(teamId, round) {
    return tempNullCheck(teamId) && tempNullCheck(teamId)[round] ? tempNullCheck(teamId)[round] : {};
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
        };
        this.calculateStats = this.calculateStats.bind(this);
    };

    changeSelectedRound() {
        this.setState(
            Object.assign(this.state, {
                selectedRound: document.getElementsByName('selectBox')[0].value
            }));
    };

    calculateStats(round) {
        let highestRoundScore = [0, ''];
        let lowestRoundScore = [666, ''];
        let mostPointsOnBench = [0, ''];
        let mostTotalPointsOnBench = [0, ''];
        let mostTransfersUsed = [0, ''];
        let mostTotalHitsTaken = [0, ''];
        let highestLeagueClimber = [0, ''];
        let largestLeageDrop = [0, ''];
        let chipsUsed = [];
        let hitsTaken = [];
        playerIds.forEach(function (p) {
            const roundNullsafe = tempNullCheckRound(p, 'round' + round);
            const points = roundNullsafe.points;
            const pointsOnBench = roundNullsafe.pointsOnBench;
            const transfersUsed = tempNullCheck(p).totalTransfers;
            const totalPointsOnBench = tempNullCheck(p).totalPointsOnBench;
            const totalHitsTaken = tempNullCheck(p).totalHitsTaken;

            if (points > highestRoundScore[0]) {
                highestRoundScore[0] = points;
                highestRoundScore[1] = p;
            } else if (points < lowestRoundScore[0]) {
                lowestRoundScore[0] = points;
                lowestRoundScore[1] = p;
            }
            if (pointsOnBench > mostPointsOnBench[0]) {
                mostPointsOnBench[0] = pointsOnBench;
                mostPointsOnBench[1] = p;
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
            if (roundNullsafe.chipsPlayed) {
                chipsUsed.push([p, roundNullsafe.chipsPlayed.chipName]);
            }
            if (roundNullsafe.takenHit > 0) {
                hitsTaken.push([p, '-' + roundNullsafe.takenHit + 'p']);
            }
            if (round +'' === currentRound + '') {
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
        highestLeagueClimber[0] = this.convertForView(highestLeagueClimber);
        largestLeageDrop[0] = this.convertForView(largestLeageDrop);
        hitsTaken.sort(function (a, b) {
            return b[1].slice(1, -1) - a[1].slice(1, -1);
        });
        return {
            highestRoundScore,
            lowestRoundScore,
            mostPointsOnBench,
            mostTotalPointsOnBench,
            mostTotalHitsTaken,
            mostTransfersUsed,
            highestLeagueClimber,
            largestLeageDrop,
            chipsUsed,
            hitsTaken,
        }
    }

    convertForView(data) {
        return tempNullCheck(data[1]).lastRoundLeagueRank + ' => ' + tempNullCheck(data[1]).leagueRank;
    }

    render() {
        let score = this.calculateStats(this.state.selectedRound);
        const totalHits = ['-' + score.mostTotalHitsTaken[0] + 'p', score.mostTotalHitsTaken[1]];
        const roundJackasText = roundJackass['round' + this.state.selectedRound];
        return (
            <div className="ff-content-container">
                {roundJackasText &&
                <div className="ff-rundens-smell">
                    <div className="ff-rundens-smell-header">"Rundens kuksuger"</div>
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
                    {normalFact('Flest poeng på benken', score.mostPointsOnBench)}
                    {normalFact('Beste klatrer i vår liga', score.highestLeagueClimber)}
                    {normalFact('Største fall i vår liga', score.largestLeageDrop)}
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

function makeMultipleResultsRows(text, data) {
    return data.length === 0 ? null : (
        <div className={"ff-multiple-results-container"}>
            <div className="ff-normal-fact-text">{text}</div>
            <div className="ff-normal-fact-result">
                {data.map(d => {
                    return (
                        <div key={d[0]} className="ff-multiple-result-facts">
                            {players[d[0]] + ' (' + d[1] + ')'}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function normalFact(text, data) {
    return data[1] && (
        <div className={"ff-normal-fact-container"}>
            <div className="ff-normal-fact-text">{text}</div>
            <div className="ff-normal-fact-result">
                {data[0] + ' (' + players[data[1]] + ')'}
            </div>
        </div>
    )
}

export default App;
