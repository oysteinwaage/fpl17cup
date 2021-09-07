import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

export let players = {
//Gruppe A
    2119845: "F.C. Syversen",
    1538696: "Sk Bunn",
    190505: "Endurers United FC",
    493208: "Dale of Norway",
    4967979: "tEAM eXtreMe",
    3605267: "GunSquad",

//Gruppe B
    828403: "Verdiløse Menn",
    1166619: "Stupakjæll_v3",
    455789: "Team Waage",
    3476572: "Champs",
    1033331: "Fk Matre",
    1: "Fantasy Average",

//Gruppe C
    2512093: "Ole Gunnar Brunost",
    381029: "SuperStar",
    5375037: "#KroenkeOut",
    143741: "Anulaibar TeOmanohit",
    3434339: "Åsane Burgunder",
    2: "Fantasy Average",

//Gruppe D
    5142137: "Polly85",
    3199103: "Puthinos",
    775134: "Hail Mary",
    3986698: "FireFartingUnicorns",
    2690935: "Minipool",
    0: "Fantasy Average",
};

export const fplAvgTeams = [0, 1, 2];

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
