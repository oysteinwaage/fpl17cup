import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

export const players = {
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

export const playerIds = [
    1727710, 1773168, 446195, 92124, 407749, 1261708, 1898765,
    2690627, 2547467, 144360, 1305123, 1331886, 3041546,
    26900, 1969508, 454412, 2003531, 1083723, 546878, 188947,
    1136421, 159488, 1499253, 86070, 94232, 1413504, 552058,
    276910, 71962, 2287279
];

export const participatingRounds = [3, 5, 7, 9, 11, 13, 15, 17, 19, 21];
export const allRounds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38];

export const roundJackass = {
    round1: 'En av de viktigste aspektene med Fantasy Premier League er å snakke dritt om de andre spillerne i ligaen din, og da spesielt ' +
    'sparke de som ligger nede så hardt som mulig, eller å jekke ned de idiotene med mer flaks enn hjerne! Denne spalten er opprettet til nettopp dette formålet.' +
    '<br /> En ikke-navngitt deltager i ligaen vår vil hver runde (fra runde 7) plukke ut en stakkar som får revet seg et nytt rævhål i denne spalten! Enjoy! :x',
    round7: 'Etter å ha tatt den nette sum av 28p hit på de tre siste rundene skulle man tro at det hadde rablet fullstendig for Mr Sæthre, ' +
    'men den mannen har tydeligvis så intenst mye gullhår i ræven at eneste anbefaling må være å bruke alle pengene han har på lotto i tiden fremover! ' +
    'Det at han også har svidd av både freehit og wildcard allerede er også et klart tegn på at mannen er en bytte-junkie av rang og det finnes ingen tegn på at ' +
    'han har tenkt å roe seg med det første!' +
    '<br /> MEN denne flaksen kan ikke fortsette, og då vil din sinnsyke taktikk dra deg ned i dritten der du hører hjemme!',
    round8: 'Rundens store taper må jo bli Cuencanos med imponerende 18 poeng og jumbo plass etter 8 runder. Riktig nok ble det 22 poeng, men det er ikke inkludert hits.' +
    '18 poeng er så imponerende elendig at det ikke kan gå upåaktet hen. Poeng fangsten gir ett pent snitt på 1,6 poeng pr spiller som må være verdensrekord for en aktiv spiller.<br />' +
    'En kan undres i om det er grunnet Liverpool sin middelmådige seriestart. Det kan se ut som det er en slags sammenheng mellom fantasy spillere og Liverpool supportere. <br />' +
    'Men vi får håpe du kommer sterkere tilbake for ingenting kan jo bli værre enn dette!',
}

export function SelectBox(values, onChange, extraClassName = '', extraName = '') {
    return (
        <div className='selectBoxContainer'>
            <select className={'select_style' + extraClassName} name={"selectBox" + extraName} id="selectBox"
                    onChange={onChange}>
                <option value={null}>Velg runde</option>
                {values.map(val => {
                    return <option key={val} value={val}>{'Runde' + val}</option>;
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
                value={parseInt(chosenValue) || null}
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
