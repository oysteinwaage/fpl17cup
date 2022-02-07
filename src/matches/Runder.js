import React from 'react';
import './Runder.css';
import {roundScore} from '../Login.js';
import {players, fplAvgTeams} from '../utils.js';

export const gamesPrGroupAndRound = {
    round4_14: {
        groupA: [[2119845, 1538696], [190505, 493208], [4967979, 3605267]],
        groupB: [[828403, 1166619], [455789, 3476572], [1033331, 1]],
        groupC: [[2512093, 2], [381029, 5375037], [143741, 3434339]],
        groupD: [[5142137, 3199103], [775134, 3986698], [2690935, 0]],
    },
    round6_16: {
        groupA: [[2119845, 190505], [1538696, 4967979], [493208, 3605267]],
        groupB: [[828403, 455789], [1166619, 1033331], [3476572, 1]],
        groupC: [[2512093, 381029], [2, 143741], [5375037, 3434339]],
        groupD: [[5142137, 775134], [3199103, 2690935], [3986698, 0]],
    },
    round8_18: {
        groupA: [[2119845, 493208], [1538696, 3605267], [190505, 4967979]],
        groupB: [[828403, 3476572], [1166619, 1], [455789, 1033331]],
        groupC: [[2512093, 5375037], [2, 3434339], [381029, 143741]],
        groupD: [[5142137, 3986698], [3199103, 0], [775134, 2690935]],
    },
    round10_20: {
        groupA: [[2119845, 4967979], [190505, 3605267], [1538696, 493208]],
        groupB: [[828403, 1033331], [455789, 1], [1166619, 3476572]],
        groupC: [[2512093, 143741], [381029, 3434339], [2, 5375037]],
        groupD: [[5142137, 2690935], [775134, 0], [3199103, 3986698]],
    },
    round12_22: {
        groupA: [[2119845, 3605267], [493208, 4967979], [190505, 1538696]],
        groupB: [[828403, 1], [3476572, 1033331], [455789, 1166619]],
        groupC: [[2512093, 3434339], [5375037, 143741], [381029, 2]],
        groupD: [[5142137, 0], [3986698, 2690935], [775134, 3199103]],
    },
    extraround: {
        groupA: [[190505], [3605267], [1538696]],
        groupB: [],
        groupC: [],
        groupD: [],
    },
    utslagning: {
        groupA: [],
        groupB: [],
        groupC: [],
        groupD: [],
    }
};

export const groups = ['A', 'B', 'C', 'D'];

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

const matchComponent = (team, round, linkRound, dataz) =>
    <a className="team-link" href={`https://fantasy.premierleague.com/entry/${team}/event/${linkRound}`} target="_blank">
        {fplAvgTeams.includes(team) ? "Fantasy Average" : players[team]}<br/>
        <div className="subName">{fplAvgTeams.includes(team) ? 'Runde ' + round : dataz[team] && dataz[team].managerName}</div>
    </a>;

function Match(props) {
    return (
        <div className="match-score-container">
            <div className="match-result">
                <div className="homeTeam team">
                    {matchComponent(props.team1, props.round, props.linkRound, props.dataz)}
                </div>
                <div className="score">{score(props.team1, props.team2, 'round'+props.round, props.dataz, props.liveScore, props.skalBrukeLiveData)}</div>
                <div className="awayTeam team">
                    {matchComponent(props.team2, props.round, props.linkRound, props.dataz)}
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
                        groupHeader = 'Playoff Gruppe A (runde 24)';
                    } else {
                        groupHeader = false;
                    }
                }
                const roundNr = props.chosenRound === 'Utslagningsrunder' && groupHeader ? roundForCupPlay(groupHeader) :
                    props.chosenRound === 'Playoff' && groupHeader ? 24 : props.chosenRound;
                return groupHeader && (
                    <div key={groupId}>
                        <div className='groupName'>{groupHeader}</div>
                        {gamesPrGroupAndRound[round][groupId].map(match => {
                            return <Match key={match[0] + match[1]}
                                          team1={match[0]}
                                          team2={match[1]}
                                          round={roundNr}
                                          onToggleDialog={props.onToggleDialog}
                                          dataz={props.dataz}
                                          liveScore={props.liveScore}
                                          skalBrukeLiveData={props.skalBrukeLiveData}
                                          linkRound={props.linkRound}
                            />;
                        })}
                    </div>);
            })}
        </div>
    );
}
