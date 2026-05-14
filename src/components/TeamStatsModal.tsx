import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dialog, DialogContent, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { SelectBox, roundsUpTilNow } from '@/utils';
import {
  calculateStats, normalFact, makeMultipleResultsRows,
  makeMultipleResultsRowsWithSameScore, CHIP_NAMES,
} from '@/funfacts/Funfacts';
import { showTeamsStatsModalFor } from '@/actions/actions';
import { RootState, DataState } from '@/types';

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-dashed border-black/10 px-4 last:border-0">
      <span className="text-sm text-gray-600 w-[55%] shrink-0">{label}</span>
      <span className="text-sm font-semibold text-gray-900 text-right">{value}</span>
    </div>
  );
}

interface TeamStatsModalProps {
  players: Record<number, string>;
  dataz: DataState['dataz'];
  currentRound: number | null;
  onShowTeamStatsModal: (teamId: number | null) => void;
  chosenTeamIdForModal: number | null;
}

interface TeamStatsModalState {
  selectedRoundDialog: string | number | null;
}

class TeamStatsModal extends Component<TeamStatsModalProps, TeamStatsModalState> {
  constructor(props: TeamStatsModalProps) {
    super(props);
    this.state = { selectedRoundDialog: null };
  }

  changeSelectedRoundDialog(): void {
    const el = document.getElementsByName('selectBoxDialog')[0] as HTMLSelectElement;
    this.setState({ selectedRoundDialog: el ? el.value : null });
  }

  render() {
    const { players, currentRound, dataz, onShowTeamStatsModal, chosenTeamIdForModal } = this.props;

    if (!chosenTeamIdForModal) return <></>;

    const selectedRound = this.state.selectedRoundDialog || currentRound;
    const teamData      = dataz[chosenTeamIdForModal] || {};
    const managerName   = teamData.managerName || '';
    const teamName      = players[chosenTeamIdForModal] || '';
    const roundData: any = teamData['round' + selectedRound] || {};

    const statsOnPlayer = calculateStats(selectedRound!, [chosenTeamIdForModal], null, null, currentRound, dataz);

    const totalHits = statsOnPlayer.mostTotalHitsTaken.length === 0
      ? ['0p', 12345]
      : ['-' + statsOnPlayer.mostTotalHitsTaken[0][0] + 'p', statsOnPlayer.mostTotalHitsTaken[0][1]];

    const captainPoints: number | null = roundData.captain?.captainPoints ?? null;
    const gwRank: number | null        = roundData.gwRank ?? null;

    let totalCaptainPoints = 0, hasAnyCaptainData = false;
    Object.keys(teamData).filter(k => k.startsWith('round')).forEach(k => {
      const rd = teamData[k];
      if (rd?.captain?.captainPoints != null) { totalCaptainPoints += rd.captain.captainPoints; hasAnyCaptainData = true; }
    });

    const squadValue: number | null  = teamData.currentSquadValue ?? null;
    const globalRank: number | null  = teamData.currentOverallRank ?? null;

    const sectionHeader = (title: string, bg: string, text: string) => (
      <div className={`${bg} ${text} text-xs font-bold uppercase tracking-wider px-4 py-2`}>{title}</div>
    );

    return (
      <Dialog
        open={!!chosenTeamIdForModal}
        onOpenChange={open => !open && onShowTeamStatsModal(null)}
      >
        <DialogContent aria-describedby={undefined} className="max-w-lg p-0 overflow-hidden" onOpenAutoFocus={e => e.preventDefault()}>
          {/* Header */}
          <div className="bg-fpl-purple text-fpl-green px-5 pt-5 pb-4">
            <DialogTitle className="text-fpl-green text-base mb-0">{teamName}</DialogTitle>
            <p className="text-xs text-fpl-green/60">{managerName}</p>
          </div>

          <div className="overflow-y-auto max-h-[70vh]">
            {/* Round stats */}
            {sectionHeader(`Stats runde ${selectedRound}`, 'bg-emerald-100', 'text-emerald-800')}
            {SelectBox(roundsUpTilNow(currentRound), this.changeSelectedRoundDialog.bind(this), '', 'Dialog')}
            {makeMultipleResultsRowsWithSameScore('Score',          statsOnPlayer.highestRoundScore, players, true, 'p')}
            {makeMultipleResultsRowsWithSameScore('Poeng på benken',statsOnPlayer.mostPointsOnBench, players, true, 'p')}
            {captainPoints != null && <StatRow label="Kapteinspoeng" value={captainPoints + 'p'} />}
            {gwRank != null && <StatRow label="GW rank" value={gwRank.toLocaleString()} />}
            {normalFact('Klatring i ligaen', statsOnPlayer.highestLeagueClimber, players, true)}
            {normalFact('Fall i ligaen',     statsOnPlayer.largestLeageDrop,     players, true)}
            {makeMultipleResultsRows('Brukt chips', statsOnPlayer.chipsUsed.map(([t, c]: [number, string]) => [t, CHIP_NAMES[c] ?? c]), players, true)}
            {makeMultipleResultsRows('Tatt hit',    statsOnPlayer.hitsTaken,  players, true)}

            {/* Total stats */}
            {sectionHeader('Stats totalt', 'bg-sky-100', 'text-sky-800')}
            {makeMultipleResultsRowsWithSameScore('Antall bytter',  statsOnPlayer.mostTransfersUsed,     players, true)}
            {normalFact('Hits tatt',                                totalHits,                           players, true)}
            {makeMultipleResultsRowsWithSameScore('Poeng på benken',statsOnPlayer.mostTotalPointsOnBench,players, true, 'p')}
            {hasAnyCaptainData && <StatRow label="Total kapteinspoeng" value={totalCaptainPoints + 'p'} />}
            {squadValue != null && <StatRow label="Lagets verdi" value={'£' + (squadValue / 10).toFixed(1) + 'm'} />}
            {globalRank != null && <StatRow label="Global rank"  value={globalRank.toLocaleString()} />}
          </div>

          <DialogFooter className="px-5 pb-5 pt-2 border-t border-gray-100">
            <Button variant="outline" size="sm" onClick={() => onShowTeamStatsModal(null)}>Lukk</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
}

export const customContentStyle: React.CSSProperties = {};

const mapStateToProps = (state: RootState) => ({
  players:              state.data.players,
  currentRound:         state.data.currentRound,
  dataz:                state.data.dataz,
  chosenTeamIdForModal: state.data.showTeamStatsModal,
});

const mapDispatchToProps = (dispatch: any) => ({
  onShowTeamStatsModal: (teamId: number | null) => dispatch(showTeamsStatsModalFor(teamId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TeamStatsModal);
