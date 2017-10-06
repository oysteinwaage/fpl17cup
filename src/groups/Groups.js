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

const groupTableHeader = (
    <tr>
        <td>Lag</td>
        <td>K</td>
        <td>S</td>
        <td>U</td>
        <td>T</td>
        <td>Diff</td>
        <td>Poeng</td>
    </tr>
);

//TODO inntil jeg får fikset redux med state
function tempNullCheck(teamId){
    return groupData[teamId] || {};
}

class App extends Component {
    render() {
        return (
            <div>
                {groups.map(function (groupLetter) {
                    const groupId = 'group' + groupLetter;
                    const sortedGroupMembers = groupsMenmbers[groupId].sort(function (a, b) {
                       return tempNullCheck(b).points - tempNullCheck(a).points;
                    });
                    return (<div key={groupId}>
                        <div className='groupName'>{'Gruppe ' + groupLetter}</div>
                        {groupTableHeader}
                        {sortedGroupMembers.map(team => {
                            const teamData = tempNullCheck(team);
                            const diff = teamData.difference;
                            return (
                                <tr key={team}>
                                    <td className='name'>{players[team]}</td>
                                    <td className='matches'>{teamData.matches}</td>
                                    <td className='won'>{teamData.matchesWon}</td>
                                    <td className='draw'>{teamData.matchesDrawn}</td>
                                    <td className='lost'>{teamData.matchesLost}</td>
                                    <td className='difference'>{diff > 0 ? '+' + diff : diff}</td>
                                    <td className='points'>{teamData.points}</td>
                                </tr>
                            );
                        })}
                    </div>);
                })}
            </div>
        );
    }
}

export default App;
