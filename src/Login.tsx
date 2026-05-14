import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './components/ui/dialog';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './components/ui/tooltip';
import {
  updateChosenLeagueId, updatePlayersList, setScoreData, setRoundStats,
  updateTransfers, updateIsLoadingData, updateLeagueData,
  setLiveData, entryPicksFetched, setCaptainHistory,
} from './actions/actions';
import { leaguesInDropdownList } from './utils';
import { getManagerList, getStats, getRoundScores, getTransfers, getLiveData, getCaptainHistory } from './api';
import TeamStatsModal from './components/TeamStatsModal';
import { getEntryPicks } from './api';
import { RootState, DataState, LiveDataState } from './types';

export let roundStats: any = {};

interface LoginOwnProps extends RouteComponentProps {
  onUpdateChosenLeagueId: (leagueId: number | null) => void;
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
}

class Login extends Component<LoginProps, LoginState> {
  intervalId: any;

  constructor(props: LoginProps) {
    super(props);
    this.state = {
      chosenLeagueId: false,
      leagueName: 'Liganavn',
      leagueIdInputField: '',
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

  fetchDataFromServer(): void {
    const {
      leagueIdChosenByUser, onUpdatePlayersList, onSetRoundStats, onUpdateLeagueData,
      onSetScoreData, onUpdateTransfers, onUpdateIsLoadingData, onSetLiveData,
      onEntryPicksFetched, onSetCaptainHistory,
    } = this.props;

    getManagerList(leagueIdChosenByUser!).then(leagueData => {
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

  render() {
    const { leagueIdChosenByUser, isLoadingData, location, history } = this.props;
    const currentPage = location.pathname;

    return (
      <>
        {/* ── Header ── */}
        <div className="flex justify-between bg-fpl-green w-full overflow-hidden">
          <div className="min-w-[280px] w-[30%] py-4 pl-5 pr-3">
            <h1 className="text-fpl-purple font-bold text-2xl leading-tight m-0">
              {this.state.leagueName}
            </h1>
          </div>
          <div
            className="flex-1"
            style={{
              background: "url('./images/fpl_header_art.svg') 100% 100% no-repeat",
              transform: 'rotate(180deg)',
            }}
          />
        </div>

        {/* ── Nav ── */}
        <nav className="bg-[#111]">
          <ul className="flex flex-wrap m-0 p-0 list-none px-4">
            <li><a className={`text-white font-bold py-5 px-5 inline-block cursor-pointer hover:bg-white/10 transition-colors ${currentPage === '/funfacts' ? 'bg-[#0099FF]' : ''}`} onClick={() => history.push('/funfacts')}>Funfacts</a></li>
            <li><a className={`text-white font-bold py-5 px-5 inline-block cursor-pointer hover:bg-white/10 transition-colors ${currentPage === '/transfers' ? 'bg-[#0099FF]' : ''}`} onClick={() => history.push('/transfers')}>Bytter</a></li>
            <li><a className={`text-white font-bold py-5 px-5 inline-block cursor-pointer hover:bg-white/10 transition-colors ${currentPage === '/leaguetable' ? 'bg-[#0099FF]' : ''}`} onClick={() => history.push('/leaguetable')}>Tabell</a></li>
            <li>
              <a
                className="text-fpl-yellow font-bold py-5 px-5 inline-block cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => { history.push('/'); window.location.reload(); }}
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

          {/* League selection dialog */}
          <Dialog open={!this.state.chosenLeagueId} onOpenChange={() => {}}>
            <DialogContent
              hideClose
              className="max-w-sm"
              onEscapeKeyDown={e => e.preventDefault()}
              onInteractOutside={e => e.preventDefault()}
            >
              <DialogTitle>Velg din liga</DialogTitle>
              <DialogDescription className="mb-4 -mt-1">
                Skriv inn liga-ID eller velg fra listen
              </DialogDescription>

              <div className="space-y-4">
                {/* Manual ID input */}
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Liga-ID</label>
                  <div className="relative">
                    <Input
                      placeholder="F.eks. 1234567"
                      value={this.state.leagueIdInputField}
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

                {/* Dropdown */}
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
              </div>

              <div className="mt-5 flex justify-center">
                <Button
                  size="lg"
                  onClick={() => this.triggerFetchDataFromServer()}
                  disabled={!leagueIdChosenByUser}
                >
                  Gå videre med valgt liga
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
  leagueIdChosenByUser:  state.data.leagueIdChosenByUser,
  currentRound:          state.data.currentRound,
  managerIds:            state.data.managerIds,
  isLoadingData:         state.data.isLoadingData,
  dataz:                 state.data.dataz,
  isCurrentRoundFinished: state.data.isCurrentRoundFinished,
  liveScore:             state.liveData,
});

const mapDispatchToProps = (dispatch: any) => ({
  onUpdateChosenLeagueId: (leagueId: number | null)      => dispatch(updateChosenLeagueId(leagueId)),
  onUpdatePlayersList:    (players: Record<number, string>) => dispatch(updatePlayersList(players)),
  onSetScoreData:         (round: any)                    => dispatch(setScoreData(round)),
  onSetRoundStats:        (roundStats: any)               => dispatch(setRoundStats(roundStats)),
  onUpdateTransfers:      (transfers: any)                => dispatch(updateTransfers(transfers)),
  onUpdateIsLoadingData:  (isLoading: boolean)            => dispatch(updateIsLoadingData(isLoading)),
  onUpdateLeagueData:     (leagueData: any)               => dispatch(updateLeagueData(leagueData)),
  onSetLiveData:          (round: any, avg?: number)      => dispatch(setLiveData(round, avg)),
  onEntryPicksFetched:    (entryPicks: any)               => dispatch(entryPicksFetched(entryPicks)),
  onSetCaptainHistory:    (captainHistory: any)           => dispatch(setCaptainHistory(captainHistory)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login) as any);
