import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

export let players = {
//Gruppe A
//Gruppe B
//Gruppe C
//Gruppe D
//Gruppe E
    2253517: "Minipool",
    3249094: "GunSquad",
    18286: "Puthinhos",
    259276: "Verdiløse Menn",
    95509: "Stupakjæll",
    1822874: "Team Waage",
    113690: "The Reds",
    110138: "Dale of Norway",
    1112848: "FK Matre",
    3231757: "Live.Love.Sparkel",
    147607: "Skolebrød",
    513635: "Champs",
    987338: "Øksen",
    147378: "Strawberry Shaqiri",
    280: "Ji-Sung Parkthebus\n",
    136008: "Bjørk",
    2868768: "PanserBataljonen",
    265744: "Los Maestros",
    1127639: "FireFartingUnicorns",
    3119842: "Lallana's in Pysjmas",
    2224552: "Lé Spéciellé Óne",
    2354670: "Stonga Ballklubb",
    1976189: "teaM eXtreMe dLuX",
    2731034: "Manchester United",
    1778465: "Dompa FC",
    1770110: "2tt1ham",
    2678280: "Man utd",
    0: "Fantasy Average",
};

export function updatePlayerListWithNewLEagueData(newPlayersMap){
    players = newPlayersMap;
}

export const leaguesInDropdownList = [
    {id: 28802, name: "For Fame And Glory",},
    {id: 453594, name: "Graduates 2012",},
    {id: 453718, name: "PM Oversikt",},
    {id: 883227, name: "Progit",},
    {id: 437181, name: "Lillohøyden FC",},
];

export const participatingRounds = [3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 'Playoff', 'Utslagningsrunder'];
export const allRounds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38];

export const roundJackass = {
    roundnull: 'Får du opp denne siden her så er det fordi server driver og starter opp. Refresh siden igjen og prøv på nytt så funker det nok :D',
}

export function SelectBox(values, onChange, extraClassName = '', extraName = '', startRound) {
    return (
        <div className='selectBoxContainer'>
            <select className={'select_style' + extraClassName} name={"selectBox" + extraName} id="selectBox"
                    onChange={onChange} value={startRound}>
                <option value={null}>Velg runde</option>
                {values.map(val => {
                    return <option key={val} value={val}>{(val !== 'Utslagningsrunder' && val !== 'Playoff' ? 'Runde' : '') + val}</option>;
                })}
            </select>
        </div>
    )
}
const dropDownStyle = {
    fontSize: '16px',
    borderRadius: 0,
    width: '90%',
    padding: '7px',
    position: 'relative',
    border: '0',
    zIndex: '10',
    backgroundColor: '#dfdfdf',
    borderBottom: 'solid black 1px',
    height: '20px',
}
export function MakeDropDownMenu(values, chosenValue, onchange) {
    console.log('inniD: ', chosenValue === '5');
    return (
        <div className='selectBoxContainer'>
            <DropDownMenu
                value={parseInt(chosenValue, 10) || null}
                onChange={onchange}
                style={dropDownStyle}
                autoWidth={false}
            >
                <MenuItem value={null} primaryText="Velg runde"/>
                {values.map(val => {
                    return <MenuItem key={val} value={val} primaryText={'Runde' + val}/>;
                })}
            </DropDownMenu>
        </div>
    )
}
