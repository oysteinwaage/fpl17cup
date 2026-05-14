import React, { Component } from 'react';
import { SelectBox, roundsUpTilNow } from '@/utils';
import { roundStats } from '@/Login';
import { transferDiff } from '@/transfers/Transfers';
import { connect } from 'react-redux';
import LiveDataShown from '@/components/liveDataShown';
import { RootState, DataState, LiveDataState } from '@/types';

function tempNullCheck(teamId: number, dataz: DataState['dataz']): any {
  return dataz[teamId] || {};
}

function tempNullCheckRound(teamId: number, round: string, dataz: DataState['dataz']): any {
  const team = tempNullCheck(teamId, dataz);
  return (team && team[round]) ? team[round] : {};
}

function hasCaptainPlayed(playerPoints: any, captainId: number): boolean {
  return playerPoints[captainId] && playerPoints[captainId].explain[0][0].minutes.value > 0;
}

function calculateCaptainPointsForPlayer(playerPoints: any, captainData: any, p: number): number {
  const multiplier = captainData[p].multiplier >= captainData[p].multiplierVice
    ? captainData[p].multiplier : captainData[p].multiplierVice;
  return hasCaptainPlayed(playerPoints, captainData[p].player)
    ? playerPoints[captainData[p].player].stats.total_points * multiplier
    : playerPoints[captainData[p].vicePlayer].stats.total_points * multiplier;
}

function high(list: any[], value: any, player: number): any[] {
  if (list.length === 0 || value > list[0][0]) return [[value, player]];
  if (value === list[0][0]) { list.push([value, player]); }
  return list;
}

function low(list: any[], value: any, player: number): any[] {
  if (list.length === 0 || value < list[0][0]) return [[value, player]];
  if (value === list[0][0]) { list.push([value, player]); }
  return list;
}

