import React, {Component} from 'react';
import {connect} from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import HelpIcon from '@mui/icons-material/Help';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {push} from 'connected-react-router';
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
    setLiveData, entryPicksFetched, setCaptainHistory
} from './actions/actions';
import {groups, gamesPrGroupAndRound, getRoundNr} from './matches/Runder';
import {participatingRounds, leaguesInDropdownList, fplAvgTeams} from './utils';
import {getManagerList, getStats, getRoundScores, getTransfers, getLiveData, getCaptainHistory} from './api';
import TeamStatsModal from './components/TeamStatsModal';
import {getEntryPicks} from './api';
import {roundLiveScore} from './matches/Runder';
import { RootState, DataState, LiveDataState, GroupData } from './types';

const HtmlTooltip = styled(Tooltip)(({ theme }: any) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 450,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}));

let groupData: Record<string | number, GroupData> = {};
export let roundStats: any = {};

export function isForFameAndGloryLeague(id?: number | null): boolean {
    return id === 819162;
}

export function roundScore(team: number, round: string, dataz: DataState['dataz']): number | string {
    if (fplAvgTeams.includes(team)) {
        return roundStats[round.slice(5)].average_entry_score;
    }
    return dataz[team] && dataz[team][round] ? dataz[team][round].points : 0;
}

function newPointsFor(team: number | string, winningTeam: number | string): number {
    const originalPoints = groupData[team] ? groupData[team].points || 0 : 0;
    if (winningTeam === team) {
        return originalPoints + 3;
    } else if (winningTeam === 'draw') {
        return originalPoints + 1;
    }
    return originalPoints;
}

function newMatchesWonFor(team: number | string, winningTeam: number | string): number {
    const originalValue = groupData[team] ? groupData[team].matchesWon || 0 : 0;
    return winningTeam === team ? originalValue + 1 : originalValue;
}

function newMatchesDrawnFor(team: number | string, winningTeam: number | string): number {
    const originalValue = groupData[team] ? groupData[team].matchesDrawn || 0 : 0;
    return winningTeam === 'draw' ? originalValue + 1 : originalValue;
}

function newMatchesLostFor(team: number | string, winningTeam: number | string): number {
    const originalValue = groupData[team] ? groupData[team].matchesLost || 0 : 0;
    return winningTeam !== 'draw' && winningTeam !== team ? originalValue + 1 : originalValue;
}

function updateGroupDataLocal(
    team1: number,
    team2: number,
    round: string,
    dataz: DataState['dataz'],
    liveData: LiveDataState | null
): void {
    const team1Score = round === ('round' + (dataz as any).currentRound) && liveData ? roundLiveScore(team1, liveData) : roundScore(team1, round, dataz);
    const team2Score = round === ('round' + (dataz as any).currentRound) && liveData ? roundLiveScore(team2, liveData) : roundScore(team2, round, dataz);
    const winningTeam = team1Score > team2Score ? team1 : team1Score === team2Score ? 'draw' : team2;
    Object.assign(groupData, {
        [team1]: {
            points: newPointsFor(team1, winningTeam),
            matches: groupData[team1] ? (groupData[team1].matches || 0) + 1 : 1,
            matchesWon: newMatchesWonFor(team1, winningTeam),
            matchesDrawn: newMatchesDrawnFor(team1, winningTeam),
            matchesLost: newMatchesLostFor(team1, winningTeam),
            difference: groupData[team1] ? (groupData[team1].difference || 0) + ((team1Score as number) - (team2Score as number)) : (team1Score as number) - (team2Score as number),
        },
        [team2]: {
            points: newPointsFor(team2, winningTeam),
            matches: groupData[team2] ? (groupData[team2].matches || 0) + 1 : 1,
            matchesWon: newMatchesWonFor(team2, winningTeam),
            matchesDrawn: newMatchesDrawnFor(team2, winningTeam),
            matchesLost: newMatchesLostFor(team2, winningTeam),
            difference: groupData[team2] ? (groupData[team2].difference || 0) + ((team2Score as number) - (team1Score as number)) : (team2Score as number) - (team1Score as number),
        }
    });
}

interface LoginProps {
    onUpdateChosenLeagueId: (leagueId: number | null) => void;
    onUpdateGroupData: (groupData: any) => void;
    onUpdatePlayersList: (players: Record<number, string>) => void;
    onSetScoreData: (round: any) => void;
    onSetRoundStats: (roundStats: any) => void;
    onUpdateTransfers: (transfers: any) => void;
    onUpdateIsLoadingData: (isLoading: boolean) => void;
    onUpdateLeagueData: (leagueData: any) => void;
    onSetLiveData: (round: any, averageScore?: number) => void;
    onEntryPicksFetched: (entryPicks: any) => void;
    onSetCaptainHistory: (captainHistory: any) => void;
    onAapneNySide: (id: string) => void;
    leagueIdChosenByUser: number | null;
    currentPage: string;
    currentRound: number | null;
    managerIds: number[];
    isLoadingData: boolean;
    dataz: DataState['dataz'];
    isCurrentRoundFinished: boolean;
    liveScore: LiveDataState;
    children?: React.ReactNode;
}

