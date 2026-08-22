import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ArrowLeft, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { getSquadDetail } from '@/api';
import { showPitchViewModalFor } from '@/actions/actions';
import { RootState, SquadDetail, SquadPick } from '@/types';

const CHIP_LABELS: Record<string, string> = {
  wildcard: 'Wildcard',
  freehit: 'Free Hit',
  bboost: 'Bench Boost',
  '3xc': 'Triple Captain',
};

function shirtUrl(teamCode: number, elementType: number): string {
  const suffix = elementType === 1 ? '_1' : '';
  return `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${teamCode}${suffix}-66.png`;
}

function PlayerCard({ pick }: { pick: SquadPick }) {
  const displayPoints = pick.points * pick.multiplier;
  const isBenched = pick.position > 11;

  return (
    <div className={`flex flex-col items-center w-[68px] shrink-0 ${isBenched ? 'opacity-80' : ''}`}>
      <div className="relative">
        <img
          src={shirtUrl(pick.teamCode, pick.elementType)}
          alt={pick.webName}
          className="w-10 h-auto drop-shadow-md"
        />
        {pick.isCaptain && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-black text-white text-[9px] font-bold flex items-center justify-center border border-white">C</span>
        )}
        {pick.isViceCaptain && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gray-500 text-white text-[9px] font-bold flex items-center justify-center border border-white">V</span>
        )}
        {pick.isSubOut && (
          <ArrowDown className="absolute -bottom-0.5 -left-1 w-3.5 h-3.5 text-red-500 bg-white rounded-full p-0.5" />
        )}
        {pick.isSubIn && (
          <ArrowUp className="absolute -bottom-0.5 -left-1 w-3.5 h-3.5 text-emerald-500 bg-white rounded-full p-0.5" />
        )}
      </div>
      <div className="w-full -mt-1 bg-white px-1 py-0.5 text-center leading-tight">
        <div className="text-[10px] font-bold text-fpl-purple truncate">{pick.webName}</div>
      </div>
      <div className="w-full bg-fpl-purple px-1 py-0.5 text-center rounded-b-sm">
        <div className="text-[10px] font-bold text-fpl-green">{displayPoints}</div>
      </div>
    </div>
  );
}

interface PitchViewModalProps {
  players: Record<number, string>;
  currentRound: number | null;
  roundStats: any;
  chosenTeamIdForModal: number | null;
  onClose: () => void;
}

interface PitchViewModalState {
  selectedRound: number | null;
  squad: SquadDetail | null;
  loading: boolean;
  error: string | null;
}

class PitchViewModal extends Component<PitchViewModalProps, PitchViewModalState> {
  constructor(props: PitchViewModalProps) {
    super(props);
    this.state = { selectedRound: null, squad: null, loading: false, error: null };
  }

  componentDidUpdate(prevProps: PitchViewModalProps, prevState: PitchViewModalState): void {
    const { chosenTeamIdForModal, currentRound } = this.props;
    if (!chosenTeamIdForModal) return;

    if (chosenTeamIdForModal !== prevProps.chosenTeamIdForModal) {
      this.setState({ selectedRound: currentRound, squad: null });
      if (currentRound) this.fetchSquad(chosenTeamIdForModal, currentRound);
      return;
    }

    if (this.state.selectedRound && this.state.selectedRound !== prevState.selectedRound) {
      this.fetchSquad(chosenTeamIdForModal, this.state.selectedRound);
    }
  }

  fetchSquad(entryId: number, round: number): void {
    this.setState({ loading: true, error: null });
    getSquadDetail(entryId, round)
      .then(data => this.setState({ squad: data, loading: false }))
      .catch(() => this.setState({ error: 'Kunne ikke hente lagoppstilling', loading: false }));
  }

  changeRound(delta: number): void {
    const { currentRound } = this.props;
    const round = (this.state.selectedRound || currentRound || 1) + delta;
    if (round < 1 || (currentRound && round > currentRound)) return;
    this.setState({ selectedRound: round });
  }

