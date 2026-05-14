import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { showTeamsStatsModalFor } from '@/actions/actions';
import LiveDataShown from '@/components/liveDataShown';
import { RootState, DataState, LiveDataState, LeagueData } from '@/types';

interface LeagueTableProps {
  currentRound: number | null;
  dataz: DataState['dataz'];
  leagueData: LeagueData;
  onShowTeamStatsModal: (teamId: number) => void;
  liveScore: LiveDataState['fplManagersLiveScore'];
  isCurrentRoundFinished: boolean;
}

class LeagueTable extends Component<LeagueTableProps, {}> {
  render() {
    const { leagueData, onShowTeamStatsModal, isCurrentRoundFinished, liveScore, dataz, currentRound } = this.props;

    const sorted = leagueData.standings?.results.reduce((acc: any[], team: any) => {
      const live = liveScore?.[team.entry];
      const gwPoints = isCurrentRoundFinished
        ? dataz[team.entry]['round' + currentRound].points
        : (live ? live.totalPoints : 0);
      const totalPoints = isCurrentRoundFinished
        ? team.total
        : (currentRound! > 1 ? dataz[team.entry]['round' + (currentRound! - 1)].totalPoints : 0) + (live ? live.totalPoints : 0);
      acc.push({ entry: team.entry, entry_name: team.entry_name, player_name: team.player_name, previous_rank: team.last_rank || team.rank, gwPoints, totalPoints });
      return acc;
    }, []).sort((a: any, b: any) => b.totalPoints - a.totalPoints);

    return (
      <div className="w-full max-w-2xl">
        {!isCurrentRoundFinished && (
          <div>
            <LiveDataShown />
            <p className="text-center text-xs text-gray-500 pb-2">
              (Gameweek og Total score presenteres her med eventuelle hits allerede trukket fra!)
            </p>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center bg-gray-100 text-gray-600 text-sm font-bold py-2.5 px-4 border-b border-gray-300">
          <div className="w-10 shrink-0">#</div>
          <div className="flex-1">Lag</div>
          <div className="w-14 text-right">GW</div>
          <div className="w-16 text-right pr-2">TOT</div>
        </div>

        {/* Rows */}
        {(sorted || []).map((team: any, index: number) => {
          const rank = index + 1;
          const prev = team.previous_rank;
          const moved = rank < prev ? 'up' : rank > prev ? 'down' : 'same';

          return (
            <div
              key={team.entry}
              className="flex items-center bg-fpl-purple text-fpl-green py-3 px-4 border-b border-purple-900 hover:bg-[#4a0053] transition-colors cursor-pointer group"
              onClick={() => onShowTeamStatsModal(team.entry)}
            >
              <div className="w-10 shrink-0 flex items-center gap-0.5 text-base font-bold">
                {rank}
                {moved === 'up'   && <ChevronUp   className="w-4 h-4 text-fpl-green" />}
                {moved === 'down' && <ChevronDown  className="w-4 h-4 text-red-400" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm leading-tight truncate group-hover:underline">
                  {team.entry_name}
                </div>
                <div className="text-xs opacity-60 leading-tight">{team.player_name}</div>
              </div>

              <div className="w-14 text-right font-mono text-sm">{team.gwPoints}</div>
              <div className="w-16 text-right pr-2 font-mono text-sm font-bold">{team.totalPoints}</div>
            </div>
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  currentRound:          state.data.currentRound,
  dataz:                 state.data.dataz,
  leagueData:            state.data.leagueData,
  liveScore:             state.liveData.fplManagersLiveScore,
  isCurrentRoundFinished: state.data.isCurrentRoundFinished,
});

const mapDispatchToProps = (dispatch: any) => ({
  onShowTeamStatsModal: (teamId: number) => dispatch(showTeamsStatsModalFor(teamId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LeagueTable);
