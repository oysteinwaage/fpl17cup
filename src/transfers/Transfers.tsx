import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateIsLoadingData } from '@/actions/actions';
import { roundsUpTilNow, SelectBox } from '@/utils';
import { getPlayerScoresFor } from '@/api';
import LiveDataShown from '@/components/liveDataShown';
import { RootState, DataState, RoundStats } from '@/types';

export let loading = false;
export let transferDiff: Record<number, Record<number, number>> = {};

interface TransfersProps {
  players: Record<number, string>;
  currentRound: number | null;
  managerIds: number[];
  transferlist: any[][];
  dataz: DataState['dataz'];
  roundStats: RoundStats;
  onUpdateIsLoadingData: (isLoading: boolean) => void;
  isCurrentRoundFinished: boolean;
}

interface TransfersState {
  selectedRound: number | null;
  playerPoints: any;
}

class Transfers extends Component<TransfersProps, TransfersState> {
  constructor(props: TransfersProps) {
    super(props);
    this.state = { selectedRound: null, playerPoints: null };
    this.fetchPlayerPoints = this.fetchPlayerPoints.bind(this);
    this.transfersForTeamAndRound = this.transfersForTeamAndRound.bind(this);
  }

  changeSelectedRound(): void {
    const { currentRound } = this.props;
    const el = document.getElementsByName('selectBox')[0] as HTMLSelectElement;
    const val = el ? el.value : 'Velg runde';
    if (val === 'Velg runde') {
      this.setState<'selectedRound'>({ selectedRound: null });
      this.fetchPlayerPoints(currentRound);
    } else {
      const n = parseInt(val);
      this.setState<'selectedRound'>({ selectedRound: n });
      this.fetchPlayerPoints(n);
    }
  }

  fetchPlayerPoints(round: number | null): void {
    const { transferlist, onUpdateIsLoadingData } = this.props;
    if (!round) return;
    loading = true;
    onUpdateIsLoadingData(true);
    const ids = transferlist.reduce((prev: number[], curr: any[]) => {
      prev.push(...curr.reduce((p: number[], c: any) => {
        if (c.event === round) p.push(c.element_out, c.element_in);
        return p;
      }, []));
      return prev;
    }, []);
    getPlayerScoresFor([...new Set(ids)] as number[])
      .then(points => { loading = false; onUpdateIsLoadingData(false); this.setState<'playerPoints'>({ playerPoints: points }); })
      .catch(() => { onUpdateIsLoadingData(false); loading = false; });
  }

  componentDidMount(): void {
    if (this.state.playerPoints === null && !loading) {
      this.fetchPlayerPoints(this.getSelectedRound());
    }
  }

  getSelectedRound(): number | null {
    return this.state.selectedRound || this.props.currentRound;
  }

  transfersForTeamAndRound(teamId: number, round: number | null): React.ReactElement | null {
    const { dataz, roundStats } = this.props;
    const pp = this.state.playerPoints;
    const fplPlayers = (roundStats as any).allPlayers;
    if (!teamId || !round || !pp || loading) return null;

    let totalIn = 0;
    let totalOut = 0;
    const roundId = 'round' + round;
    const transfers = dataz[teamId][roundId]?.transfers || [];

    const rows = transfers.map((t: [number, number, string]) => {
      const pIn  = (pp[t[0]].find((s: any) => s.round === round) || { total_points: 0 }).total_points;
      const pOut = (pp[t[1]].find((s: any) => s.round === round) || { total_points: 0 }).total_points;
      totalIn  += pIn;
      totalOut += pOut;
      const diff = pIn - pOut;
      const rowBg = diff > 0 ? 'bg-green-50' : diff < 0 ? 'bg-red-50' : 'bg-gray-50';
      return (
        <div key={`${teamId}-${round}-${t[0]}-${t[1]}`} className={`flex border-b border-gray-200 px-3 py-2 text-sm ${rowBg}`}>
          <div className="w-[40%] text-gray-800">{fplPlayers[t[0]].web_name} <span className="text-gray-500">({pIn}p)</span></div>
          <div className="w-[40%] text-gray-800">{fplPlayers[t[1]].web_name} <span className="text-gray-500">({pOut}p)</span></div>
          <div className="flex-1 text-right text-gray-400 text-xs flex items-center justify-end">{t[2]}</div>
        </div>
      );
    });

    const diff = totalIn - (totalOut + (dataz[teamId][roundId]?.takenHit || 0));
    transferDiff = { ...transferDiff, [teamId]: { ...transferDiff[teamId], [round]: diff } };

    if (!transfers || transfers.length === 0) return null;

    const diffColor = diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-500' : 'text-gray-500';
    const diffSign  = diff > 0 ? '+' : diff < 0 ? '-' : '';

    return (
      <div key={teamId} className="mb-8">
        <div className="flex items-baseline gap-2 px-1 pb-1">
          <span className="font-bold text-gray-900">{dataz[teamId].name}</span>
          <span className={`text-sm font-medium ${diffColor}`}>
            ({diffSign}{Math.abs(diff)}p)
          </span>
        </div>
        <div className="text-xs text-gray-500 px-1 pb-2">{dataz[teamId].managerName}</div>

        <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
          <div className="flex bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
            <div className="w-[40%]">Inn ({totalIn}p)</div>
            <div className="w-[40%]">Ut ({totalOut}p)</div>
            <div className="flex-1 text-right">Tidspunkt</div>
          </div>
          {rows}
        </div>
      </div>
    );
  }

  render() {
    const { currentRound, managerIds, isCurrentRoundFinished } = this.props;
    const chosenRound = this.getSelectedRound();
    return (
      <div className="w-full max-w-2xl px-4">
        {!isCurrentRoundFinished && <LiveDataShown />}

        {chosenRound === currentRound && chosenRound !== null && (
          <h2 className="text-center text-lg font-bold text-gray-800 mt-2">Runde {chosenRound}</h2>
        )}

        {SelectBox(roundsUpTilNow(currentRound), this.changeSelectedRound.bind(this))}

        <p className="text-center text-xs text-gray-400 mb-4">
          (Alle poeng for total differanse inkluderer potensielle minuspoeng for hits)
        </p>

        {managerIds.map(teamId => this.transfersForTeamAndRound(teamId, chosenRound))}
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  players:               state.data.players,
  currentRound:          state.data.currentRound,
  managerIds:            state.data.managerIds,
  transferlist:          state.data.transferlist,
  dataz:                 state.data.dataz,
  roundStats:            state.data.roundStats,
  isCurrentRoundFinished: state.data.isCurrentRoundFinished,
});

const mapDispatchToProps = (dispatch: any) => ({
  onUpdateIsLoadingData: (isLoading: boolean) => dispatch(updateIsLoadingData(isLoading)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Transfers);
