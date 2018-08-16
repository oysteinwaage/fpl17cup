import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

export let players = {
//Gruppe A
    1083723: "Dompa IL",
    94232: "Herrems utvalgte",
    3041546: "Tveits utvalgte",
    86070: "Ostepølse m/bacon",
    1773168: "FC Moneyball",
    276910: "Minde Allstars",
//Gruppe B
    546878: "Kloppemarked",
    552058: "Cuencanos",
    1413504: "Gemino Rullator FC",
    144360: "Man-utd",
    92124: "Stjerna",
    71962: "GunSquad",
//Gruppe C
    1727710: "Team Waage",
    407749: "Bayern Neverlusen",
    26900: "FK Matre",
    2287279: "We Are The People",
    2690627: "Flakka Kickerz",
    2003531: "SignOnFee Lovers",
//Gruppe D
    446195: "Team champs",
    454412: "Liggeunderlaget",
    1136421: "StolpeUt",
    1499253: "Verdiløse Menn",
    159488: "Øksen",
    1969508: "Pepsi FC",
//Gruppe E
    188947: "The Reds",
    1305123: "2tt1ham",
    1898765: "Moist",
    1261708: "bad_defence",
    1331886: "Lé Spéciellé óne",
    2547467: "FK Hoggormene",
};

export function updatePlayerListWithNewLEagueData(newPlayersMap){
    players = newPlayersMap;
}

export const leaguesInDropdown = {
    61858: "For Fame And Glory",
    191593: "Graduates 2012",
    588841: "Arctic Invitational",
};

export const participatingRounds = [3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 'Playoff', 'Utslagningsrunder'];
export const allRounds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38];

export const roundJackass = {
    roundnull: 'ENDELIG er PL tilbake igjen, og med det også FPL <3 <br /> Jeg (Øystein) er bortreist denne helgen, så hvis vi er så heldig ' +
    'at Fantasy ikke har gjort noen endringer som ødelegger måten jeg henter og regner ut statistikken på så fungerer denne siden allerede fra første avspark fredag kveld :) ' +
    'MEN all min erfaring tilsier at det alltid endres på noe, så i så fall vil det begynne å fungere plutselig!' +
    '<br /> Lykke til alle sammen, og måtte den beste manager vinne! (ikke den med mest flaks slik som ifjor ;) )',
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
