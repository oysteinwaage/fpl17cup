import React from 'react';
import {Match} from './utils.js'

const gamesPrGroupAndRound = {
    round3: {
        groupA : [[1083723, 94232], [3041546, 86070], [1773168, 276910]],
        groupA2 : [1083723, 94232, 3041546, 86070, 1773168, 276910],
        groupB : [],
        groupC : [],
        groupD : [],
        groupe : [],
    }
};

export function MatchesForGroup(props) {
    return (
        <div>
            <p>Gruppe A</p>
            <Match team1={gamesPrGroupAndRound.round3.groupA[0][1]}/>
            {console.log(gamesPrGroupAndRound.round3.groupA.forEach(function (match) {
                return <Match team1={match[0]} team2={match[1]}/>;
            }))}
        </div>
    );
};
