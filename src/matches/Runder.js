import React from 'react';
import './Runder.css';
import {roundScore} from '../Login.js';
import {players, fplAvgTeams} from '../utils.js';

export const gamesPrGroupAndRound = {
    round4_14: {
        groupA: [[737536, 1259705], [1618273, 130438], [2249091, 3958980]],
        groupB: [[3930276, 126466], [3034647, 1025143], [3524888, 1]],
        groupC: [[18575, 2], [1260577, 444051], [552453, 210166]],
        groupD: [[531121, 1884253], [4984122, 131342], [1159430, 3]],
        groupE: [[2218701, 493380], [219691, 3126178], [404123, 0]],
    },
    round6_16: {
        groupA: [[737536, 1618273], [1259705, 2249091], [130438, 3958980]],
        groupB: [[3930276, 3034647], [126466, 3524888], [1025143, 1]],
        groupC: [[18575, 1260577], [2, 552453], [444051, 210166]],
        groupD: [[531121, 4984122], [1884253, 1159430], [131342, 3]],
        groupE: [[2218701, 219691], [493380, 404123], [3126178, 0]],
    },
    round8_18: {
        groupA: [[737536, 130438], [1259705, 3958980], [1618273, 2249091]],
        groupB: [[3930276, 1025143], [126466, 1], [3034647, 3524888]],
        groupC: [[18575, 444051], [2, 210166], [1260577, 552453]],
        groupD: [[531121, 131342], [1884253, 3], [4984122, 1159430]],
        groupE: [[2218701, 3126178], [493380, 0], [219691, 404123]],
    },
    round10_20: {
        groupA: [[737536, 2249091], [1618273, 3958980], [1259705, 130438]],
        groupB: [[3930276, 3524888], [3034647, 1], [126466, 1025143]],
        groupC: [[18575, 552453], [1260577, 210166], [2, 444051]],
        groupD: [[531121, 1159430], [4984122, 3], [1884253, 131342]],
        groupE: [[2218701, 404123], [219691, 0], [493380, 3126178]],
    },
    round12_22: {
        groupA: [[737536, 3958980], [130438, 2249091], [1618273, 1259705]],
        groupB: [[3930276, 1], [1025143, 3524888], [3034647, 126466]],
        groupC: [[18575, 210166], [444051, 552453], [1260577, 2]],
        groupD: [[531121, 3], [131342, 1159430], [4984122, 1884253]],
        groupE: [[2218701, 0], [3126178, 404123], [219691, 493380]],
    },
    extraround: {
        groupA: [[1259705, 4984122]],
        groupB: [],
        groupC: [],
        groupD: [],
        groupE: [],
    },
    utslagning: {
        groupA: [[493380, 3930276], [210166, 4984122], [1159430, 3958980], [2218701, 1260577]],
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
        case '4':
        case 4:
        case '14':
        case 14:
            return 'round4_14';
        case '6':
        case 6:
        case '16':
        case 16:
            return 'round6_16';
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
        case 24:
        case 'Playoff':
            return 'extraround';
        case 'Utslagningsrunder':
            return 'utslagning';
        default:
            return 'utslagning';
    }
}

export const roundLiveScore = (team, liveScore) =>
    fplAvgTeams.includes(team) ? liveScore.averageScore : liveScore.fplManagersLiveScore[team].totalPoints || 0;

export const score = (t1, t2, round, dataz, liveScore, skalBrukeLiveData) => {
    if (skalBrukeLiveData){
        return roundLiveScore(t1, liveScore) + (' - ' + roundLiveScore(t2, liveScore));
    }

    return (dataz[t1] && dataz[t1][round]) || (dataz[t2] && dataz[t2][round])
        ? roundScore(t1, round, dataz) + (' - ' + roundScore(t2, round, dataz))
        : ' - ';
};

function Match(props) {
    return (
        <div className="match-score-container">
            <div className="match-result">
                <div className="homeTeam team">
                    <a onClick={() => props.onToggleDialog(props.team1)}>
                        {fplAvgTeams.includes(props.team1) ? "Fantasy Average" : players[props.team1]}<br/>
                        <div className="subName">{fplAvgTeams.includes(props.team1) ? props.round : props.dataz[props.team1] && props.dataz[props.team1].managerName}</div>
                    </a>
                </div>
                <div className="score">{score(props.team1, props.team2, props.round, props.dataz, props.liveScore, props.skalBrukeLiveData)}</div>
                <div className="awayTeam team">
                    <a onClick={() => props.onToggleDialog(props.team2)}>
                        {fplAvgTeams.includes(props.team2) ? "Fantasy Average" : players[props.team2]}<br/>
                        <div className="subName">{fplAvgTeams.includes(props.team2) ? props.round : props.dataz[props.team2] && props.dataz[props.team2].managerName}</div>
                    </a>
                </div>
            </div>
        </div>
    );
}

function roundForCupPlay(groupHeader) {
    if (groupHeader.startsWith('Kvartfinale')) {
        return 26;
    } else if (groupHeader.startsWith('Semifinale')) {
        return 28;
    } else if (groupHeader.startsWith('Finale')) {
        return 30;
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
                        groupHeader = 'Kvartfinaler (runde 26)';
                    } else if (groupLetter === 'B') {
                        groupHeader = 'Semifinaler (runde 28)';
                    } else if (groupLetter === 'C') {
                        groupHeader = 'Finale (runde 30)';
                    } else {
                        groupHeader = false;
                    }
                } else if (round === 'extraround') {
                    if (groupLetter === 'A') {
                        groupHeader = 'Playoff (runde 24) mellom gutta på 18p';
                //    } else if (groupLetter === 'B') {
                //        groupHeader = 'Playoff gruppe E';
                    } else {
                        groupHeader = false;
                    }
                }
                const roundNr = props.chosenRound === 'Utslagningsrunder' && groupHeader ? roundForCupPlay(groupHeader) :
                    props.chosenRound === 'Playoff' && groupHeader ? 24 : props.chosenRound;
                return groupHeader && (
                    <div key={groupId}>
                        <div className='groupName'>{groupHeader}</div>
                        {gamesPrGroupAndRound[round][groupId].map(function (match) {
                            return <Match key={match[0] + match[1]}
                                          team1={match[0]}
                                          team2={match[1]}
                                          round={'round' + roundNr}
                                          onToggleDialog={props.onToggleDialog}
                                          dataz={props.dataz}
                                          liveScore={props.liveScore}
                                          skalBrukeLiveData={props.skalBrukeLiveData}
                            />;
                        })}
                    </div>);
            })}
        </div>
    );
}
