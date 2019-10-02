import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

export let players = {
//Gruppe A
    2224552: "Lé Spéciellé Óne",
    3249094: "GunSquad",
    113690: "The Reds",
    18286: "Puthinhos",
    2253517: "Minipool",
    0: "Fantasy Average",
//Gruppe B
    2354670: "Stonga Ballklubb",
    2731034: "Manchester United",
    3231757: "Live.Love.Sparkel",
    1770110: "2tt1ham",
    95509: "Stupakjæll",
    1: "Fantasy Average",
//Gruppe C
    265744: "Los Maestros",
    2: "Fantasy Average",
    1976189: "teaM eXtreMe dLuX",
    3119842: "Lallana's in Pysjmas",
    136008: "Bjørk",
    1778465: "Dompa FC",
//Gruppe D
    147607: "Skolebrød",
    147378: "Strawberry Shaqiri",
    1822874: "Team Waage",
    1112848: "FK Matre",
    513635: "Champs",
    3: "Fantasy Average",

//Gruppe E
    280: "Ji-Sung Parkthebus",
    110138: "Dale of Norway",
    987338: "Øksen",
    259276: "Verdiløse Menn",
    1127639: "FireFartingUnicorns",
    2868768: "PanserBataljonen",
};

export const fplAvgTeams = [0, 1, 2, 3];

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

export const participatingRounds = [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 'Playoff', 'Utslagningsrunder'];
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
