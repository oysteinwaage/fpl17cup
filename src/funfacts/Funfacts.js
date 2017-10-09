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
        this.calculateStats = this.calculateStats.bind(this);
    };

    changeSelectedRound() {
        this.setState(
            Object.assign(this.state, {
                selectedRound: document.getElementsByName('selectBox')[0].value
            }));
    };

    calculateStats(round) {
        let highestRoundScore = [0,''];
        let lowestRoundScore = [666, ''];
        let mostPointsOnBench = [0, ''];
        let mostTotalPointsOnBench = [0, ''];
        let mostTransfersUsed = [0, ''];
        playerIds.forEach(function (p) {
            const points = tempNullCheck2(p, 'round' + round).points;
            const pointsOnBench = tempNullCheck2(p, 'round' + round).pointsOnBench;
            const transfersUsed = tempNullCheck(p).totalTransfers;
            const totalPointsOnBench = tempNullCheck(p).totalPointsOnBench;

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
            if (transfersUsed > mostTransfersUsed[0]) {
                mostTransfersUsed[0] = transfersUsed;
                mostTransfersUsed[1] = p;
            }
        });
        return {
            highestRoundScore,
            lowestRoundScore,
            mostPointsOnBench,
            mostTotalPointsOnBench,
            mostTransfersUsed,
        }
    }

    render() {
        let score = this.calculateStats(this.state.selectedRound);
        return (
            <div className="ff-content-container">
                <div className="ff-rundens-smell">
                    "Rundens Smell"
                </div>
                <div className="ff-round-facts">
                    <div className="ff-facts-header">Stats runde {this.state.selectedRound}</div>
                    {SelectBox(allRounds, this.changeSelectedRound.bind(this))}
                    {normalFact('Høyest score', score.highestRoundScore)}
                    {normalFact('Lavest score', score.lowestRoundScore)}
                    {normalFact('Flest poeng på benken', score.mostPointsOnBench)}
                </div>
                <div className="ff-total-facts">
                    <div className="ff-facts-header">Stats totalt</div>
                    {normalFact('Flest bytter', score.mostTransfersUsed)}
                    {normalFact('Flest poeng på benk', score.mostTotalPointsOnBench)}
                </div>
            </div>
        );
    }
}

function normalFact(text, data, totalClass = '') {
    return (
        <div className={"ff-normal-fact-container" + totalClass}>
            <div className="ff-normal-fact-text">{text}</div>
            <div className="ff-normal-fact-result">
                {data[0] + ' (' + players[data[1]] + ')'}
            </div>
        </div>
    )
}

export default App;
