import React, {Component} from 'react';
import {IndexLink, Link} from 'react-router';
import './App.css';
import {groups, gamesPrGroupAndRound, getRoundNr} from './matches/Runder.js';
import {participatingRounds, updatePlayerListWithNewLEagueData, leaguesInDropdownList, fplAvgTeams} from './utils.js';
import {getManagerList, getScore, getStats} from './api.js';
import Dialog from 'material-ui/Dialog';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import ActionInfo from 'material-ui/svg-icons/action/help';
import Popover from 'material-ui/Popover/Popover';

export let dataz = {};
export let groupData = {};
export let currentRound = null;
export let transferlist = [];
export let fplPlayers = [];
export let loadedPlayerIds = [];
export let leagueStandings = [];
export let averageRoundScore = {};
let leagueIdChosenByUser = 0;

export function isForFameAndGloryLeague() {
    return leagueIdChosenByUser === 28802;
}

const reducer2 = (a, b) => {
    const totalPointsOnBench = (a.totalPointsOnBench !== undefined ? a.totalPointsOnBench : 0) + b.points_on_bench;
    const totalHitsTaken = (a.totalHitsTaken !== undefined ? a.totalHitsTaken : 0) + b.event_transfers_cost;
    Object.assign(a, {
        ['round' + b.event]: {
            points: b.points - b.event_transfers_cost,
            pointsOnBench: b.points_on_bench,
            takenHit: b.event_transfers_cost,
        },
        totalPointsOnBench,
        totalHitsTaken,
    });
    return a;
};

const reducer1 = data => (acc, current) => {
    acc[current] = data[Object.keys(acc).length].reduce(reducer2, {});
    return acc;
};

const transformData = data =>
    loadedPlayerIds.reduce(reducer1(data), {});

export function score(t1, t2, round) {
    return (dataz[t1] && dataz[t1][round]) || (dataz[t2] && dataz[t2][round])
        ? roundScore(t1, round) + (' - ' + roundScore(t2, round))
        : ' - ';
}

function roundScore(team, round) {
    if (fplAvgTeams.includes(team)) {
        return averageRoundScore[round.slice(5)-1].average_entry_score;
    }
    return dataz[team] && dataz[team][round] ? dataz[team][round].points : 0;
}

function newPointsFor(team, winningTeam) {
    const originalPoints = groupData[team] ? groupData[team].points : 0;
    if (winningTeam === team) {
        return originalPoints + 3;
    } else if (winningTeam === 'draw') {
        return originalPoints + 1;
    }
    return originalPoints;
}

function newMatchesWonFor(team, winningTeam) {
    const originalValue = groupData[team] ? groupData[team].matchesWon : 0;
    return winningTeam === team ? originalValue + 1 : originalValue;
}

function newMatchesDrawnFor(team, winningTeam) {
    const originalValue = groupData[team] ? groupData[team].matchesDrawn : 0;
    return winningTeam === 'draw' ? originalValue + 1 : originalValue;
}

function newMatchesLostFor(team, winningTeam) {
    const originalValue = groupData[team] ? groupData[team].matchesLost : 0;
    return winningTeam !== 'draw' && winningTeam !== team ? originalValue + 1 : originalValue;
}

function updateGroupData(team1, team2, round) {
    const team1Score = roundScore(team1, round);
    const team2Score = roundScore(team2, round);
    const winningTeam = team1Score > team2Score ? team1 : team1Score === team2Score ? 'draw' : team2;
    Object.assign(groupData, {
        [team1]: {
            points: newPointsFor(team1, winningTeam),
            matches: groupData[team1] ? groupData[team1].matches + 1 : 1,
            matchesWon: newMatchesWonFor(team1, winningTeam),
            matchesDrawn: newMatchesDrawnFor(team1, winningTeam),
            matchesLost: newMatchesLostFor(team1, winningTeam),
            difference: groupData[team1] ? groupData[team1].difference + (team1Score - team2Score) : team1Score - team2Score,
        },
        [team2]: {
            points: newPointsFor(team2, winningTeam),
            matches: groupData[team2] ? groupData[team2].matches + 1 : 1,
            matchesWon: newMatchesWonFor(team2, winningTeam),
            matchesDrawn: newMatchesDrawnFor(team2, winningTeam),
            matchesLost: newMatchesLostFor(team2, winningTeam),
            difference: groupData[team2] ? groupData[team2].difference + (team2Score - team1Score) : team2Score - team1Score,
        }
    })
}