export function calculateStats(
  round: number | string,
  managers: number[] | null,
  playerPoints: any,
  captainData: any,
  currentRound: number | null,
  dataz: DataState['dataz']
): any {
  let highestRoundScore: any[] = [], lowestRoundScore: any[] = [];
  let mostPointsOnBench: any[] = [];
  let highestLeagueClimber: any[] = [0, ''], largestLeageDrop: any[] = [0, ''];
  let mostCaptainPoints: any[] = [], lowestCaptainPoints: any[] = [];
  let chipsUsed: any[] = [], hitsTaken: any[] = [];
  let mostTotalPointsOnBench: any[] = [], lowestTotalPointsOnBench: any[] = [];
  let mostTransfersUsed: any[] = [], fewestTransfersUsed: any[] = [];
  let mostTotalHitsTaken: any[] = [], lowestTotalHitsTaken: any[] = [];
  let bestTransferDiff: any[] = [], worstTransferDiff: any[] = [];
  let bestGlobalRankThisRound: any[] = [], worstGlobalRankThisRound: any[] = [];
  let bestOverallGlobalRank: any[] = [], worstOverallGlobalRank: any[] = [];
  let highestSquadValue: any[] = [];
  let mostTotalCaptainPoints: any[] = [], fewestTotalCaptainPoints: any[] = [];

  (managers || []).forEach(teamId => {
    const rnd = tempNullCheckRound(teamId, 'round' + round, dataz);
    const team = tempNullCheck(teamId, dataz);

    const points          = rnd.points;
    const pointsOnBench   = rnd.pointsOnBench;
    const transfersUsed   = team.totalTransfers;
    const totalPointsOnBench = team.totalPointsOnBench;
    const totalHitsTaken  = team.totalHitsTaken;

    const liveCaptain = captainData ? captainData[teamId] : null;
    const historicalCaptain = rnd.captain;
    let captainPoints: number | null = null;
    let captainName: string | null = null;

    if (liveCaptain && playerPoints && playerPoints[1]) {
      captainPoints = calculateCaptainPointsForPlayer(playerPoints, captainData, teamId);
      if (captainPoints != null) {
        const activeId = hasCaptainPlayed(playerPoints, liveCaptain.player) ? liveCaptain.player : liveCaptain.vicePlayer;
        captainName = roundStats.allPlayers?.[activeId]?.web_name ?? null;
      }
    } else if (historicalCaptain && historicalCaptain.captainPoints != null) {
      captainPoints = historicalCaptain.captainPoints;
      if (historicalCaptain.player && roundStats.allPlayers) {
        captainName = roundStats.allPlayers[historicalCaptain.player]?.web_name ?? null;
      }
    }

    if (points != null)       { highestRoundScore = high(highestRoundScore, points, teamId); lowestRoundScore = low(lowestRoundScore, points, teamId); }
    if (pointsOnBench != null) { mostPointsOnBench = high(mostPointsOnBench, pointsOnBench, teamId); }

    if (captainPoints != null && captainName) {
      if (mostCaptainPoints.length === 0 || captainPoints > mostCaptainPoints[0][0])     mostCaptainPoints = [[captainPoints, teamId, captainName]];
      else if (captainPoints === mostCaptainPoints[0][0])                                 mostCaptainPoints.push([captainPoints, teamId, captainName]);
      if (lowestCaptainPoints.length === 0 || captainPoints < lowestCaptainPoints[0][0]) lowestCaptainPoints = [[captainPoints, teamId, captainName]];
      else if (captainPoints === lowestCaptainPoints[0][0])                               lowestCaptainPoints.push([captainPoints, teamId, captainName]);
    }

    if (rnd.chipsPlayed)    chipsUsed.push([teamId, rnd.chipsPlayed.chipName]);
    if (rnd.takenHit > 0)   hitsTaken.push([teamId, '-' + rnd.takenHit + 'p']);

    if (round + '' === currentRound + '') {
      const climb = team.leagueClimb;
      if (climb > highestLeagueClimber[0]) { highestLeagueClimber[0] = climb; highestLeagueClimber[1] = teamId; }
      else if (climb < largestLeageDrop[0]) { largestLeageDrop[0] = climb; largestLeageDrop[1] = teamId; }
    }

    if (totalPointsOnBench != null) { mostTotalPointsOnBench = high(mostTotalPointsOnBench, totalPointsOnBench, teamId); lowestTotalPointsOnBench = low(lowestTotalPointsOnBench, totalPointsOnBench, teamId); }
    if (transferDiff && Object.keys(transferDiff).length && transferDiff[teamId]?.[round as number]) {
      bestTransferDiff  = high(bestTransferDiff,  transferDiff[teamId][round as number], teamId);
      worstTransferDiff = low(worstTransferDiff, transferDiff[teamId][round as number], teamId);
    }
    if (totalHitsTaken != null) { mostTotalHitsTaken = high(mostTotalHitsTaken, totalHitsTaken, teamId); lowestTotalHitsTaken = low(lowestTotalHitsTaken, totalHitsTaken, teamId); }
    if (transfersUsed  != null) { mostTransfersUsed  = high(mostTransfersUsed, transfersUsed, teamId);   fewestTransfersUsed  = low(fewestTransfersUsed, transfersUsed, teamId); }

    const gwRank = rnd.gwRank;
    if (gwRank > 0) { bestGlobalRankThisRound = low(bestGlobalRankThisRound, gwRank, teamId); worstGlobalRankThisRound = high(worstGlobalRankThisRound, gwRank, teamId); }

    const currentRank = team.currentOverallRank;
    if (currentRank > 0) { bestOverallGlobalRank = low(bestOverallGlobalRank, currentRank, teamId); worstOverallGlobalRank = high(worstOverallGlobalRank, currentRank, teamId); }

    const sv = team.currentSquadValue;
    if (sv > 0) highestSquadValue = high(highestSquadValue, sv, teamId);

    let totalCapPoints = 0, hasAnyCaptainData = false;
    Object.keys(team).filter(k => k.startsWith('round')).forEach(k => {
      const rd = team[k];
      if (rd?.captain?.captainPoints != null) { totalCapPoints += rd.captain.captainPoints; hasAnyCaptainData = true; }
    });
    if (hasAnyCaptainData) { mostTotalCaptainPoints = high(mostTotalCaptainPoints, totalCapPoints, teamId); fewestTotalCaptainPoints = low(fewestTotalCaptainPoints, totalCapPoints, teamId); }
  });

  highestLeagueClimber[0] = convertForView(highestLeagueClimber, dataz);
  largestLeageDrop[0]     = convertForView(largestLeageDrop, dataz);
  hitsTaken.sort((a: any, b: any) => b[1].slice(1, -1) - a[1].slice(1, -1));

  return {
    highestRoundScore, lowestRoundScore, mostPointsOnBench,
    mostTotalPointsOnBench, lowestTotalPointsOnBench,
    mostTotalHitsTaken, lowestTotalHitsTaken,
    mostTransfersUsed, fewestTransfersUsed,
    highestLeagueClimber, largestLeageDrop,
    mostCaptainPoints, lowestCaptainPoints,
    bestTransferDiff, worstTransferDiff,
    chipsUsed, hitsTaken,
    bestGlobalRankThisRound, worstGlobalRankThisRound,
    bestOverallGlobalRank, worstOverallGlobalRank,
    highestSquadValue, mostTotalCaptainPoints, fewestTotalCaptainPoints,
  };
}

