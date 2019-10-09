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

export function updatePlayerListWithNewLEagueData(newPlayersMap) {
    players = newPlayersMap;
}

export const leaguesInDropdownList = [
    {id: 28802, name: "For Fame And Glory",},
    {id: 453594, name: "Graduates 2012 FTW!",},
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
                    return <option key={val}
                                   value={val}>{(val !== 'Utslagningsrunder' && val !== 'Playoff' ? 'Runde' : '') + val}</option>;
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

export const forFameAndGloryManagers = [2253517, 3249094, 18286, 259276, 95509, 1822874, 113690, 110138, 1112848, 3231757, 147607, 513635, 987338,
    147378, 280, 136008, 2868768, 265744, 1127639, 3119842, 2224552, 2354670, 1976189, 2731034, 1778465, 1770110];
export const graduatesManagers = [321128, 1822874, 413111, 2072291, 439368];
export const progitManagers = [2347541, 1822874, 3959205, 3706260, 2886116, 3959217, 5449341];
export const pmOversiktManagers = [537141, 1822874, 4309888, 2893981, 607214, 200362, 434611, 5060530, 4179755, 3090921, 3113961];
export const lillohoydenFcManagers = [3880226, 1822874, 1244151, 3130565, 4356361, 1901889, 2017801, 3189167, 2943466];

export function getLeagueManagers(leagueId) {

    switch (leagueId) {
        case 28802:
            return forFameAndGloryManagers;
        case 453594:
            return graduatesManagers;
        case 453718:
            return pmOversiktManagers;
        case 883227:
            return progitManagers;
        case 437181:
            return lillohoydenFcManagers;
        default:
            return [];
    }
}
