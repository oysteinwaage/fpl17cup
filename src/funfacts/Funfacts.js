import React, {Component} from 'react';
import '../App.css';
import './Funfacts.css';
import {playerIds, players, SelectBox, allRounds} from '../utils.js';
import {currentRound, dataz} from '../App.js';

//TODO inntil jeg får fikset redux med state
function tempNullCheck(teamId) {
    return dataz[teamId] || {};
}

function tempNullCheck2(teamId, round) {
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
        this.highestRoundScore = this.highestRoundScore.bind(this);
    };

    changeSelectedRound() {
        this.setState(
            Object.assign(this.state, {
                selectedRound: document.getElementsByName('selectBox')[0].value
            }));
    };

    highestRoundScore(round) {
        let playerHighest = 0;
        let highestScore = 0;
        let playerLowest = 0;
        let lowestScore = 666;
        let playerMostPointsOnBench = 0;
        let mostPointsOnBench = 0;
        let mostTransfersUsed = 0;
        let playerMostTransfers = 0;
        playerIds.forEach(function (p) {
            const points = tempNullCheck2(p, 'round' + round).points;
            const pointsOnBench = tempNullCheck2(p, 'round' + round).pointsOnBench;
            const transfersUsed = tempNullCheck(p).totalTransfers;

            if (points > highestScore) {
                playerHighest = p;
                highestScore = points;
            } else if (points < lowestScore) {
                playerLowest = p;
                lowestScore = points;
            }
            if (pointsOnBench > mostPointsOnBench) {
                mostPointsOnBench = pointsOnBench;
                playerMostPointsOnBench = p;
            }
            if (transfersUsed > mostTransfersUsed) {
                mostTransfersUsed = transfersUsed;
                playerMostTransfers = p;
            }
        });
        return {
            highestScorePlayer: playerHighest,
            highestRoundScore: highestScore,
            lowestScorePlayer: playerLowest,
            lowestRoundScore: lowestScore,
            mostPointsOnBench,
            playerMostPointsOnBench,
            mostTransfersUsed,
            playerMostTransfers,
        }
    }

    render() {
        let score = this.highestRoundScore(this.state.selectedRound);
        return (
            <div className="ff-content-container">
                <div className="ff-rundens-smell">
                    "Rundens Smell"
                </div>
                <div className="ff-round-facts">
                    <div className="ff-facts-header">Stats runde {this.state.selectedRound}</div>
                    {SelectBox(allRounds, this.changeSelectedRound.bind(this))}
                    {normalFact('Høyest score', score.highestRoundScore, score.highestScorePlayer)}
                    {normalFact('Lavest score', score.lowestRoundScore, score.lowestScorePlayer)}
                    {normalFact('Flest poeng på benken', score.mostPointsOnBench, score.playerMostPointsOnBench)}
                </div>
                <div className="ff-total-facts">
                    <div className="ff-facts-header">Stats totalt</div>
                    {normalFact('Flest totale bytter', score.mostTransfersUsed, score.playerMostTransfers)}
                </div>
            </div>
        );
    }
}

function normalFact(text, score, player) {
    return (
        <div className="ff-normal-fact-container">
            <div className="ff-normal-fact-text">{text}</div>
            <div className="ff-normal-fact-result">
                {score + ' (' + players[player] + ')'}
            </div>
        </div>
    )
}

export default App;
