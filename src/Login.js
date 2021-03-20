import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
// TODO disse her må du bli kvitt og bytte ut med nye @material-ui
import Dialog from 'material-ui/Dialog';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover/Popover';

import Tooltip from '@material-ui/core/Tooltip';
import HelpIcon from '@material-ui/icons/Help';
import TextField from '@material-ui/core/TextField';
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import {push} from "connected-react-router";
import './App.css';
import {
    updateChosenLeagueId,
    updateGroupData as updateGroupDataAction,
    updatePlayersList,
    setScoreData,
    setRoundStats,
    updateTransfers,
    updateIsLoadingData,
    updateLeagueData,
    setLiveData, entryPicksFetched
} from './actions/actions';
import {groups, gamesPrGroupAndRound, getRoundNr} from './matches/Runder.js';
import {participatingRounds, leaguesInDropdownList, fplAvgTeams} from './utils.js';
import {getManagerList, getStats, getRoundScores, getTransfers, getLiveData} from './api.js';
import TeamStatsModal from "./components/TeamStatsModal";
import {getEntryPicks} from "./api";
import {roundLiveScore} from "./matches/Runder";

let groupData = {};
export let roundStats = {};

export function isForFameAndGloryLeague(id) {
    return id === 120053;
}

export function roundScore(team, round, dataz) {
    if (fplAvgTeams.includes(team)) {
        return roundStats[round.slice(5)].average_entry_score;
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

function updateGroupData(team1, team2, round, dataz, liveData) {
    const team1Score = round === dataz.currentRound && liveData ? roundLiveScore(team1, liveData) : roundScore(team1, round, dataz);
    const team2Score = round === dataz.currentRound && liveData ? roundLiveScore(team2, liveData) : roundScore(team2, round, dataz);
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

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chosenLeagueId: false,
            leagueId: 120053,
            leagueName: 'Liganavn',
            showLeagueIdInfo: false,
            leagueIdInputField: '',
        };
        this.toggleShowLeagueIdInfo = this.toggleShowLeagueIdInfo.bind(this);
        this.handleLigavalgFraInput = this.handleLigavalgFraInput.bind(this);
        this.props.onAapneNySide('');
    };

    // TODO flytt til reducer
    makeGroupData = (liveData) => {
        const {currentRound, onUpdateGroupData, dataz} = this.props;
        groupData = {};
        participatingRounds.filter(pr => pr <= currentRound).forEach(function (r) {
            groups.forEach(function (groupLetter) {
                const groupId = 'group' + groupLetter;
                gamesPrGroupAndRound[getRoundNr(r)][groupId].forEach(match => {
                    updateGroupData(match[0], match[1], 'round' + r, dataz, liveData);
                })
            })
        });
        onUpdateGroupData(groupData);
    };

    fetchLiveData() {
        const {currentRound, onSetLiveData, isCurrentRoundFinished, liveScore} = this.props;
        if (!isCurrentRoundFinished) {
            getLiveData(currentRound)
                .then(liveData => {
                    if (liveScore.averageScore) {
                        this.makeGroupData(liveScore)
                    }
                    onSetLiveData(liveData)
                });
        } else {
            clearInterval(this.intervalId);
        }
    }

    fetchDataFromServer() {
        const {
            leagueIdChosenByUser, onUpdatePlayersList, onSetRoundStats, onAapneNySide, onUpdateLeagueData,
            onSetScoreData, onUpdateTransfers, onUpdateIsLoadingData, onSetLiveData, onEntryPicksFetched
        } = this.props;
        let that = this;

        // getTestNoe();

        getManagerList(leagueIdChosenByUser).then(leagueData => {
            if (leagueData && leagueData.managers && leagueData.managers.length > 0) {
                onUpdateLeagueData(leagueData);
                that.state.leagueName = leagueData.leagueName;
                getStats().then(stats => {
                    console.log('getStats: ', stats);
                    roundStats = stats;
                    onSetRoundStats(stats);

                    getRoundScores(leagueData.managers).then(scoreData => {
                        console.log('score: ', scoreData);
                        onSetScoreData(scoreData);
                        this.makeGroupData();
                        const localCurrentRound = scoreData[0].entry.current_event;
                        getEntryPicks(leagueData.managers, localCurrentRound)
                            .then(entryPicks => {
                                getLiveData(localCurrentRound)
                                    .then(liveData => onSetLiveData(liveData, stats[localCurrentRound].average_entry_score));
                                this.intervalId = setInterval(this.fetchLiveData.bind(this), 60000);

                                onEntryPicksFetched(entryPicks)
                            });

                        // TODO flytt denne her inn i samme reducer-innslag som onSetScoreData (og rename den actionene den..)
                        // setter map med id: lagNavn
                        let teamNameToIdMap = {};
                        scoreData.forEach(function (player) {
                            Object.assign(teamNameToIdMap, {
                                [player.entry.id]: player.entry.name,
                            });
                        });
                        onUpdatePlayersList(teamNameToIdMap);

                        getTransfers(leagueData.managers).then(result => {
                            onUpdateTransfers(result);
                            // if (result && result.length > 0) {
                            //     result.forEach(function (i) {
                            //         i.forEach(function (transfer) {
                            //             const tidspunkt = new Date(transfer.time).toLocaleDateString() + ' ' + new Date(transfer.time).toLocaleTimeString();
                            //             if (dataz[transfer.entry]['round' + transfer.event].transfers) {
                            //                 dataz[transfer.entry]['round' + transfer.event].transfers.push([transfer.element_in, transfer.element_out, tidspunkt]);
                            //             } else {
                            //                 Object.assign(dataz[transfer.entry]['round' + transfer.event], {
                            //                     transfers: [[transfer.element_in, transfer.element_out, tidspunkt]]
                            //                 })
                            //             }
                            //         })
                            //     })
                            // }
                            // console.log('dataz: ', dataz);
                            onUpdateIsLoadingData(false);
                            onAapneNySide('funfacts');
                        });
                    })
                });
            } else {
                onUpdateIsLoadingData(false);
            }
        });
    }

    triggerFetchDataFromServer = () => {
        const {onUpdateIsLoadingData} = this.props;
        onUpdateIsLoadingData(true);
        this.setState({
            chosenLeagueId: true,
        });
        this.fetchDataFromServer();
    };

    toggleShowLeagueIdInfo(event) {
        this.setState({
            showLeagueIdInfo: !this.state.showLeagueIdInfo,
            anchorEl: event.currentTarget,
        });
    };

    handleTouchTap = () => {
        // This prevents ghost click.
    };

    handleLigavalgFraDropdown = (event, index, value) => {
        this.setState({leagueIdInputField: value});
        this.props.onUpdateChosenLeagueId(value);
    };

    handleLigavalgFraInput = (event) => {
        try {
            const nyId = parseInt(event.target.value, 10);
            this.props.onUpdateChosenLeagueId(Number.isNaN(nyId) ? null : nyId);
            this.setState({leagueIdInputField: Number.isNaN(nyId) ? '' : nyId});
        } catch (e) {
            //doNothing
            console.log('error ', e, " - verdi ", event.target.value);
        }
    };

    render() {
        const {onAapneNySide, currentPage, leagueIdChosenByUser, isLoadingData} = this.props;

        const brukValgtLigaKnapp = [
            <RaisedButton
                label="Gå videre med valgt liga"
                onClick={() => this.triggerFetchDataFromServer()}
                disabled={!leagueIdChosenByUser}
            />,
        ];

        const HtmlTooltip = withStyles((theme) => ({
            tooltip: {
                backgroundColor: '#f5f5f9',
                color: 'rgba(0, 0, 0, 0.87)',
                maxWidth: 450,
                fontSize: theme.typography.pxToRem(12),
                border: '1px solid #dadde9',
                disableFocusListener: true
            },
        }))(Tooltip);

        const onByttLiga = () => {
            onAapneNySide('');
            window.location.reload();
        };

        return (
            <div>
                <div className="overHeader">
                    <div className="headerText">
                        {isForFameAndGloryLeague(leagueIdChosenByUser) &&
                        <h1>For Fame And Glory FPL'20 Cup-O-Rama</h1>
                        }
                        {!isForFameAndGloryLeague(leagueIdChosenByUser) &&
                        <h1>{this.state.leagueName}</h1>
                        }

                    </div>
                    <div className="headerArt"/>
                </div>
                <ul className="header">
                    <div>
                        {isForFameAndGloryLeague(leagueIdChosenByUser) &&
                        <React.Fragment>
                            <li>
                                <a className={currentPage === '/kamper' ? 'active' : ''}
                                   onClick={() => onAapneNySide('kamper')}>Kamper</a>
                            </li>
                            <li>
                                <a className={currentPage === '/grupper' ? 'active' : ''}
                                   onClick={() => onAapneNySide('grupper')}>Grupper</a>
                            </li>
                        </React.Fragment>
                        }
                        <li>
                            <a className={currentPage === '/funfacts' ? 'active' : ''}
                               onClick={() => onAapneNySide('funfacts')}>Funfacts</a>
                        </li>
                        <li>
                            <a className={currentPage === '/transfers' ? 'active' : ''}
                               onClick={() => onAapneNySide('transfers')}>Bytter</a>
                        </li>
                        <li>
                            <a className={currentPage === '/leaguetable' ? 'active' : ''}
                               onClick={() => onAapneNySide('leaguetable')}>Tabell</a>
                        </li>
                        <li>
                            <a className="byttLiga" onClick={onByttLiga}>Bytt liga</a>
                        </li>
                    </div>
                </ul>

                <div>
                    <TeamStatsModal/>
                    {isLoadingData &&
                    <MuiThemeProvider>
                        <Dialog
                            title={"Laster og kalkulerer data"}
                            open={isLoadingData}
                            contentStyle={customContentStyle}
                        >
                            <CircularProgress size={80} thickness={5}/>
                        </Dialog>
                    </MuiThemeProvider>
                    }
                    {!this.state.chosenLeagueId &&
                    <MuiThemeProvider>
                        <Dialog
                            title={"Velg din liga fra listen eller skriv inn egen liga id"}
                            open={!this.state.chosenLeagueId}
                            contentStyle={customContentStyle}
                            actions={brukValgtLigaKnapp}
                        >
                            <p style={{color: 'red', fontSize: 'small'}}>
                                Pga begrensninger i API'et til FPL får man pr.
                                nå kun med data for de 50 beste i ligaen :/
                            </p>
                            <div>
                                <TextField
                                    className="leagueIdInputField"
                                    helperText="Fyll inn koden for din liga her"
                                    value={this.state.leagueIdInputField}
                                    onChange={this.handleLigavalgFraInput}
                                />
                                <HtmlTooltip
                                    title={
                                        <React.Fragment>
                                            <Typography color="inherit">Her finner du din ligakode</Typography>
                                            Du finner id'en til din liga ved å gå inn på ønsket liga i nettleseren og se
                                            i
                                            URL'en.<br/>
                                            Det ser typisk slik ut:<br/> https://fantasy.premierleague.com/leagues/<span
                                            style={{fontStyle: 'italic', fontWeight: 'bold'}}>1234567</span>/standings/c
                                        </React.Fragment>
                                    }
                                >
                                    <HelpIcon/>
                                </HtmlTooltip>
                            </div>
                            <br/>
                            <DropDownMenu
                                value={leaguesInDropdownList.find(l => l.id === leagueIdChosenByUser) ? leagueIdChosenByUser : ''}
                                onChange={this.handleLigavalgFraDropdown}
                                autoWidth={false}
                                className="dropdownLeagues"
                            >
                                {leaguesInDropdownList.map(league => <MenuItem key={league.id} value={league.id}
                                                                               primaryText={league.name}/>)}
                                <MenuItem value={''} primaryText="Velg liga her"/>
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
                                Det ser typisk slik ut:<br/> https://fantasy.premierleague.com/leagues/<span
                                style={{fontStyle: 'italic', fontWeight: 'bold'}}>976245</span>/standings/c
                            </Popover>
                        </Dialog>
                    </MuiThemeProvider>
                    }
                    {!isLoadingData && this.state.chosenLeagueId && this.props.children}
                </div>
            </div>
        );
    }
}

