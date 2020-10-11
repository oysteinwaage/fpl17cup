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
    {id: 120053, name: "For Fame And Glory",},
    // {id: 453594, name: "Graduates 2012 FTW!",},
    // {id: 453718, name: "PM Oversikt",},
    // {id: 883227, name: "Progit",},
    // {id: 437181, name: "Lillohøyden FC",},
    // {id: 10724, name: "200-kronersligaen",},
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
export const pmOversiktManagers = [537141, 1822874, 4309888, 2893981, 607214, 200362, 434611, 5060530, 4179755, 3090921, 3113961];
export const lillohoydenFcManagers = [3880226, 1822874, 1244151, 3130565, 4356361, 1901889, 2017801, 3189167, 2943466];
export const _200kronersligaen = [67531, 459652, 3187306, 251497, 2931055, 3029470, 1471223, 151328, 934964, 2065912, 2531378, 133698, 3194393, 48161, 313300, 60601, 2554088, 2382455, 580680, 87152, 1507107, 1149654, 2930950, 3767462, 1748600, 520455, 947380, 69423, 3316935, 199948, 4767729, 2933152, 1148906, 37348, 68522, 3203486, 1132182, 2965511, 883899, 3326262, 4978046, 3571520, 3524564];

export function getLeagueManagers(leagueId) {

    switch (leagueId) {
        case 120053:
            return forFameAndGloryManagers;
        case 453594:
            return graduatesManagers;
        case 453718:
            return pmOversiktManagers;
        case 883227:
            return progitManagers;
        case 437181:
            return lillohoydenFcManagers;
        case 10724:
            return _200kronersligaen;
        default:
            return [];
    }
}
