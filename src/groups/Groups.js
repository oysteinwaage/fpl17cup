import React, {Component} from 'react';
import '../App.css';
import './Groups.css';
import {groups} from '../matches/Runder.js';
import {groupData} from '../App.js';
import {players} from '../utils.js';

const groupsMenmbers = {
    groupA: [326355, 2081049, 1076386, 450858, 81709, 1540895],
    groupB: [2042669, 250493, 295316, 785974, 264768, 1552181],
    groupC: [61352, 364415, 564738, 394579, 422738, 369455],
    groupD: [74819, 415753, 922352, 187450, 1067641, 1598415],
    groupE: [75546, 2601781, 855540, 0, 1259874, 2678280],
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
                                team === 0 ? "Fantasy Average" : players[team],
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
