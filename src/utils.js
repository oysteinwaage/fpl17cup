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

export const participatingRounds = [3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 'Playoff', 'Utslagningsrunder'];
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
    round9: 'Regjerende mester. Selvproklamert ekspert. Et ego til å matche Niklas Bendtner. Og ferdigheter på samme nivå som Lord Bendtner. 25 poeng! <br /> ' +
    'Rundens drittfyr kan kun være en mann: Øksen! Har levert elendige prestasjoner i hele år, og det topper seg i denne runden her. ' +
    'Bytter ut Lacazette for Morata før runden, får ikke til nokke som helst. Med urokkelig tro på Failmino så er vel ikke dette mer enn han fortjener. ' +
    'Blanket i 7 av 9 runder, med det e alltid plass på Øksen sitt lag. Spissrekken kompletteres med Jesus, som var kaptein for runden. ' +
    'Ingen Frelse å hente hos Jesus, så det ble kun 5 poeng på spissrekken. <br />' +
    'Løpet e kjørt for Øksen i år, men siden han e Liverpool supporter e d vel passende å si; «neste år blir ditt år»',
    round10: 'ordtaket sier; "det er lov å ha flaks" Tror likevel ikke at dette er gjeldende i de episke proposjonene når det kommer til Rundens drittfyr. <br />' +
    'Etter å ha kapteinet Aguero (seriøst, kem gjør sånt? han spilte 120 min på onsdag... Stevie Wonder kunne sett at han måtte bli benket), ' +
    'har han satt visekaptein på Sané, og fikk dermed 12 ekstra poeng for sin dumskap. OG ikke nok me d(!), ' +
    'han fikk faen meg inn Davis me 10 poeng fra benken og! <br />Bare for å gjøre fadesen komplett så tok han inn Aguero til denne runden, ' +
    'og fikk altså betalt med 22 ekstra poeng og delt best score for et elendi bytte denne runden! <br /><br /> Gratulerer Flakka Kickerz som Rundens drittfyr',
    round11: 'D e lett å sparke de som ligger nede og d e lett å "ta" de i toppen, men dette e en hyllest til "dritten i midten".' +
    ' Med en runde helt på det jevne, en tabellplassering helt på det jevne, skulle man tro at Man-utd slapp unna. ' +
    '<br />MEN DEN GANG EI! En hel haug med feilvurderingen i egen tropp har klart å gjøre ham til "rundens drittfyr". ' +
    'Han byttet inn Sané og Kane til denne runden, tok ut KDB og Jesus. 11 poeng i minus der altså. ' +
    'På tross av at wembley spøkelset, alle voodoo forhekselser og snåsamannen har sagt at Kane sliter på ' +
    'wembley klarte han å kaste bort trippel captain på Kane denne runden.... ' +
    '<br /> <br />Gratulerer! Du vant prisen for de 3 dårligste avgjørelsene denne runden!'
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
