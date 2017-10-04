import React, {Component} from 'react';
import '../App.css';
import './Groups.css';
import {groups, gamesPrGroupAndRound, getRoundNr} from '../matches/Runder.js';
import {groupData} from '../App.js';
import {players} from '../utils.js';

const groupsMenmbers = {
    groupA: [1083723, 94232, 3041546, 86070, 1773168, 276910],
    groupB: [546878, 552058, 1413504, 144360, 92124, 71962],
    groupC: [1727710, 407749, 26900, 2287279, 2690627, 2003531],
    groupD: [446195, 454412, 1136421, 1499253, 159488, 1969508],
    groupE: [188947, 1305123, 1898765, 1261708, 1331886, 2547467],
}

const groupTableHeader = (
    <tr>
        <td>Lag</td>
        <td>Kamper</td>
        <td>S</td>
        <td>U</td>
        <td>T</td>
        <td>Poeng</td>
    </tr>
)

class App extends Component {
    render() {
        return (
            <div>
                {groups.map(function (groupLetter) {
                    const groupId = 'group' + groupLetter;
                    const sortedGroupMembers = groupsMenmbers[groupId].sort(function (a, b) {
                       return groupData[b].points - groupData[a].points;
                    });
                    return (<div key={groupId}>
                        <div className='groupName'>{'Gruppe ' + groupLetter}</div>
                        {groupTableHeader}
                        {sortedGroupMembers.map(team => {
                            return (
                                <tr key={team}>
                                    <td className='name'>{players[team]}</td>
                                    <td className='matches'>{groupData[team].matches}</td>
                                    <td className='won'>{groupData[team].matchesWon}</td>
                                    <td className='draw'>{groupData[team].matchesDrawn}</td>
                                    <td className='lost'>{groupData[team].matchesLost}</td>
                                    <td className='points'>{groupData[team].points}</td>
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
