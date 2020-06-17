import React from 'react';
import './Runder.css';
import {score, dataz} from '../App.js';
import {players, fplAvgTeams} from '../utils.js';

export const gamesPrGroupAndRound = {
    round8_18: {
        groupA: [[2224552, 3249094], [113690, 18286], [2253517, 0]],
        groupB: [[2354670, 2731034], [3231757, 1770110], [95509, 1]],
        groupC: [[265744, 2], [1976189, 3119842], [136008, 1778465]],
        groupD: [[147607, 147378], [1822874, 1112848], [513635, 3]],
        groupE: [[280, 110138], [987338, 259276], [1127639, 2868768]],
    },
    round10_20: {
        groupA: [[2224552, 113690], [3249094, 2253517], [18286, 0]],
        groupB: [[2354670, 3231757], [2731034, 95509], [1770110, 1]],
        groupC: [[265744, 1976189], [2, 136008], [3119842, 1778465]],
        groupD: [[147607, 1822874], [147378, 513635], [1112848, 3]],
        groupE: [[280, 987338], [110138, 1127639], [259276, 2868768]],
    },
    round12_22: {
        groupA: [[2224552, 18286], [3249094, 0], [113690, 2253517]],
        groupB: [[2354670, 1770110], [2731034, 1], [3231757, 95509]],
        groupC: [[265744, 3119842], [2, 1778465], [1976189, 136008]],
        groupD: [[147607, 1112848], [147378, 3], [1822874, 513635]],
        groupE: [[280, 259276], [110138, 2868768], [987338, 1127639]],
    },
    round14_24: {
        groupA: [[2224552, 2253517], [113690, 0], [3249094, 18286]],
        groupB: [[2354670, 95509], [3231757, 1], [2731034, 1770110]],
        groupC: [[265744, 136008], [1976189, 1778465], [2, 3119842]],
        groupD: [[147607, 513635], [1822874, 3], [147378, 1112848]],
        groupE: [[280, 1127639], [987338, 2868768], [110138, 259276]],
    },
    round16_26: {
        groupA: [[2224552, 0], [18286, 2253517], [113690, 3249094]],
        groupB: [[2354670, 1], [1770110, 95509], [3231757, 2731034]],
        groupC: [[265744, 1778465], [3119842, 136008], [1976189, 2]],
        groupD: [[147607, 3], [1112848, 513635], [1822874, 147378]],
        groupE: [[280, 2868768], [259276, 1127639], [987338, 110138]],
    },
    extraround: {
        groupA: [],
        groupB: [],
        groupC: [],
        groupD: [],
        groupE: [],
    },
    utslagning: {
        groupA: [[3231757, 113690], [259276, 280], [1976189, 1112848], [2253517, 3119842]],
        groupB: [],
        groupC: [],
        groupD: [],
        groupE: [],
    }
};



export const groups = ['A', 'B', 'C', 'D', 'E'];

//TODO Flytt alle disse felles-funksjonene til utils. Brukes av mange
//TODO også se om du kan fikse dette på en finere måte
export function getRoundNr(round) {
    switch (round) {
        case '8':
        case 8:
        case '18':
        case 18:
            return 'round8_18';
        case '10':
        case 10:
        case '20':
        case 20:
            return 'round10_20';
        case '12':
        case 12:
        case '22':
        case 22:
            return 'round12_22';
        case '14':
        case 14:
        case '24':
        case 24:
            return 'round14_24';
        case '16':
        case 16:
        case '26':
        case 26:
            return 'round16_26';
        case 28:
        case 'Playoff':
            return 'extraround';
        case 'Utslagningsrunder':
            return 'utslagning';
        default:
            return 'utslagning';
    }
}

function Match(props) {
    return (
        <div className="match-score-container">
            <div className="match-result">
                <div className="homeTeam team">
                    <a onClick={() => props.onToggleDialog(props.team1)}>
                        {fplAvgTeams.includes(props.team1) ? "Fantasy Average" : players[props.team1]}<br/>
                        <div className="subName">{fplAvgTeams.includes(props.team1) ? props.round : dataz[props.team1] && dataz[props.team1].managerName}</div>
                    </a>
                </div>
                <div className="score">{score(props.team1, props.team2, props.round)}</div>
                <div className="awayTeam team">
                    <a onClick={() => props.onToggleDialog(props.team2)}>
                        {fplAvgTeams.includes(props.team2) ? "Fantasy Average" : players[props.team2]}<br/>
                        <div className="subName">{fplAvgTeams.includes(props.team2) ? props.round : dataz[props.team2] && dataz[props.team2].managerName}</div>
                    </a>
                </div>
            </div>
        </div>
    );
}

function roundForCupPlay(groupHeader) {
    if (groupHeader.startsWith('Kvartfinale')) {
        return '30+';
    } else if (groupHeader.startsWith('Semifinale')) {
        return '32+';
    } else if (groupHeader.startsWith('Finale')) {
        return '34+';
    }
}

export function MatchesForGroup(props) {
    const round = getRoundNr(props.chosenRound);
    return (
        <div>
            {groups.map(function (groupLetter) {
                const groupId = 'group' + groupLetter;
                let groupHeader = 'Gruppe ' + groupLetter;
                if (round === 'utslagning') {
                    if (groupLetter === 'A') {
                        groupHeader = 'Kvartfinaler (runde 30+)';
                    } else if (groupLetter === 'B') {
                        groupHeader = 'Semifinaler (runde 32+)';
                    } else if (groupLetter === 'C') {
                        groupHeader = 'Finale (runde 34+)';
                    } else {
                        groupHeader = false;
                    }
                } else if (round === 'extraround') {
                    if (groupLetter === 'A') {
                        groupHeader = 'Ingen playoff i år boys! Yolo';
                //    } else if (groupLetter === 'B') {
                //        groupHeader = 'Playoff gruppe E';
                    } else {
                        groupHeader = false;
                    }
                }
                const roundNr = props.chosenRound === 'Utslagningsrunder' && groupHeader ? roundForCupPlay(groupHeader) :
                    props.chosenRound === 'Playoff' && groupHeader ? 28 : props.chosenRound;
                return groupHeader && (
                    <div key={groupId}>
                        <div className='groupName'>{groupHeader}</div>
                        {gamesPrGroupAndRound[round][groupId].map(function (match) {
                            return <Match key={match[0] + match[1]}
                                          team1={match[0]}
                                          team2={match[1]}
                                          round={'round' + roundNr}
                                          onToggleDialog={props.onToggleDialog}/>;
                        })}
                    </div>);
            })}
        </div>
    );
}