  render() {
    const { players, currentRound, roundStats, chosenTeamIdForModal, onClose } = this.props;
    const { squad, loading, error, selectedRound } = this.state;

    if (!chosenTeamIdForModal) return <></>;

    const teamName = players[chosenTeamIdForModal] || '';
    const round = selectedRound || currentRound;

    const picks = squad?.picks || [];
    const starters = picks.filter(p => p.position <= 11).sort((a, b) => a.position - b.position);
    const bench = picks.filter(p => p.position > 11).sort((a, b) => a.position - b.position);
    const rows = [1, 2, 3, 4].map(type => starters.filter(p => p.elementType === type)).filter(row => row.length > 0);

    const netPoints = squad ? squad.entryHistory.points - squad.entryHistory.event_transfers_cost : null;
    const roundStat: any = round ? roundStats?.[round] : null;
    const average = roundStat?.average_entry_score ?? null;
    const highest = roundStat?.highest_score ?? null;
    const chipLabel = squad?.activeChip ? (CHIP_LABELS[squad.activeChip] || squad.activeChip) : null;

    const atFirstRound = !!(round && round <= 1);
    const atLastRound = !!(currentRound && round && round >= currentRound);

    return (
      <Dialog open={!!chosenTeamIdForModal} onOpenChange={open => !open && onClose()}>
        <DialogContent
          hideClose
          aria-describedby={undefined}
          onOpenAutoFocus={e => e.preventDefault()}
          className="max-w-none w-screen h-[100dvh] sm:h-[92vh] sm:w-full sm:max-w-lg rounded-none sm:rounded-xl p-0 overflow-hidden top-0 left-0 sm:top-1/2 sm:left-1/2 translate-x-0 translate-y-0 sm:-translate-x-1/2 sm:-translate-y-1/2"
        >
          <div className="flex flex-col h-full bg-gray-50">
            <DialogTitle className="sr-only">{teamName} - Gameweek {round}</DialogTitle>
            {/* Slim sticky header - stays visible so the modal is always closable/navigable */}
            <div className="bg-white px-3 py-2 flex items-center justify-between shrink-0 border-b border-gray-100 z-10">
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <ArrowLeft className="w-4 h-4 text-fpl-purple" />
              </button>
              <div className="text-center min-w-0 px-2">
                <div className="text-sm font-extrabold text-fpl-purple truncate leading-tight">{teamName}</div>
                <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 leading-tight">
                  <button onClick={() => this.changeRound(-1)} disabled={atFirstRound} className="disabled:opacity-30">
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span>Gameweek {round}</span>
                  <button onClick={() => this.changeRound(1)} disabled={atLastRound} className="disabled:opacity-30">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="w-8 h-8 shrink-0" />
            </div>

            {/* Everything below scrolls as one unit, so the stats strip doesn't permanently eat space on short viewports */}
            <div className="flex-1 overflow-y-auto">
              {/* Stats strip */}
              <div className="flex items-center justify-around bg-white px-4 py-2.5">
                <div className="text-center">
                  <div className="text-lg font-extrabold text-fpl-purple leading-tight">{average ?? '-'}</div>
                  <div className="text-[10px] text-gray-500">Average</div>
                </div>
                <div className="text-center bg-gradient-to-br from-sky-400 to-fpl-purple rounded-lg px-4 py-1">
                  <div className="text-lg font-extrabold text-white leading-tight">{netPoints ?? '-'}</div>
                  <div className="text-[10px] text-white/90">Total Pts</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-extrabold text-fpl-purple leading-tight">{highest ?? '-'}</div>
                  <div className="text-[10px] text-gray-500">Highest</div>
                </div>
              </div>

              {chipLabel && (
                <div className="text-center text-xs font-bold text-fpl-purple bg-fpl-green/60 py-1">
                  {chipLabel} aktiv
                </div>
              )}

              {loading && <div className="text-center py-10 text-gray-400 text-sm">Laster...</div>}
              {error && <div className="text-center py-10 text-red-500 text-sm">{error}</div>}

              {!loading && !error && squad && (
                <>
                  <div className="bg-gradient-to-b from-emerald-500 to-emerald-700 py-2 px-1">
                    {rows.map((row, i) => (
                      <div key={i} className="flex items-start justify-around py-2">
                        {row.map(p => <PlayerCard key={p.element} pick={p} />)}
                      </div>
                    ))}
                  </div>
                  <div className="bg-emerald-100 py-2 px-1">
                    <div className="text-center text-[11px] font-bold text-emerald-800 mb-1.5 uppercase tracking-wide">Benk</div>
                    <div className="flex items-start justify-around">
                      {bench.map(p => <PlayerCard key={p.element} pick={p} />)}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  players: state.data.players,
  currentRound: state.data.currentRound,
  roundStats: state.data.roundStats,
  chosenTeamIdForModal: state.data.showPitchViewModal,
});

const mapDispatchToProps = (dispatch: any) => ({
  onClose: () => dispatch(showPitchViewModalFor(null)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PitchViewModal);
