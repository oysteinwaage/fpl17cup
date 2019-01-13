import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

export let players = {
//Gruppe A
    326355: "FC Moneyball",
    2081049: "...The Red Devils...",
    1076386: "Lokomotiv Rosberg",
    450858: "Los Maestros",
    81709: "FK Matre",
    1540895: "Fly Emery",
//Gruppe B
    2042669: "Stolpe_inn",
    250493: "Øksen",
    295316: "Dale of Norway",
    785974: "champs",
    264768: "Løkrull United",
    1552181: "GunSquad",
//Gruppe C
    61352: "Ji-sung Parkthebus",
    364415: "FireFarting Unicorns",
    564738: "Lé Spéciellé Óne",
    394579: "We Need A Keeper",
    422738: "Verdiløse Menn",
    369455: "Dompa IL",
//Gruppe D
    74819: "AnulaiƀaR Te'oma",
    415753: "Puthinhos",
    922352: "2tt1ham",
    187450: "The lucky eleven",
    1067641: "Brillebjørn FC*",
    1598415: "teaM eXtreMe",
//Gruppe E
    75546: "Super Eagles",
    2601781: "Minipool",
    855540: "Team Waage",
    0: "Fantasy Average",
    1259874: "You big Fekir",
    2678280: "Man utd",
};

export function updatePlayerListWithNewLEagueData(newPlayersMap){
    players = newPlayersMap;
}

export const leaguesInDropdownList = [
    {id: 61858, name: "For Fame And Glory",},
    {id: 191593, name: "Graduates 2012",},
    {id: 588841, name: "Arctic Invitational",},
    {id: 277260, name: "Tikka Cup Edition LIGA",},
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
