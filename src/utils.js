import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

export let players = {
//Gruppe A
    737536: "Verdiløse Menn",
    1259705: "Puthinos",
    1618273: "Lé Spéciellé Óne",
    130438: "Dale of Norway",
    2249091: "FireFartingUnicorns",
    3958980: "Sk Bunn",
//Gruppe B
    3930276: "GunSquad",
    126466: "Skøelv",
    3034647: "pollyeid",
    1025143: "SuperStar",
    3524888: "Champs",
    1: "Fantasy Average",
//Gruppe C
    18575: "Tryhards United",
    2: "Fantasy Average",
    1260577: "Peanutbutterfalcons",
    444051: "The Red's",
    552453: "Minipool",
    210166: "Stupakjæll_v2",
//Gruppe D
    531121: "Team Waage",
    1884253: "KistebakkaneClimbers",
    4984122: "tEAM eXtreMe",
    131342: "Ji- Sung Parkthebus",
    1159430: "Marka",
    3: "Fantasy Average",

//Gruppe E
    2218701: "F.C. Syversen",
    493380: "Anulaibar Teoma",
    219691: "Fk Matre",
    3126178: "All Or Nothing",
    404123: "Los Maestros",
    0: "Fantasy Average",
};

export const fplAvgTeams = [0, 1, 2, 3];

export const leaguesInDropdownList = [
    {id: 819162, name: "For Fame And Glory",},
    {id: 82644, name: "Graduates 2012 FTW!",},
    {id: 160380, name: "Progit",},
    {id: 821762, name: "Never Give Up",},
    {id: 820777, name: "Holmen League",},
    {id: 149222, name: "200-kroners ligaen",},
    {id: 1308129, name: "Oversikt Alumni",},
    {id: 583961, name: "Øliteserien",},
];

export const participatingRounds = [4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 'Playoff', 'Utslagningsrunder'];
export const allRounds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38];
export const roundsUpTilNow = (currentround) => allRounds.filter(r => r <= currentround);

export const roundJackass = {
    roundnull: 'Får du opp denne siden her så er det fordi server driver og starter opp. Refresh siden igjen og prøv på nytt så funker det nok :D',
};

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
};

export function MakeDropDownMenu(values, chosenValue, onchange) {
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

export const forFameAndGloryManagers = [210166, 4984122, 2249091, 1159430, 126466, 404123, 130438, 1025143, 493380, 552453, 1260577, 1618273, 219691, 1259705, 3958980, 444051, 3034647, 531121, 2218701, 131342, 3524888, 3930276, 3126178, 737536, 18575, 1884253 ];
export const graduatesManagers = [321128, 1822874, 413111, 2072291, 439368];
export const progitManagers = [2347541, 1822874, 3959205, 3706260, 2886116, 3959217, 5449341];

export function getLeagueManagers(leagueId) {

    switch (leagueId) {
        case 120053:
            return forFameAndGloryManagers;
        case 453594:
            return graduatesManagers;
        case 524841:
            return progitManagers;
        default:
            return [];
    }
}