function makeGroupData() {
    participatingRounds.filter(pr => pr <= currentRound).forEach(function (r) {
        groups.forEach(function (groupLetter) {
            const groupId = 'group' + groupLetter;
            gamesPrGroupAndRound[getRoundNr(r)][groupId].forEach(match => {
                updateGroupData(match[0], match[1], 'round' + r);
            })
        })
    })
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            points: {},
            currentRound: 8,
            dialogOpen: false,
            loadingData: false,
            chosenLeagueId: false,
            leagueId: 28802,
            leagueName: 'Liganavn',
            showLeagueIdInfo: false,
            leagueIdChosenByUser: '',
        };
        this.setData = this.setData.bind(this);
        this.setCurrentRound = this.setCurrentRound.bind(this);
        this.toggleEasteregg = this.toggleEasteregg.bind(this);
        this.toggleShowLeagueIdInfo = this.toggleShowLeagueIdInfo.bind(this);
    };

    setData(data) {
        this.setState({points: data});
    }

    setCurrentRound(cur) {
        this.setState({currentRound: cur});
        currentRound = cur;
    }

    componentDidMount() {
        // TODO Fjern alt dette når ligavelger skal inn igjen. Husk å kommenter inn det som ligger i
        // TODO triggerFetchDataFromServer igjen og!
        this.setState({chosenLeagueId: 28802, leagueIdChosenByUser: 28802});
        leagueIdChosenByUser = 28802;
        this.triggerFetchDataFromServer();
    }

    fetchDataFromServer() {
        let that = this;

        getManagerList(this.state.leagueIdChosenByUser).then(data => {
            if (data && data.managers && data.managers.length > 0) {
                loadedPlayerIds = data.managers;
                that.state.leagueName = data.leagueName;
                getStats().then(data => averageRoundScore = data);
                getScore().then(data => {
                    that.setCurrentRound(data[0].data.entry.current_event);
                    dataz = transformData(data.map(a => a.data.entry.history.current))
                    console.log(dataz);
                    that.setData(dataz);
                    makeGroupData();
                    that.setState({loadingData: false}); 
                });
            } else {
                that.setState({loadingData: false});
            }

        });

        // $.get("/api/getManagerList?leagueId=" + this.state.leagueIdChosenByUser).done(function (data) {
        //     if (data && data.managers && data.managers.length > 0) {
        //         loadedPlayerIds = data.managers;
        //         that.state.leagueName = data.leagueName;
        //         $.get("/api/stats").done(function (result) {
        //             averageRoundScore = result;
        //         });
        //
        //         $.get("/api/score").done(function (result) {
        //             console.log('score-result: ', result);
        //             if (result && result.length > 0) {
        //                 that.setCurrentRound(result[0].length);
        //                 dataz = transformData(result);
        //                 that.setData(dataz);
        //                 makeGroupData();
        //             } else if (result.name === 'GameUpdatingError') {
        //                 alert('fantasy.premierleague.com oppdateres nå. Prøv igjen seinere :)');
        //             }
        //             $.get("/api/players").done(function (result) {
        //                 console.log('players-result: ', result);
        //                 if (result && result.length > 0) {
        //                     result.forEach(function (player) {
        //                         Object.assign(dataz[player.id], {
        //                             managerName: player.player_first_name + ' ' + player.player_last_name,
        //                             teamName: player.name,
        //                             totalTransfers: player.total_transfers,
        //                         });
        //                     });
        //                 }
        //             });
        //             $.get("/api/chips").done(function (result) {
        //                 if (result && result.length > 0) {
        //                     result.forEach(function (x) {
        //                         x.forEach(function (chip) {
        //                             Object.assign(dataz[chip.entry]['round' + chip.event], {
        //                                 chipsPlayed: {
        //                                     chipName: chip.name === '3xc' ? 'Triple Captain' : chip.name,
        //                                     playedTime: chip.played_time_formatted,
        //                                 }
        //                             })
        //                         })
        //                     })
        //                 }
        //             });
        //             $.get("/api/league").done(function (result) {
        //                 if (result && result.length > 0) {
        //                     leagueStandings = result;
        //                     result.forEach(function (player) {
        //                         Object.assign(dataz[player.entry], {
        //                             leagueClimb: player.last_rank - player.rank,
        //                             leagueRank: player.rank,
        //                             lastRoundLeagueRank: player.last_rank,
        //                         })
        //                     })
        //                     let teamNameToIdMap = {};
        //                     result.forEach(function (player) {
        //                         Object.assign(teamNameToIdMap, {
        //                             [player.entry]: player.entry_name,
        //                         });
        //                     });
        //                     updatePlayerListWithNewLEagueData(teamNameToIdMap);
        //                 }
        //             });
        //             $.get("/api/fplplayers").done(function (result) {
        //                 if (result && result.length > 0) {
        //                     fplPlayers = result;
        //                 }
        //             });
        //             $.get("/api/transfers").done(function (result) {
        //                 console.log('transfers: ', result);
        //                 if (result && result.length > 0) {
        //                     result.forEach(function (i) {
        //                         i.forEach(function (transfer) {
        //                             if (transferlist.indexOf(transfer.element_in) === -1) {
        //                                 transferlist.push(transfer.element_in);
        //                             }
        //                             if (transferlist.indexOf(transfer.element_out) === -1) {
        //                                 transferlist.push(transfer.element_out);
        //                             }
        //                             if (dataz[transfer.entry]['round' + transfer.event].transfers) {
        //                                 dataz[transfer.entry]['round' + transfer.event].transfers.push([transfer.element_in, transfer.element_out, transfer.time_formatted]);
        //                             } else {
        //                                 Object.assign(dataz[transfer.entry]['round' + transfer.event], {
        //                                     transfers: [[transfer.element_in, transfer.element_out, transfer.time_formatted]]
        //                                 })
        //                             }
        //                         })
        //                     })
        //                 }
        //                 console.log('dataz: ', dataz);
        //                 that.setState({loadingData: false});
        //             });
        //             // $.get("/api/captain2").done(function (result) {
        //             //     console.log('alle kapteiner2222: ', result);
        //             // });
        //         });
        //     } else if (data && data.managers && data.managers.length === 0) {
        //         that.setState({loadingData: false});
        //     }
        // });
    }

    toggleEasteregg = () => {
        this.setState({
            dialogOpen: !this.state.dialogOpen,
        });
    };

    updateLeagueId = (newId) => {
        this.setState({
            leagueIdChosenByUser: newId,
        });
    };

    triggerFetchDataFromServer = () => {
        this.setState({
            loadingData: true,
            chosenLeagueId: true,
        });
        // TODO må inn igjen når ligavelgeren går live igjen!
        // leagueIdChosenByUser = this.state.leagueIdChosenByUser;
        this.fetchDataFromServer();
    };

    toggleShowLeagueIdInfo(event) {
        this.setState({
            showLeagueIdInfo: !this.state.showLeagueIdInfo,
            anchorEl: event.currentTarget,
        });
    };

    handleTouchTap = (event) => {
        // This prevents ghost click.
    };

    handleLigavalgFraDropdown = (event, index, value) => {
        this.updateLeagueId(value);
    };

    render() {
        const actions = [
            <RaisedButton
                label="Fjern dette stygge trynet!"
                primary={true}
                onClick={() => this.toggleEasteregg()}
            />,
        ];
        const brukVaarLigaKnapp = [
            <RaisedButton
                label="Gå videre med valgt liga"
                onClick={() => this.triggerFetchDataFromServer()}
                disabled={this.state.leagueIdChosenByUser === ''}
            />,
        ];

        return (
            <div>
                <div className="overHeader">
                    <div className="headerText">
                        {isForFameAndGloryLeague() &&
                        <h1>For Fame And <a onClick={() => this.toggleEasteregg()}>Glory</a> FPL'18 Cup-O-Rama</h1>
                        }
                        {!isForFameAndGloryLeague() &&
                        <h1>{this.state.leagueName}</h1>
                        }

                    </div>
                    <div className="headerArt"/>
                </div>
                <ul className="header">
                    {isForFameAndGloryLeague() &&
                    <div>
                        <li><Link to="/kamper" activeClassName="active">Kamper</Link></li>
                        <li><Link to="/grupper" activeClassName="active">Grupper</Link></li>
                        <li><IndexLink to="/" activeClassName="active">Funfacts</IndexLink></li>
                        {/*<li><Link to="/transfers" activeClassName="active">Bytter</Link></li>*/}
                        {/*<li><Link to="/leaguetable" activeClassName="active">Tabell</Link></li>*/}
                    </div>
                    }
                    {!isForFameAndGloryLeague() &&
                    <div>
                        <li><IndexLink to="/" activeClassName="active">Funfacts</IndexLink></li>
                        {/*<li><Link to="/transfers" activeClassName="active">Bytter</Link></li>*/}
                        {/*<li><Link to="/leaguetable" activeClassName="active">Tabell</Link></li>*/}
                    </div>
                    }
                </ul>
                <MuiThemeProvider>
                    <Dialog
                        title={"ALL HAIL KING EIVIND"}
                        actions={actions}
                        modal={false}
                        open={this.state.dialogOpen}
                        onRequestClose={() => this.toggleEasteregg()}
                        contentStyle={customContentStyle}
                        autoScrollBodyContent={true}
                    >
                        <img src={require('./images/helligeThane.jpg')} alt="Kongen" width="250" height="300"></img>
                    </Dialog>
                </MuiThemeProvider>

                <div className="content">
                    {this.state.loadingData &&
                    <MuiThemeProvider>
                        <Dialog
                            title={"Laster og kalkulerer data"}
                            open={this.state.loadingData}
                            contentStyle={customContentStyle}
                        >
                            <CircularProgress size={80} thickness={5}/>
                        </Dialog>
                    </MuiThemeProvider>
                    }
                    {!this.state.chosenLeagueId &&
                    <MuiThemeProvider>
                        <Dialog
                            title={"Fyll inn id'en på din FPL liga"}
                            open={!this.state.chosenLeagueId}
                            contentStyle={customContentStyle}
                            actions={brukVaarLigaKnapp}
                        >
                            <p style={{color: 'red', fontSize: 'small'}}> Pga. oppdateringer i API'et til FPL er denne
                                siden ute
                                av drift enn så lenge. Det jobbes med å få den opp igjen, så plutselig er vi tilbake :)

                                {/*Pga begrensninger i API'et til FPL får man pr.*/}
                                {/*nå kun med data for de 50 beste i ligaen :/*/}
                            </p>
                            <TextField
                                hintText="eks: 61858"
                                floatingLabelText="Fyll inn ID for din liga her"
                                value={this.state.leagueIdChosenByUser}
                                onChange={(event, newValue) => this.updateLeagueId(newValue)}
                            />
                            <ActionInfo
                                style={actionInfoStyle}
                                onClick={(event) => this.toggleShowLeagueIdInfo(event)}
                            />
                            <br/>
                            <DropDownMenu
                                value={leaguesInDropdownList.find(l => l.id === this.state.leagueIdChosenByUser) ? this.state.leagueIdChosenByUser : ''}
                                onChange={this.handleLigavalgFraDropdown}
                                autoWidth={false}
                                className="dropdownLeagues"
                            >
                                {leaguesInDropdownList.map(league => <MenuItem key={league.id} value={league.id}
                                                                               primaryText={league.name}/>)}
                                <MenuItem value={''} primaryText="Eller velg liga her"/>
                            </DropDownMenu>
                            <Popover
                                open={this.state.showLeagueIdInfo}
                                anchorEl={this.state.anchorEl}
                                anchorOrigin={{"horizontal": "middle", "vertical": "top"}}
                                targetOrigin={{"horizontal": "middle", "vertical": "bottom"}}
                                onRequestClose={(event) => this.toggleShowLeagueIdInfo(event)}
                                contentStyle={customContentStyle}
                            >
                                Du finner id'en til din liga ved å gå inn på ønsket liga i nettleseren og se i
                                URL'en.<br/>
                                Det ser typisk slik ut:<br/> https://fantasy.premierleague.com/a/ leagues/standings/<a
                                style={{fontStyle: 'italic', fontWeight: 'bold'}}>976245</a>/classic
                            </Popover>
                        </Dialog>
                    </MuiThemeProvider>
                    }
                    {!this.state.loadingData && this.state.chosenLeagueId && this.props.children}
                </div>
            </div>
        );
    }
}

const customContentStyle = {
    width: '90%',
    maxWidth: '90%',
    height: '90%',
    maxHeight: '90%',
    textAlign: 'center',
};
const actionInfoStyle = {
    // TODO funker ikke med hover. sjekk ut.
    '&:hover': {
        color: 'yellow'
    }
}
export default App;
