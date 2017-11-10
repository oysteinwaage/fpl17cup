import React, {Component} from 'react';
import {IndexLink, Link} from 'react-router';
import './App.css';
import $ from 'jquery';
import {groups, gamesPrGroupAndRound, getRoundNr} from './matches/Runder.js';
import {playerIds, participatingRounds} from './utils.js';
import Dialog from 'material-ui/Dialog';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';

export let dataz = {};
export let groupData = {};
export let currentRound = null;
export let transferlist = [];
export let fplPlayers = [];

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
    playerIds.reduce(reducer1(data), {});

export function score(t1, t2, round) {
    return dataz[t1] && dataz[t1][round] ? roundScore(t1, round) + ' - ' + roundScore(t2, round) : ' - ';
}

function roundScore(team, round) {
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
            currentRound: 3,
            dialogOpen: false,
            loadingData: true,
        };
        this.setData = this.setData.bind(this);
        this.setCurrentRound = this.setCurrentRound.bind(this);
        this.toggleEasteregg = this.toggleEasteregg.bind(this);
    };

    setData(data) {
        this.setState({points: data});
        // console.log(this.state);
    }

    setCurrentRound(cur) {
        this.setState({currentRound: cur});
        currentRound = cur;
        // console.log(this.state);
    }

    componentDidMount() {
        let that = this;
        $.get("/api/score").done(function (result) {
            console.log('score-result: ', result);
            if (result && result.length > 0) {
                that.setCurrentRound(result[0].length);
                dataz = transformData(result);
                that.setData(dataz);
                // this.setState({points: transformData(result)})
                // that.forceUpdate();
                makeGroupData();
            } else if(result.name === 'GameUpdatingError'){
                alert('fantasy.premierleague.com oppdateres nå. Prøv igjen seinere :)');
            }
            $.get("/api/players").done(function (result) {
                console.log('players-result: ', result);
                if (result && result.length > 0) {
                    result.forEach(function (player) {
                        Object.assign(dataz[player.id], {
                            managerName: player.player_first_name + ' ' + player.player_last_name,
                            teamName: player.name,
                            totalTransfers: player.total_transfers,
                        });
                    });
                }
            });
            $.get("/api/chips").done(function (result) {
                if (result && result.length > 0) {
                    result.forEach(function (x) {
                        x.forEach(function (chip) {
                            Object.assign(dataz[chip.entry]['round' + chip.event], {
                                chipsPlayed: {
                                    chipName: chip.name === '3xc' ? 'Triple Captain' : chip.name,
                                    playedTime: chip.played_time_formatted,
                                }
                            })
                        })
                    })
                }
            });
            $.get("/api/league").done(function (result) {
                if (result && result.length > 0) {
                    result.forEach(function (player) {
                        Object.assign(dataz[player.entry], {
                            leagueClimb: player.last_rank - player.rank,
                            leagueRank: player.rank,
                            lastRoundLeagueRank: player.last_rank,
                        })
                    })
                }
            });
            $.get("/api/transfers").done(function (result) {
                console.log('transfers: ', result);
                if (result && result.length > 0) {
                    result.forEach(function (i) {
                        i.forEach(function (transfer) {
                            if (transferlist.indexOf(transfer.element_in) === -1) {
                                transferlist.push(transfer.element_in);
                            }
                            if (transferlist.indexOf(transfer.element_out) === -1) {
                                transferlist.push(transfer.element_out);
                            }
                            if (dataz[transfer.entry]['round' + transfer.event].transfers) {
                                dataz[transfer.entry]['round' + transfer.event].transfers.push([transfer.element_in, transfer.element_out, transfer.time_formatted]);
                            } else {
                                Object.assign(dataz[transfer.entry]['round' + transfer.event], {
                                    transfers: [[transfer.element_in, transfer.element_out, transfer.time_formatted]]
                                })
                            }
                        })
                    })
                    console.log('transferList: ', transferlist);
                }
                console.log('dataz: ', dataz);
                that.setState({loadingData: false});
            });
            $.get("/api/fplplayers").done(function (result) {
                console.log('alle spillere: ', result);
                if (result && result.length > 0) {
                    fplPlayers = result;
                }
            });
            // $.get("/api/captain2").done(function (result) {
            //     console.log('alle kapteiner2222: ', result);
            // });
        });


        // console.log('state: ', this.state);
    }

    toggleEasteregg = () => {
        this.setState({
            dialogOpen: !this.state.dialogOpen,
        });
    };

    render() {
        const actions = [
            <FlatButton
                label="Fjern dette stygge trynet!"
                primary={true}
                onClick={() => this.toggleEasteregg()}
            />,
        ];
        return (
            <div>
                <div className="overHeader">
                    <div className="headerText">
                        <h1>For Fame And <a onClick={() => this.toggleEasteregg()}>Glory</a> FPL'17 Cup-O-Rama</h1>

                    </div>
                    <div className="headerArt"/>
                </div>
                <ul className="header">
                    <li><IndexLink to="/" activeClassName="active">Kamper</IndexLink></li>
                    <li><Link to="/grupper" activeClassName="active">Grupper</Link></li>
                    <li><Link to="/funfacts" activeClassName="active">Funfacts</Link></li>
                    <li><Link to="/transfers" activeClassName="active">Bytter</Link></li>
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
                    {!this.state.loadingData && this.props.children}
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
export default App;
