import React, {Component} from 'react';
import '../App.css';
import './Groups.css';
import {groups} from '../matches/Runder.js';
import {groupData} from '../App.js';
import {players} from '../utils.js';

const groupsMenmbers = {
    groupA: [2224552, 3249094, 113690, 18286, 2253517, 0],
    groupB: [2354670, 2731034, 3231757, 1770110, 95509, 1],
    groupC: [265744, 2, 1976189, 3119842, 136008, 1778465],
    groupD: [147607, 147378, 1822874, 1112848, 513635, 3],
    groupE: [280, 110138, 987338, 259276, 1127639, 2868768],
};

function makeRow(team, matches, wins, draws, lost, goalDiff, points, extraClassname = "") {
    return (
        <div key={team} className={"gruppeRad" + extraClassname}>
            <div className="groupTeam">{team}</div>
            <div className="groupMatches">{matches}</div>
            <div className="groupMatches">{wins}</div>
            <div className="groupMatches">{draws}</div>
            <div className="groupMatches">{lost}</div>
            <div className="groupGoalDiff">{goalDiff}</div>
            <div className="groupPoints">{points}</div>
        </div>
    )
}

//TODO inntil jeg får fikset redux med state
function tempNullCheck(teamId) {
    return groupData[teamId] || {};
}

class App extends Component {
    render() {
        return (
            <div className="group-content">
                {groups.map(function (groupLetter) {
                    const groupId = 'group' + groupLetter;
                    const sortedGroupMembers = groupsMenmbers[groupId].sort(function (a, b) {
                        return tempNullCheck(b).difference - tempNullCheck(a).difference;
                    }).sort(function (a, b) {
                        return tempNullCheck(b).points - tempNullCheck(a).points;
                    });
                    return (<div key={groupId}>
                        <div className='groupName'>{'Gruppe ' + groupLetter}</div>
                        {makeRow('Lag', 'K', 'S', 'U', 'T', 'Diff', 'Poeng', 'Header')}
                        {sortedGroupMembers.map(team => {
                            const teamData = tempNullCheck(team);
                            const diff = teamData.difference > 0 ? '+' + teamData.difference : teamData.difference;
                            return makeRow(
                                team < 4  ? "Fantasy Average" : players[team],
                                teamData.matches,
                                teamData.matchesWon,
                                teamData.matchesDrawn,
                                teamData.matchesLost,
                                diff,
                                teamData.points
                            );
                        })}
                    </div>);
                })}
            </div>
        );
    }
}

export default App;
