import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { HelpCircle, CheckCircle, ChevronLeft, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './components/ui/dialog';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './components/ui/tooltip';
import {
  updateChosenLeagueId, updateSelectedEntryId, updatePlayersList, setScoreData, setRoundStats,
  updateTransfers, updateIsLoadingData, updateLeagueData,
  setLiveData, entryPicksFetched, setCaptainHistory,
} from './actions/actions';
import { leaguesInDropdownList } from './utils';
import {
  getManagerList, getStats, getRoundScores, getTransfers,
  getLiveData, getCaptainHistory, getEntryInfo,
} from './api';
import TeamStatsModal from './components/TeamStatsModal';
import { getEntryPicks } from './api';
import { RootState, DataState, LiveDataState } from './types';

export let roundStats: any = {};

interface EntryInfo {
  teamName: string;
  managerName: string;
  privateLeagues: Array<{ id: number; name: string }>;
}

interface LoginOwnProps extends RouteComponentProps {
  onUpdateChosenLeagueId: (leagueId: number | null) => void;
  onUpdateSelectedEntryId: (entryId: number | null) => void;
  onUpdatePlayersList: (players: Record<number, string>) => void;
  onSetScoreData: (round: any) => void;
  onSetRoundStats: (roundStats: any) => void;
  onUpdateTransfers: (transfers: any) => void;
  onUpdateIsLoadingData: (isLoading: boolean) => void;
  onUpdateLeagueData: (leagueData: any) => void;
  onSetLiveData: (round: any, averageScore?: number) => void;
  onEntryPicksFetched: (entryPicks: any) => void;
  onSetCaptainHistory: (captainHistory: any) => void;
  leagueIdChosenByUser: number | null;
  currentRound: number | null;
  managerIds: number[];
  isLoadingData: boolean;
  dataz: DataState['dataz'];
  isCurrentRoundFinished: boolean;
  liveScore: LiveDataState;
  children?: React.ReactNode;
}

type LoginProps = LoginOwnProps;

interface LoginState {
  chosenLeagueId: boolean;
  leagueName: string;
  leagueIdInputField: string | number;
  loginTab: 'direct' | 'entry';
  entryIdInputField: string;
  searchedEntry: EntryInfo | null;
  confirmedEntry: EntryInfo | null;
  isSearchingEntry: boolean;
  entrySearchError: string | null;
  selectedEntry: EntryInfo | null;
  showLeagueSwitcher: boolean;
}

class Login extends Component<LoginProps, LoginState> {
  intervalId: any;

  constructor(props: LoginProps) {
    super(props);
    this.state = {
      chosenLeagueId: false,
      leagueName: 'Liganavn',
      leagueIdInputField: '',
      loginTab: 'direct',
      entryIdInputField: '',
      searchedEntry: null,
      confirmedEntry: null,
      isSearchingEntry: false,
      entrySearchError: null,
      selectedEntry: null,
      showLeagueSwitcher: false,
    };
    this.props.history.push('/');
  }

  fetchLiveData(): void {
    const { currentRound, onSetLiveData, isCurrentRoundFinished } = this.props;
    if (!isCurrentRoundFinished) {
      getLiveData(currentRound!).then(liveData => onSetLiveData(liveData));
    } else {
      clearInterval(this.intervalId);
    }
  }

  fetchDataFromServer(leagueIdOverride?: number): void {
    const {
      leagueIdChosenByUser, onUpdatePlayersList, onSetRoundStats, onUpdateLeagueData,
      onSetScoreData, onUpdateTransfers, onUpdateIsLoadingData, onSetLiveData,
      onEntryPicksFetched, onSetCaptainHistory,
    } = this.props;

    const effectiveLeagueId = leagueIdOverride !== undefined ? leagueIdOverride : leagueIdChosenByUser;

    getManagerList(effectiveLeagueId!).then(leagueData => {
      if (leagueData?.managers?.length) {
        onUpdateLeagueData(leagueData);
        this.setState<'leagueName'>({ leagueName: leagueData.leagueName });
        getStats().then(stats => {
          roundStats = stats;
          onSetRoundStats(stats);
          getRoundScores(leagueData.managers).then(scoreData => {
            onSetScoreData(scoreData);
            const localCurrentRound = scoreData[0].entry.current_event;
            getEntryPicks(leagueData.managers, localCurrentRound).then((entryPicks: any) => {
              getLiveData(localCurrentRound).then(liveData =>
                onSetLiveData(liveData, stats[localCurrentRound].average_entry_score)
              );
              this.intervalId = setInterval(this.fetchLiveData.bind(this), 60000);
              onEntryPicksFetched(entryPicks);
            });

            const teamNameToIdMap: Record<number, string> = {};
            scoreData.forEach((player: any) => {
              Object.assign(teamNameToIdMap, { [player.entry.id]: player.entry.name });
            });
            onUpdatePlayersList(teamNameToIdMap);

            getTransfers(leagueData.managers).then((result: any) => {
              onUpdateTransfers(result);
              onUpdateIsLoadingData(false);
              this.props.history.push('/funfacts');
            });

            const completedRounds = Object.keys(stats).filter(r => stats[r]?.finished).map(Number);
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
    this.props.onUpdateIsLoadingData(true);
    this.setState<'chosenLeagueId'>({ chosenLeagueId: true });
    this.fetchDataFromServer();
  };

  handleLigavalgFraDropdown = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const value = event.target.value;
    this.setState<'leagueIdInputField'>({ leagueIdInputField: value });
    this.props.onUpdateChosenLeagueId(value ? Number(value) : null);
  };

  handleLigavalgFraInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    try {
      const nyId = parseInt(event.target.value, 10);
      this.props.onUpdateChosenLeagueId(Number.isNaN(nyId) ? null : nyId);
      this.setState<'leagueIdInputField'>({ leagueIdInputField: Number.isNaN(nyId) ? '' : nyId });
    } catch (e) {
      console.log('error ', e);
    }
  };

  handleEntryIdInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.replace(/\D/g, '');
    this.setState<'entryIdInputField' | 'searchedEntry' | 'entrySearchError'>({
      entryIdInputField: value,
      searchedEntry: null,
      entrySearchError: null,
    });
  };

  handleEntrySearch = (): void => {
    const entryId = parseInt(this.state.entryIdInputField, 10);
    if (Number.isNaN(entryId)) return;

    this.setState<'isSearchingEntry' | 'entrySearchError' | 'searchedEntry'>({ isSearchingEntry: true, entrySearchError: null, searchedEntry: null });
    getEntryInfo(entryId)
      .then((data: EntryInfo) => {
        this.setState<'isSearchingEntry' | 'searchedEntry'>({ isSearchingEntry: false, searchedEntry: data });
      })
      .catch(() => {
        this.setState<'isSearchingEntry' | 'entrySearchError'>({
          isSearchingEntry: false,
          entrySearchError: 'Fant ikke laget. Sjekk at team-IDen er riktig.',
        });
      });
  };

  selectLeagueFromEntry = (leagueId: number): void => {
    const { confirmedEntry, entryIdInputField } = this.state;
    const entryId = parseInt(entryIdInputField, 10);
    this.props.onUpdateChosenLeagueId(leagueId);
    this.props.onUpdateSelectedEntryId(Number.isNaN(entryId) ? null : entryId);
    this.setState<'confirmedEntry' | 'selectedEntry'>({ confirmedEntry: null, selectedEntry: confirmedEntry }, () => {
      this.triggerFetchDataFromServer();
    });
  };

  handleByttLiga = (): void => {
    if (this.state.selectedEntry) {
      this.setState<'showLeagueSwitcher'>({ showLeagueSwitcher: true });
    } else {
      this.props.history.push('/');
      window.location.reload();
    }
  };

  switchToLeague = (leagueId: number): void => {
    clearInterval(this.intervalId);
    this.props.onUpdateChosenLeagueId(leagueId);
    this.setState<'showLeagueSwitcher'>({ showLeagueSwitcher: false });
    this.props.history.push('/funfacts');
    this.props.onUpdateIsLoadingData(true);
    this.fetchDataFromServer(leagueId);
  };

  render() {
    const { leagueIdChosenByUser, isLoadingData, location, history } = this.props;
    const {
      chosenLeagueId, leagueName, leagueIdInputField,
      loginTab, entryIdInputField, searchedEntry, confirmedEntry,
      isSearchingEntry, entrySearchError, selectedEntry, showLeagueSwitcher,
    } = this.state;
    const currentPage = location.pathname;

    return (
      <>
        {/* ── Header ── */}
        <div className="relative bg-fpl-green w-full overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: "url('./images/fpl_header_art.svg') 100% 100% no-repeat",
              transform: 'rotate(180deg)',
            }}
          />
          <div className="relative z-10 py-4 px-5 flex flex-col items-center">
            <h1 className="text-fpl-purple font-bold text-2xl leading-tight m-0">
              {leagueName}
            </h1>
            {selectedEntry && (
              <p className="mt-0.5 text-fpl-purple/60 text-xs">
                {selectedEntry.teamName} · {selectedEntry.managerName}
              </p>
            )}
          </div>
        </div>

        {/* ── Nav ── */}
        <nav className="bg-[#111]">
          <ul className="flex m-0 p-0 list-none">
            <li className="flex-1">
              <a
                className={`text-white font-bold py-5 block text-center cursor-pointer hover:bg-white/10 transition-colors ${currentPage === '/funfacts' ? 'bg-[#0099FF]' : ''}`}
                onClick={() => history.push('/funfacts')}
              >Funfacts</a>
            </li>
            <li className="flex-1">
              <a
                className={`text-white font-bold py-5 block text-center cursor-pointer hover:bg-white/10 transition-colors ${currentPage === '/transfers' ? 'bg-[#0099FF]' : ''}`}
                onClick={() => history.push('/transfers')}
              >Bytter</a>
            </li>
            <li className="flex-1">
              <a
                className={`text-white font-bold py-5 block text-center cursor-pointer hover:bg-white/10 transition-colors ${currentPage === '/leaguetable' ? 'bg-[#0099FF]' : ''}`}
                onClick={() => history.push('/leaguetable')}
              >Tabell</a>
            </li>
            <li className="flex-1">
              <a
                className="text-fpl-yellow font-bold py-5 block text-center cursor-pointer hover:bg-white/10 transition-colors"
                onClick={this.handleByttLiga}
              >
                Bytt liga
              </a>
            </li>
          </ul>
        </nav>

        {/* ── Modals ── */}
        <div>
          <TeamStatsModal />

          {/* Loading dialog */}
          <Dialog open={isLoadingData} onOpenChange={() => {}}>
            <DialogContent
              hideClose
              aria-describedby={undefined}
              className="text-center max-w-sm"
              onEscapeKeyDown={e => e.preventDefault()}
              onInteractOutside={e => e.preventDefault()}
            >
              <DialogTitle className="text-center">Laster og kalkulerer data</DialogTitle>
              <div className="flex justify-center py-6">
                <div className="w-16 h-16 rounded-full border-4 border-gray-200 border-t-fpl-purple animate-spin" />
              </div>
            </DialogContent>
          </Dialog>

          {/* Login dialog */}
          <Dialog open={!chosenLeagueId} onOpenChange={() => {}}>
            <DialogContent
              hideClose
              className="max-w-sm"
              onEscapeKeyDown={e => e.preventDefault()}
              onInteractOutside={e => e.preventDefault()}
            >
              {!confirmedEntry ? (
                <>
                  <DialogTitle>Velg din liga</DialogTitle>
                  <DialogDescription className="mb-3 -mt-1">
                    Skriv inn liga-ID direkte eller finn private ligaer via lag
                  </DialogDescription>

                  {/* Tabs */}
                  <div className="flex border-b border-gray-200 mb-4">
                    <button
                      className={`flex-1 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                        loginTab === 'direct'
                          ? 'border-fpl-purple text-fpl-purple'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => this.setState<'loginTab'>({ loginTab: 'direct' })}
                    >
                      Liga-ID
                    </button>
                    <button
                      className={`flex-1 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                        loginTab === 'entry'
                          ? 'border-fpl-purple text-fpl-purple'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => this.setState<'loginTab'>({ loginTab: 'entry' })}
                    >
                      Finn via lag
                    </button>
                  </div>

                  {loginTab === 'direct' && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-1 block">Liga-ID</label>
                        <div className="relative">
                          <Input
                            placeholder="F.eks. 1234567"
                            value={leagueIdInputField}
                            onChange={this.handleLigavalgFraInput}
                            className="pr-9"
                          />
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                  <HelpCircle className="w-4 h-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="right">
                                <p className="font-semibold mb-1 text-sm">Her finner du din ligakode</p>
                                <p className="text-xs leading-relaxed">
                                  Gå inn på ønsket liga i nettleseren og se i URL-en:<br />
                                  fantasy.premierleague.com/leagues/<strong>1234567</strong>/standings/c
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-1 block">eller velg fra listen</label>
                        <select
                          value={leaguesInDropdownList.find(l => l.id === leagueIdChosenByUser) ? leagueIdChosenByUser || '' : ''}
                          onChange={this.handleLigavalgFraDropdown}
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-fpl-purple"
                        >
                          <option value="">Velg liga her</option>
                          {leaguesInDropdownList.map(league => (
                            <option key={league.id} value={league.id}>{league.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex justify-center">
                        <Button
                          size="lg"
                          onClick={() => this.triggerFetchDataFromServer()}
                          disabled={!leagueIdChosenByUser}
                        >
                          Gå videre med valgt liga
                        </Button>
                      </div>
                    </div>
                  )}

                  {loginTab === 'entry' && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-1 block">Team-ID</label>
                        <div className="relative">
                          <Input
                            placeholder="F.eks. 12345678"
                            value={entryIdInputField}
                            onChange={this.handleEntryIdInputChange}
                            onKeyDown={e => {
                              if (e.key === 'Enter' && entryIdInputField && !isSearchingEntry) {
                                this.handleEntrySearch();
                              }
                            }}
                            className="pr-9"
                          />
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                  <HelpCircle className="w-4 h-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="right">
                                <p className="font-semibold mb-1 text-sm">Her finner du din team-ID</p>
                                <p className="text-xs leading-relaxed">
                                  Gå inn på «Points» i FPL og se i URL-en:<br />
                                  fantasy.premierleague.com/entry/<strong>12345678</strong>/event/...
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={this.handleEntrySearch}
                        disabled={!entryIdInputField || isSearchingEntry}
                      >
                        {isSearchingEntry
                          ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Søker...</>
                          : 'Søk opp lag'}
                      </Button>

                      {entrySearchError && (
                        <p className="text-sm text-red-500">{entrySearchError}</p>
                      )}

                      {searchedEntry && (
                        <div className="rounded-lg bg-green-50 border border-green-200 p-3">
                          <div className="flex items-start gap-2 mb-3">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                            <div>
                              <p className="font-semibold text-sm">{searchedEntry.teamName}</p>
                              <p className="text-xs text-gray-500">{searchedEntry.managerName}</p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={() => this.setState<'confirmedEntry'>({ confirmedEntry: searchedEntry })}
                          >
                            Velg dette laget
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <button
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 -mt-1 mb-2"
                    onClick={() => this.setState<'confirmedEntry'>({ confirmedEntry: null })}
                  >
                    <ChevronLeft className="w-4 h-4" />Tilbake
                  </button>

                  <DialogTitle>Velg liga</DialogTitle>
                  <DialogDescription className="mb-4 -mt-1">
                    {confirmedEntry.teamName} · {confirmedEntry.managerName}
                  </DialogDescription>

                  {confirmedEntry.privateLeagues.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Dette laget er ikke med i noen private ligaer.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-72 overflow-y-auto">
                      {confirmedEntry.privateLeagues.map(league => (
                        <button
                          key={league.id}
                          className="w-full text-left px-3 py-2.5 rounded-lg border border-gray-200 hover:border-fpl-purple hover:bg-fpl-purple/5 transition-colors text-sm"
                          onClick={() => this.selectLeagueFromEntry(league.id)}
                        >
                          {league.name}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </DialogContent>
          </Dialog>

          {/* League switcher dialog (only available when logged in via entry flow) */}
          <Dialog
            open={showLeagueSwitcher}
            onOpenChange={open => !open && this.setState<'showLeagueSwitcher'>({ showLeagueSwitcher: false })}
          >
            <DialogContent className="max-w-sm">
              <DialogTitle>Bytt liga</DialogTitle>
              <DialogDescription className="mb-4 -mt-1">
                {selectedEntry?.teamName} · {selectedEntry?.managerName}
              </DialogDescription>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {selectedEntry?.privateLeagues.map(league => {
                  const isActive = league.id === leagueIdChosenByUser;
                  return (
                    <button
                      key={league.id}
                      className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm flex items-center justify-between transition-colors ${
                        isActive
                          ? 'border-fpl-purple bg-fpl-purple/10 text-fpl-purple cursor-default'
                          : 'border-gray-200 hover:border-fpl-purple hover:bg-fpl-purple/5'
                      }`}
                      onClick={() => !isActive && this.switchToLeague(league.id)}
                      disabled={isActive}
                    >
                      <span>{league.name}</span>
                      {isActive && <span className="text-xs font-medium">Aktiv</span>}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => { this.props.history.push('/'); window.location.reload(); }}
                >
                  Bytt lag / start på nytt
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  leagueIdChosenByUser:    state.data.leagueIdChosenByUser,
  currentRound:            state.data.currentRound,
  managerIds:              state.data.managerIds,
  isLoadingData:           state.data.isLoadingData,
  dataz:                   state.data.dataz,
  isCurrentRoundFinished:  state.data.isCurrentRoundFinished,
  liveScore:               state.liveData,
});

const mapDispatchToProps = (dispatch: any) => ({
  onUpdateChosenLeagueId:   (leagueId: number | null)        => dispatch(updateChosenLeagueId(leagueId)),
  onUpdateSelectedEntryId:  (entryId: number | null)         => dispatch(updateSelectedEntryId(entryId)),
  onUpdatePlayersList:    (players: Record<number, string>) => dispatch(updatePlayersList(players)),
  onSetScoreData:         (round: any)                     => dispatch(setScoreData(round)),
  onSetRoundStats:        (roundStats: any)                 => dispatch(setRoundStats(roundStats)),
  onUpdateTransfers:      (transfers: any)                  => dispatch(updateTransfers(transfers)),
  onUpdateIsLoadingData:  (isLoading: boolean)              => dispatch(updateIsLoadingData(isLoading)),
  onUpdateLeagueData:     (leagueData: any)                 => dispatch(updateLeagueData(leagueData)),
  onSetLiveData:          (round: any, avg?: number)        => dispatch(setLiveData(round, avg)),
  onEntryPicksFetched:    (entryPicks: any)                 => dispatch(entryPicksFetched(entryPicks)),
  onSetCaptainHistory:    (captainHistory: any)             => dispatch(setCaptainHistory(captainHistory)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login) as any);