const customContentStyle = {
    maxWidth: '350px',
    height: '90%',
    maxHeight: '90%',
    textAlign: 'center',
};

Login.propTypes = {
    onUpdateChosenLeagueId: PropTypes.func,
    onUpdateGroupData: PropTypes.func,
    onUpdatePlayersList: PropTypes.func,
    onSetScoreData: PropTypes.func,
    onSetRoundStats: PropTypes.func,
    onUpdateTransfers: PropTypes.func,
    onUpdateIsLoadingData: PropTypes.func,
    onUpdateLeagueData: PropTypes.func,
    onSetLiveData: PropTypes.func,
    onEntryPicksFetched: PropTypes.func,
    onAapneNySide: PropTypes.func,
    leagueIdChosenByUser: PropTypes.number,
    currentPage: PropTypes.string,
    currentRound: PropTypes.number,
    managerIds: PropTypes.array,
    isLoadingData: PropTypes.bool,
    dataz: PropTypes.object,
    isCurrentRoundFinished: PropTypes.bool,
    liveScore: PropTypes.object
};

const mapStateToProps = state => ({
    leagueIdChosenByUser: state.data.leagueIdChosenByUser,
    currentPage: state.router.location.pathname,
    currentRound: state.data.currentRound,
    managerIds: state.data.managerIds,
    isLoadingData: state.data.isLoadingData,
    dataz: state.data.dataz,
    isCurrentRoundFinished: state.data.isCurrentRoundFinished,
    liveScore: state.liveData
});

const mapDispatchToProps = dispatch => ({
    onUpdateChosenLeagueId: (leagueId) => dispatch(updateChosenLeagueId(leagueId)),
    onUpdateGroupData: (groupData) => dispatch(updateGroupDataAction(groupData)),
    onUpdatePlayersList: (players) => dispatch(updatePlayersList(players)),
    onSetScoreData: (round) => dispatch(setScoreData(round)),
    onSetRoundStats: (roundStats) => dispatch(setRoundStats(roundStats)),
    onUpdateTransfers: (transfers) => dispatch(updateTransfers(transfers)),
    onUpdateIsLoadingData: (isLoading) => dispatch(updateIsLoadingData(isLoading)),
    onUpdateLeagueData: (leagueData) => dispatch(updateLeagueData(leagueData)),
    onSetLiveData: (round, averageScore) => dispatch(setLiveData(round, averageScore)),
    onEntryPicksFetched: (entryPicks) => dispatch(entryPicksFetched(entryPicks)),
    onAapneNySide: (id) => dispatch(push(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
