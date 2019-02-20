import React from 'react';
import './Runder.css';
import {score, dataz} from '../App.js';
import {players} from '../utils.js';

export const gamesPrGroupAndRound = {
    round3_13: {
        groupA: [[326355, 2081049], [1076386, 450858], [81709, 1540895]],
        groupB: [[2042669, 250493], [295316, 785974], [264768, 1552181]],
        groupC: [[61352, 364415], [564738, 394579], [422738, 369455]],
        groupD: [[74819, 415753], [922352, 187450], [1067641, 1598415]],
        groupE: [[75546, 2601781], [855540, 0], [1259874, 2678280]],
    },
    round5_15: {
        groupA: [[326355, 1076386], [2081049, 81709], [450858, 1540895]],
        groupB: [[2042669, 295316], [250493, 264768], [785974, 1552181]],
        groupC: [[61352, 564738], [364415, 422738], [394579, 369455]],
        groupD: [[74819, 922352], [415753, 1067641], [187450, 1598415]],
        groupE: [[75546, 855540], [2601781, 1259874], [0, 2678280]],
    },
    round7_17: {
        groupA: [[326355, 450858], [2081049, 1540895], [1076386, 81709]],
        groupB: [[2042669, 785974], [250493, 1552181], [295316, 264768]],
        groupC: [[61352, 394579], [364415, 369455], [564738, 422738]],
        groupD: [[74819, 187450], [415753, 1598415], [922352, 1067641]],
        groupE: [[75546, 0], [2601781, 2678280], [855540, 1259874]],
    },
    round9_19: {
        groupA: [[326355, 81709], [1076386, 1540895], [2081049, 450858]],
        groupB: [[2042669, 264768], [295316, 1552181], [250493, 785974]],
        groupC: [[61352, 422738], [564738, 369455], [364415, 394579]],
        groupD: [[74819, 1067641], [922352, 1598415], [415753, 187450]],
        groupE: [[75546, 1259874], [855540, 2678280], [2601781, 0]],
    },
    round11_21: {
        groupA: [[326355, 1540895], [450858, 81709], [1076386, 2081049]],
        groupB: [[2042669, 1552181], [785974, 264768], [295316, 250493]],
        groupC: [[61352, 369455], [394579, 422738], [564738, 364415]],
        groupD: [[74819, 1598415], [187450, 1067641], [922352, 415753]],
        groupE: [[75546, 2678280], [0, 1259874], [855540, 2601781]],
    },
    extraround: {
        groupA: [[326355, 2081049]],
        groupB: [[75546, -1], [2601781, -2], [2678280, -3]],
        groupC: [],
        groupD: [],
        groupE: [],
    },
    utslagning: {
        groupA: [[2678280, 61352], [1067641, 81709], [1552181, 1259874], [369455, 326355]],
        groupB: [[81709, 369455], [61352, 1552181]],
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
        case '3':
        case 3:
        case '13':
        case 13:
            return 'round3_13';
        case '5':
        case 5:
        case '15':
        case 15:
            return 'round5_15';
        case '7':
        case 7:
        case '17':
        case 17:
            return 'round7_17';
        case '9':
        case 9:
        case '19':
        case 19:
            return 'round9_19';
        case '11':
        case 11:
        case '21':
        case 21:
            return 'round11_21';
        case 23:
        case 'Playoff':
            return 'extraround';
        case 'Utslagningsrunder':
            return 'utslagning';
        default:
            return 'round3_13';
    }
}

function Match(props) {
    return (
        <div className="match-score-container">
            <div className="match-result">
                <div className="homeTeam team">
                    <a onClick={() => props.onToggleDialog(props.team1)}>
                        {props.team1 === 0 ? "Fantasy Average" : players[props.team1]}<br/>
                        <div className="subName">{props.team1 === 0 ? props.round : dataz[props.team1] && dataz[props.team1].managerName}</div>
                    </a>
                </div>
                <div className="score">{score(props.team1, props.team2, props.round)}</div>
                <div className="awayTeam team">
                    <a onClick={() => props.onToggleDialog(props.team2)}>
                        {props.team2 === 0 ? "Fantasy Average" : players[props.team2]}<br/>
                        <div className="subName">{props.team2 === 0 ? props.round : dataz[props.team2] && dataz[props.team2].managerName}</div>
                    </a>
                </div>
            </div>
        </div>
    );
}

function roundForCupPlay(groupHeader) {
    if (groupHeader.startsWith('Kvartfinale')) {
        return 25;
    } else if (groupHeader.startsWith('Semifinale')) {
        return 27;
    } else if (groupHeader.startsWith('Finale')) {
        return 29;
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
                        groupHeader = 'Kvartfinaler (runde 25)';
                    } else if (groupLetter === 'B') {
                        groupHeader = 'Semifinaler (runde 27)';
                    } else if (groupLetter === 'C') {
                        groupHeader = 'Finale (runde 29)';
                    } else {
                        groupHeader = false;
                    }
                } else if (round === 'extraround') {
                    if (groupLetter === 'A') {
                        groupHeader = 'Playoff gruppe A';
                    } else if (groupLetter === 'B') {
                        groupHeader = 'Playoff gruppe E';
                    } else {
                        groupHeader = false;
                    }
                }
                const roundNr = props.chosenRound === 'Utslagningsrunder' && groupHeader ? roundForCupPlay(groupHeader) :
                    props.chosenRound === 'Playoff' && groupHeader ? 23 : props.chosenRound;
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
};
