import React from 'react';
import './Runder.css';
import {score, dataz} from '../App.js';
import {players} from '../utils.js';

export const gamesPrGroupAndRound = {
    round3_13: {
        groupA: [[1083723, 94232], [3041546, 86070], [1773168, 276910]],
        groupB: [[546878, 552058], [1413504, 144360], [92124, 71962]],
        groupC: [[1727710, 407749], [26900, 2287279], [2690627, 2003531]],
        groupD: [[446195, 454412], [1136421, 1499253], [159488, 1969508]],
        groupE: [[188947, 1305123], [1898765, 1261708], [1331886, 2547467]],
    },
    round5_15: {
        groupA: [[1083723, 3041546], [94232, 1773168], [86070, 276910]],
        groupB: [[546878, 1413504], [552058, 92124], [144360, 71962]],
        groupC: [[1727710, 26900], [407749, 2690627], [2287279, 2003531]],
        groupD: [[446195, 1136421], [454412, 159488], [1499253, 1969508]],
        groupE: [[188947, 1898765], [1305123, 1331886], [1261708, 2547467]],
    },
    round7_17: {
        groupA: [[1083723, 86070], [94232, 276910], [3041546, 1773168]],
        groupB: [[546878, 144360], [552058, 71962], [1413504, 92124]],
        groupC: [[1727710, 2287279], [407749, 2003531], [26900, 2690627]],
        groupD: [[446195, 1499253], [454412, 1969508], [1136421, 159488]],
        groupE: [[188947, 1261708], [1305123, 2547467], [1898765, 1331886]],
    },
    round9_19: {
        groupA: [[1083723, 1773168], [3041546, 276910], [94232, 86070]],
        groupB: [[546878, 92124], [1413504, 71962], [552058, 144360]],
        groupC: [[1727710, 2690627], [26900, 2003531], [407749, 2287279]],
        groupD: [[446195, 159488], [1136421, 1969508], [454412, 1499253]],
        groupE: [[188947, 1331886], [1898765, 2547467], [1305123, 1261708]],
    },
    round11_21: {
        groupA: [[1083723, 276910], [86070, 1773168], [3041546, 94232]],
        groupB: [[546878, 71962], [144360, 92124], [1413504, 552058]],
        groupC: [[1727710, 2003531], [2287279, 2690627], [26900, 407749]],
        groupD: [[446195, 1969508], [1499253, 159488], [1136421, 454412]],
        groupE: [[188947, 2547467], [1261708, 1331886], [1898765, 1305123]],
    },
    extraround: {
        groupA: [[92124, 552058]],
        groupB: [[1727710, 0], [1083723, 0], [446195, 0]],
        groupC: [],
        groupD: [],
        groupE: [],
    },
    utslagning: {
        groupA: [[144360, 94232], [92124, 1136421], [1331886, 1261708], [1727710, 2003531]],
        groupB: [[144360, 1331886], [92124, 1727710]],
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
            return 'utslagning';
    }
}

function Match(props) {
    return (
        <div className="match-score-container">
            <div className="match-result">
                <div className="homeTeam team">
                    <a onClick={() => props.onToggleDialog(props.team1)}>
                        {players[props.team1]}<br/>
                        <div className="subName">{dataz[props.team1] && dataz[props.team1].managerName}</div>
                    </a>
                </div>
                <div className="score">{score(props.team1, props.team2, props.round)}</div>
                <div className="awayTeam team">
                    <a onClick={() => props.onToggleDialog(props.team2)}>
                        {players[props.team2]}<br/>
                        <div className="subName">{dataz[props.team2] && dataz[props.team2].managerName}</div>
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

function lagKampoppsettSemifinale() {

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
                        groupHeader = 'Playoff gruppe B';
                    } else if (groupLetter === 'B') {
                        groupHeader = 'Playoff gruppetoere på 18p';
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