interface LoginState {
    chosenLeagueId: boolean;
    leagueId: number;
    leagueName: string;
    showLeagueIdInfo: boolean;
    leagueIdInputField: string | number;
    anchorEl?: Element | null;
}

class Login extends Component<LoginProps, LoginState> {
    intervalId: any;

    constructor(props: LoginProps) {
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
    }

    makeGroupData = (liveData?: LiveDataState): void => {
        const {currentRound, onUpdateGroupData, dataz} = this.props;
        groupData = {};
        participatingRounds.filter(pr => Number(pr) <= (currentRound || 0)).forEach(function (r) {
            groups.forEach(function (groupLetter) {
                const groupId = ('group' + groupLetter) as any;
                gamesPrGroupAndRound[getRoundNr(r)][groupId].forEach((match: any) => {
                    updateGroupDataLocal(match[0], match[1], 'round' + r, dataz, liveData || null);
                });
            });
        });
        onUpdateGroupData(groupData);
    };

    fetchLiveData(): void {
        const {currentRound, onSetLiveData, isCurrentRoundFinished, liveScore} = this.props;
        if (!isCurrentRoundFinished) {
            getLiveData(currentRound!)
                .then(liveData => {
                    if (liveScore.averageScore) {
                        this.makeGroupData(liveScore);
                    }
                    onSetLiveData(liveData);
                });
        } else {
            clearInterval(this.intervalId);
        }
    }

    fetchDataFromServer(): void {
        const {
            leagueIdChosenByUser, onUpdatePlayersList, onSetRoundStats, onAapneNySide, onUpdateLeagueData,
            onSetScoreData, onUpdateTransfers, onUpdateIsLoadingData, onSetLiveData, onEntryPicksFetched,
            onSetCaptainHistory
        } = this.props;

        getManagerList(leagueIdChosenByUser!).then(leagueData => {
            if (leagueData && leagueData.managers && leagueData.managers.length > 0) {
                onUpdateLeagueData(leagueData);
                this.setState<'leagueName'>({ leagueName: leagueData.leagueName });
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
                            .then((entryPicks: any) => {
                                getLiveData(localCurrentRound)
                                    .then(liveData => onSetLiveData(liveData, stats[localCurrentRound].average_entry_score));
                                this.intervalId = setInterval(this.fetchLiveData.bind(this), 60000);

                                onEntryPicksFetched(entryPicks);
                            });

                        let teamNameToIdMap: Record<number, string> = {};
                        scoreData.forEach(function (player: any) {
                            Object.assign(teamNameToIdMap, {
                                [player.entry.id]: player.entry.name,
                            });
                        });
                        onUpdatePlayersList(teamNameToIdMap);

                        getTransfers(leagueData.managers).then((result: any) => {
                            onUpdateTransfers(result);
                            onUpdateIsLoadingData(false);
                            onAapneNySide('funfacts');
                        });

                        const completedRounds = Object.keys(stats).filter(r => stats[r] && stats[r].finished).map(Number);
                        if (completedRounds.length > 0) {
                            getCaptainHistory(leagueData.managers, completedRounds)
                                .then(data => onSetCaptainHistory(data))
                                .catch(() => {});
                        }
                    });
                });
            } else {
                onUpdateIsLoadingData(false);
            }
        });
    }

    triggerFetchDataFromServer = (): void => {
        const {onUpdateIsLoadingData} = this.props;
        onUpdateIsLoadingData(true);
        this.setState<'chosenLeagueId'>({
            chosenLeagueId: true,
        });
        this.fetchDataFromServer();
    };

    toggleShowLeagueIdInfo(_event: React.MouseEvent | null): void {
        const anchorEl = _event && _event.currentTarget;
        this.setState<'showLeagueIdInfo' | 'anchorEl'>({
            showLeagueIdInfo: !this.state.showLeagueIdInfo,
            anchorEl: anchorEl as Element | null,
        });
    }

    handleTouchTap = (): void => {
        // This prevents ghost click.
    };

    handleLigavalgFraDropdown = (event: any): void => {
        const value = event.target.value;
        this.setState<'leagueIdInputField'>({leagueIdInputField: value as string});
        this.props.onUpdateChosenLeagueId(value);
    };

    handleLigavalgFraInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const nyId = parseInt(event.target.value, 10);
            this.props.onUpdateChosenLeagueId(Number.isNaN(nyId) ? null : nyId);
            this.setState<'leagueIdInputField'>({leagueIdInputField: Number.isNaN(nyId) ? '' : nyId});
        } catch (e) {
            console.log('error ', e, " - verdi ", event.target.value);
        }
    };

    render() {
        const {onAapneNySide, currentPage, leagueIdChosenByUser, isLoadingData} = this.props;

        const onByttLiga = (): void => {
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
                    <Dialog open={isLoadingData} slotProps={{ paper: { style: customContentStyle } }}>
                        <DialogTitle>Laster og kalkulerer data</DialogTitle>
                        <DialogContent>
                            <CircularProgress size={80} thickness={5}/>
                        </DialogContent>
                    </Dialog>
                    }
                    {!this.state.chosenLeagueId &&
                    <Dialog open={!this.state.chosenLeagueId} slotProps={{ paper: { style: customContentStyle } }}>
                        <DialogTitle>Velg din liga fra listen eller skriv inn egen liga id</DialogTitle>
                        <DialogContent>
                            <p style={{color: 'red', fontSize: 'small'}}>
                                Pga begrensninger i API'et til FPL får man pr.
                                nå kun med data for de 50 beste i ligaen :/
                            </p>
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                <div style={{width: '75%', position: 'relative'}}>
                                    <TextField
                                        fullWidth
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
                                        <HelpIcon style={{position: 'absolute', right: -32, top: 8}}/>
                                    </HtmlTooltip>
                                </div>
                                <Select
                                    value={leaguesInDropdownList.find(l => l.id === leagueIdChosenByUser) ? leagueIdChosenByUser || '' : ''}
                                    onChange={this.handleLigavalgFraDropdown}
                                    className="dropdownLeagues"
                                    displayEmpty
                                >
                                <MenuItem value="">Velg liga her</MenuItem>
                                {leaguesInDropdownList.map(league => (
                                    <MenuItem key={league.id} value={league.id}>{league.name}</MenuItem>
                                ))}
                                </Select>
                            </div>
                            <Popover
                                open={this.state.showLeagueIdInfo}
                                anchorEl={this.state.anchorEl}
                                anchorOrigin={{horizontal: "center", vertical: "top"}}
                                transformOrigin={{horizontal: "center", vertical: "bottom"}}
                                onClose={() => this.toggleShowLeagueIdInfo(null)}
                            >
                                Du finner id'en til din liga ved å gå inn på ønsket liga i nettleseren og se i
                                URL'en.<br/>
                                Det ser typisk slik ut:<br/> https://fantasy.premierleague.com/leagues/<span
                                style={{fontStyle: 'italic', fontWeight: 'bold'}}>976245</span>/standings/c
                            </Popover>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => this.triggerFetchDataFromServer()}
                                disabled={!leagueIdChosenByUser}
                            >
                                Gå videre med valgt liga
                            </Button>
                        </DialogActions>
                    </Dialog>
                    }
                    {!isLoadingData && this.state.chosenLeagueId && this.props.children}
                </div>
            </div>
        );
    }
}

