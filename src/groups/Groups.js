import React, {Component} from 'react';
import '../App.css';
import './Groups.css';
import {groups} from '../matches/Runder.js';
import {groupData} from '../App.js';
import {players} from '../utils.js';

const groupsMenmbers = {
    groupA: [1083723, 94232, 3041546, 86070, 1773168, 276910],
    groupB: [546878, 552058, 1413504, 144360, 92124, 71962],
    groupC: [1727710, 407749, 26900, 2287279, 2690627, 2003531],
    groupD: [446195, 454412, 1136421, 1499253, 159488, 1969508],
    groupE: [188947, 1305123, 1898765, 1261708, 1331886, 2547467],
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
                                players[team],
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
