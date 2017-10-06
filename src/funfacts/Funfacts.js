import React, {Component} from 'react';
import '../App.css';
import {playerIds, players} from '../utils.js';
import {currentRound, dataz} from '../App.js';

//TODO inntil jeg får fikset redux med state
function tempNullCheck(teamId){
    return dataz[teamId] || {};
}
function tempNullCheck2(teamId, round){
    return tempNullCheck(teamId) && tempNullCheck(teamId)[round] ? tempNullCheck(teamId)[round] : {};
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            highestScorePlayer: '?',
            highestRoundScore: '?',
            lowestScorePlayer: '?',
            lowestRoundScore: '?'
        };
        this.highestRoundScore = this.highestRoundScore.bind(this);
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
        let score = this.highestRoundScore(currentRound);
        return (
            <div>
                <h2>Funfacts runde {currentRound}</h2>
                <p>{'Høyest score: ' + score.highestRoundScore +
                ' (' + players[score.highestScorePlayer] + ') '}</p>
                <p>{'Lavest score: ' + score.lowestRoundScore +
                ' (' + players[score.lowestScorePlayer] + ')'}</p>
                <p>{'Flest poeng på benken: ' + score.mostPointsOnBench + ' ('
                + players[score.playerMostPointsOnBench] + ') '}</p>
                <p>{'Flest totale bytter: ' + score.mostTransfersUsed + ' ('
                + players[score.playerMostTransfers] + ') '}</p>
                <p>+++</p>
            </div>
        );
    }
}

export default App;