const customContentStyle: React.CSSProperties = {
    maxWidth: '350px',
    textAlign: 'center',
};

const mapStateToProps = (state: RootState) => ({
    leagueIdChosenByUser: state.data.leagueIdChosenByUser,
    currentPage: state.router.location.pathname,
    currentRound: state.data.currentRound,
    managerIds: state.data.managerIds,
    isLoadingData: state.data.isLoadingData,
    dataz: state.data.dataz,
    isCurrentRoundFinished: state.data.isCurrentRoundFinished,
    liveScore: state.liveData
});

const mapDispatchToProps = (dispatch: any) => ({
    onUpdateChosenLeagueId: (leagueId: number | null) => dispatch(updateChosenLeagueId(leagueId)),
    onUpdateGroupData: (groupData: any) => dispatch(updateGroupDataAction(groupData)),
    onUpdatePlayersList: (players: Record<number, string>) => dispatch(updatePlayersList(players)),
    onSetScoreData: (round: any) => dispatch(setScoreData(round)),
    onSetRoundStats: (roundStats: any) => dispatch(setRoundStats(roundStats)),
    onUpdateTransfers: (transfers: any) => dispatch(updateTransfers(transfers)),
    onUpdateIsLoadingData: (isLoading: boolean) => dispatch(updateIsLoadingData(isLoading)),
    onUpdateLeagueData: (leagueData: any) => dispatch(updateLeagueData(leagueData)),
    onSetLiveData: (round: any, averageScore?: number) => dispatch(setLiveData(round, averageScore)),
    onEntryPicksFetched: (entryPicks: any) => dispatch(entryPicksFetched(entryPicks)),
    onSetCaptainHistory: (captainHistory: any) => dispatch(setCaptainHistory(captainHistory)),
    onAapneNySide: (id: string) => dispatch(push(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
