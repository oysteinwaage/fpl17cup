import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import './App.css';
import {
    updateChosenLeagueId,
    updateGroupData as updateGroupDataAction,
    updatePlayersList,
    setCurrentRound,
    setManagerIds,
    setRoundStats,
    updateTransfers,
    updateIsLoadingData
} from './actions/actions';
import {groups, gamesPrGroupAndRound, getRoundNr} from './matches/Runder.js';
import {participatingRounds, leaguesInDropdownList, fplAvgTeams} from './utils.js';
import {getManagerList, getStats, getRoundScores, getTransfers, getTestNoe} from './api.js';
import Dialog from 'material-ui/Dialog';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover/Popover';
import {push} from "connected-react-router";

// let dataz = {};
let groupData = {};
export let leagueStandings = [];
export let roundStats = {};

export function isForFameAndGloryLeague(id) {
    return id === 120053;
}

export function score(t1, t2, round, dataz) {
    return (dataz[t1] && dataz[t1][round]) || (dataz[t2] && dataz[t2][round])
        ? roundScore(t1, round, dataz) + (' - ' + roundScore(t2, round, dataz))
        : ' - ';
}

function roundScore(team, round, dataz) {
    if (fplAvgTeams.includes(team)) {
        return roundStats[round.slice(5) - 1].average_entry_score;
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

function updateGroupData(team1, team2, round, dataz) {
    const team1Score = roundScore(team1, round, dataz);
    const team2Score = roundScore(team2, round, dataz);
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
        };
        this.toggleShowLeagueIdInfo = this.toggleShowLeagueIdInfo.bind(this);
        this.props.onAapneNySide('');
    };

    makeGroupData = () => {
        const {currentRound, onUpdateGroupData, dataz} = this.props;
        participatingRounds.filter(pr => pr <= currentRound).forEach(function (r) {
            groups.forEach(function (groupLetter) {
                const groupId = 'group' + groupLetter;
                gamesPrGroupAndRound[getRoundNr(r)][groupId].forEach(match => {
                    updateGroupData(match[0], match[1], 'round' + r, dataz);
                })
            })
        });
        onUpdateGroupData(groupData);
    };

    fetchDataFromServer() {
        const {
            leagueIdChosenByUser, onUpdatePlayersList, onSetRoundStats, onAapneNySide,
            onSetCurrentRound, onSetManagersIds, onUpdateTransfers, onUpdateIsLoadingData
        } = this.props;
        let that = this;

        getTestNoe();

        getManagerList(leagueIdChosenByUser).then(leagueData => {
            if (leagueData && leagueData.managers && leagueData.managers.length > 0) {
                onSetManagersIds(leagueData.managers);
                that.state.leagueName = leagueData.leagueName;
                getStats().then(data => {
                    console.log('getStats: ', data);
                    roundStats = data;
                    onSetRoundStats(data);

                    getRoundScores().then(scoreData => {
                        console.log('score: ', scoreData);
                        onSetCurrentRound(scoreData);
                        this.makeGroupData();

                        // setter map med id: lagNavn
                        let teamNameToIdMap = {};
                        scoreData.forEach(function (player) {
                            Object.assign(teamNameToIdMap, {
                                [player.entry.id]: player.entry.name,
                            });
                        });
                        onUpdatePlayersList(teamNameToIdMap);

                        getTransfers().then(result => {
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
        const { onUpdateIsLoadingData} = this.props;
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

    // TODO fjern denne og alt som har med ligaId som lokal konstant her når state er fikset
    handleLigavalgFraDropdown = (event, index, value) => {
        this.props.onUpdateChosenLeagueId(value);
    };

    render() {
        const {onAapneNySide, currentPage, leagueIdChosenByUser, isLoadingData} = this.props;

        const brukValgtLigaKnapp = [
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
                                <a className={currentPage === '/kamper' ? 'active' : ''} onClick={() => onAapneNySide('kamper')}>Kamper</a>
                            </li>
                            <li>
                                <a className={currentPage === '/grupper' ? 'active' : ''} onClick={() => onAapneNySide('grupper')}>Grupper</a>
                            </li>
                        </React.Fragment>
                        }
                        <li>
                            <a className={currentPage === '/funfacts' ? 'active' : ''} onClick={() => onAapneNySide('funfacts')}>Funfacts</a>
                        </li>
                        <li>
                            <a className={currentPage === '/transfers' ? 'active' : ''} onClick={() => onAapneNySide('transfers')}>Bytter</a>
                        </li>
                        {/*<li><Link to="/leaguetable" activeClassName="active">Tabell</Link></li>*/}
                    </div>
                </ul>

                <div className="content">
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
                            title={"Velg din liga fra listen"}
                            open={!this.state.chosenLeagueId}
                            contentStyle={customContentStyle}
                            actions={brukValgtLigaKnapp}
                        >
                            <p style={{color: 'red', fontSize: 'small'}}> Pga. oppdateringer i API'et til FPL er denne
                                siden strippet for mye av sin tidligere funksjonalitet, som blant annet at man kunne
                                fylle inn
                                hvilken som helst liga-id her.. Dette er pr.nå ikke mulig å få til :/

                                {/*Pga begrensninger i API'et til FPL får man pr.*/}
                                {/*nå kun med data for de 50 beste i ligaen :/*/}
                            </p>
                            {/*<TextField*/}
                            {/*    disabled={true}*/}
                            {/*    hintText="eks: 61858"*/}
                            {/*    floatingLabelText="Fyll inn ID for din liga her ()"*/}
                            {/*    value={this.state.leagueIdChosenByUser}*/}
                            {/*    onChange={(event, newValue) => this.updateLeagueId(newValue)}*/}
                            {/*/>*/}
                            {/*<ActionInfo*/}
                            {/*    style={actionInfoStyle}*/}
                            {/*    onClick={(event) => this.toggleShowLeagueIdInfo(event)}*/}
                            {/*/>*/}
                            {/*<br/>*/}
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
                                Det ser typisk slik ut:<br/> https://fantasy.premierleague.com/a/ leagues/standings/<a
                                style={{fontStyle: 'italic', fontWeight: 'bold'}}>976245</a>/classic
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
// const actionInfoStyle = {
//     // TODO funker ikke med hover. sjekk ut.
//     '&:hover': {
//         color: 'yellow'
//     }
// };
// export default Login;

Login.propTypes = {
    onUpdateChosenLeagueId: PropTypes.func,
    onUpdateGroupData: PropTypes.func,
    onUpdatePlayersList: PropTypes.func,
    onSetCurrentRound: PropTypes.func,
    onSetManagersIds: PropTypes.func,
    onSetRoundStats: PropTypes.func,
    onUpdateTransfers: PropTypes.func,
    onUpdateIsLoadingData: PropTypes.func,
    onAapneNySide: PropTypes.func,
    leagueIdChosenByUser: PropTypes.number,
    currentPage: PropTypes.string,
    currentRound: PropTypes.number,
    managerIds: PropTypes.array,
    isLoadingData: PropTypes.bool,
    dataz: PropTypes.object
};

const mapStateToProps = state => ({
    leagueIdChosenByUser: state.data.leagueIdChosenByUser,
    currentPage: state.router.location.pathname,
    currentRound: state.data.currentRound,
    managerIds: state.data.managerIds,
    isLoadingData: state.data.isLoadingData,
    dataz: state.data.dataz
});

const mapDispatchToProps = dispatch => ({
    onUpdateChosenLeagueId: (leagueId) => dispatch(updateChosenLeagueId(leagueId)),
    onUpdateGroupData: (groupData) => dispatch(updateGroupDataAction(groupData)),
    onUpdatePlayersList: (players) => dispatch(updatePlayersList(players)),
    onSetCurrentRound: (round) => dispatch(setCurrentRound(round)),
    onSetManagersIds: (managers) => dispatch(setManagerIds(managers)),
    onSetRoundStats: (roundStats) => dispatch(setRoundStats(roundStats)),
    onUpdateTransfers: (transfers) => dispatch(updateTransfers(transfers)),
    onUpdateIsLoadingData: (isLoading) => dispatch(updateIsLoadingData(isLoading)),
    onAapneNySide: (id) => dispatch(push(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
