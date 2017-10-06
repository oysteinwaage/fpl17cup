import React from 'react';
import { score, dataz } from './App.js';

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
export const allRounds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

export function Match(props) {
    return (
        <div className="match-score-container">
            <div className="match-result">
                <div className="homeTeam team">{players[props.team1]} <br/> <div className="subName">{dataz[props.team1] && dataz[props.team1].managerName}</div></div>
                <div className="score">{score(props.team1, props.team2, props.round)}</div>
                <div className="awayTeam team">{players[props.team2]} <br/> <div className="subName">{dataz[props.team2] && dataz[props.team2].managerName}</div></div>
            </div>
        </div>
    );
}

export function SelectBox(values, onChange, extraClassName = ''){
    return (
        <div className='selectBoxContainer'>
            <select className={'select_style' + extraClassName} name="selectBox" id="selectBox"
                    onChange={onChange}>
                <option value={null}>Velg runde</option>
                {values.map(val => {
                    return <option key={val} value={val}>{'Runde' + val}</option>;
                })}
            </select>
        </div>
    )
}