function convertForView(data: any[], dataz: DataState['dataz']): string {
  const team = tempNullCheck(data[1], dataz);
  return team.lastRoundLeagueRank + ' → ' + team.leagueRank;
}

// ─── Render helpers ───────────────────────────────────────────────────────────

const ROW = 'flex justify-between items-start py-2 border-b border-dashed border-black/10 px-4 gap-3 last:border-0';
const LABEL = 'text-sm text-gray-600 w-[45%] shrink-0';
const VALUE = 'text-sm text-right flex-1 flex flex-col items-end gap-0.5';

export function makeMultipleResultsRows(text: string, data: any[], players: Record<number, string>, onlyScore?: boolean): React.ReactElement | null {
  if (!data.length) return null;
  return (
    <div className={ROW}>
      <div className={LABEL}>{text}</div>
      <div className={VALUE}>
        {data.map((d: any) => (
          <span key={d[0]} className="font-medium text-gray-800">
            {onlyScore ? d[1] : `${players[d[0]]} (${d[1]})`}
          </span>
        ))}
      </div>
    </div>
  );
}

export function makeMultipleResultsRowsWithSameScore(text: string, data: any[], players: Record<number, string>, onlyScore = false): React.ReactElement | null {
  if (!data.length) return null;
  let first = true;
  return (
    <div className={ROW}>
      <div className={LABEL}>{text}</div>
      <div className={VALUE}>
        {data.map((d: any) => {
          const score  = first ? d[0] : '';
          const player = onlyScore ? '' : `${players[d[1]]}${d[2] ? ` (${d[2]})` : ''}`;
          first = false;
          return (
            <div key={d[1] + 'r'} className="flex items-baseline gap-1.5 justify-end">
              {score !== '' && <span className="font-bold text-gray-900">{score}</span>}
              {player && <span className="text-gray-600 text-xs">{player}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function makeMultipleResultsRowsStacked(text: string, data: any[], players: Record<number, string>): React.ReactElement | null {
  if (!data.length) return null;
  let first = true;
  return (
    <div className={ROW}>
      <div className={LABEL}>{text}</div>
      <div className={VALUE}>
        {data.map((d: any) => {
          const value = first ? d[0] : null;
          first = false;
          return (
            <div key={d[1] + 'r'} className="flex flex-col items-end">
              {value && <span className="font-bold text-gray-900">{value}</span>}
              <span className="text-gray-600 text-xs">{players[d[1]]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function normalFact(text: string, data: any[], players: Record<number, string>, onlyScore?: boolean): React.ReactElement | null | false {
  const teamName = onlyScore ? '' : ` (${players[data[1]]})`;
  return !!data[1] && (
    <div className={ROW}>
      <div className={LABEL}>{text}</div>
      <div className="text-sm font-medium text-gray-800 text-right flex-1">{data[0]}{teamName}</div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface FunfactsProps {
  players: Record<number, string>;
  dataz: DataState['dataz'];
  currentRound: number | null;
  managerIds: number[];
  isCurrentRoundFinished: boolean;
  liveScore: LiveDataState['fplManagersLiveScore'];
}

interface FunfactsState {
  selectedRound: number | string | null;
}

class Funfacts extends Component<FunfactsProps, FunfactsState> {
  constructor(props: FunfactsProps) {
    super(props);
    this.state = { selectedRound: props.currentRound };
  }

  changeSelectedRound(): void {
    const el = document.getElementsByName('selectBox')[0] as HTMLSelectElement;
    this.setState({ selectedRound: el ? el.value : null });
  }

  render() {
    const { currentRound, managerIds, dataz, players, isCurrentRoundFinished, liveScore } = this.props;
    const { selectedRound } = this.state;

    if (!isCurrentRoundFinished) {
      managerIds.forEach(id => {
        dataz[id]['round' + currentRound].points       = liveScore[id]?.totalPoints;
        dataz[id]['round' + currentRound].pointsOnBench = liveScore[id]?.benchPoints;
      });
    }

    const score = calculateStats(selectedRound as number | string, managerIds, null, {}, currentRound, dataz);

    let totalHits = score.mostTotalHitsTaken || [];
    if (totalHits[0]) totalHits[0] = ['-' + score.mostTotalHitsTaken[0][0] + 'p', score.mostTotalHitsTaken[0][1]];

    let totalFewestHits = score.lowestTotalHitsTaken || [];
    if (totalFewestHits[0]) totalFewestHits[0] = [score.lowestTotalHitsTaken[0][0] === 0 ? '0p' : '-' + score.lowestTotalHitsTaken[0][0] + 'p', score.lowestTotalHitsTaken[0][1]];

    const disclaimer = '(Pr. nå er alt utenom endring i ligaplassering live for valgt runde. Stats totalt er ikke live)';

    const cardClass = 'flex-1 min-w-[340px]';
    const headerClass = 'text-center font-bold py-3 px-4 text-sm uppercase tracking-wider';

    return (
      <div className="w-full max-w-4xl">
        {/* eslint-disable-next-line eqeqeq */}
        {!isCurrentRoundFinished && currentRound == (selectedRound as any) && <LiveDataShown text={disclaimer} />}

        <div className="flex flex-wrap">
          {/* Round stats */}
          <div className={`${cardClass} bg-emerald-50`}>
            <div className={`${headerClass} bg-emerald-100 text-emerald-800`}>
              Stats runde {selectedRound}
            </div>
            {SelectBox(roundsUpTilNow(currentRound), this.changeSelectedRound.bind(this))}
            {makeMultipleResultsRowsWithSameScore('Høyest score',         score.highestRoundScore,       players)}
            {makeMultipleResultsRowsWithSameScore('Lavest score',          score.lowestRoundScore,        players)}
            {makeMultipleResultsRowsWithSameScore('Flest poeng på benken', score.mostPointsOnBench,       players)}
            {makeMultipleResultsRowsWithSameScore('Best diff bytter',      score.bestTransferDiff,        players)}
            {makeMultipleResultsRowsWithSameScore('Dårligst diff bytter',  score.worstTransferDiff,       players)}
            {normalFact('Beste klatrer',                                   score.highestLeagueClimber,    players)}
            {normalFact('Største fall',                                    score.largestLeageDrop,        players)}
            {makeMultipleResultsRowsStacked('Beste GW rank',  score.bestGlobalRankThisRound.map(([r, t]: [number, number])  => [r.toLocaleString(), t]), players)}
            {makeMultipleResultsRowsStacked('Lavest GW rank', score.worstGlobalRankThisRound.map(([r, t]: [number, number]) => [r.toLocaleString(), t]), players)}
            {makeMultipleResultsRowsWithSameScore('Flest kapteinspoeng',   score.mostCaptainPoints,       players)}
            {makeMultipleResultsRowsWithSameScore('Færrest kapteinspoeng', score.lowestCaptainPoints,     players)}
            {makeMultipleResultsRows('Brukt chips',                        score.chipsUsed,               players)}
            {makeMultipleResultsRows('Tatt hit',                           score.hitsTaken,               players)}
          </div>

          {/* Total stats */}
          <div className={`${cardClass} bg-sky-50`}>
            <div className={`${headerClass} bg-sky-100 text-sky-800`}>Stats totalt</div>
            {makeMultipleResultsRowsWithSameScore('Flest bytter',          score.mostTransfersUsed,       players)}
            {makeMultipleResultsRowsWithSameScore('Færrest bytter',        score.fewestTransfersUsed,     players)}
            {makeMultipleResultsRowsWithSameScore('Mest hits tatt',        totalHits,                     players)}
            {makeMultipleResultsRowsWithSameScore('Minst hits tatt',       totalFewestHits,               players)}
            {makeMultipleResultsRowsWithSameScore('Flest poeng på benk',   score.mostTotalPointsOnBench,  players)}
            {makeMultipleResultsRowsWithSameScore('Færrest poeng på benk', score.lowestTotalPointsOnBench,players)}
            {makeMultipleResultsRowsWithSameScore('Mest kapteinspoeng',    score.mostTotalCaptainPoints,  players)}
            {makeMultipleResultsRowsWithSameScore('Færrest kapteinspoeng', score.fewestTotalCaptainPoints,players)}
            {makeMultipleResultsRowsStacked('Best global rank',   score.bestOverallGlobalRank.map(([r, t]: [number, number])  => [r.toLocaleString(), t]), players)}
            {makeMultipleResultsRowsStacked('Lavest global rank', score.worstOverallGlobalRank.map(([r, t]: [number, number]) => [r.toLocaleString(), t]), players)}
            {makeMultipleResultsRowsStacked('Høyest squad-verdi', score.highestSquadValue.map(([v, t]: [number, number])      => ['£' + (v / 10).toFixed(1) + 'm', t]), players)}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  players:               state.data.players,
  currentRound:          state.data.currentRound,
  managerIds:            state.data.managerIds,
  dataz:                 state.data.dataz,
  isCurrentRoundFinished: state.data.isCurrentRoundFinished,
  liveScore:             state.liveData.fplManagersLiveScore,
});

export default connect(mapStateToProps)(Funfacts);
