export interface RoundData {
  points?: number;
  pointsOnBench?: number;
  takenHit?: number;
  totalPoints?: number;
  overallRank?: number;
  gwRank?: number;
  squadValue?: number;
  transfers?: [number, number, string][];
  chipsPlayed?: {
    chipName: string;
    playedTime: string;
  };
  captain?: {
    player: number;
    vicePlayer: number;
    activePlayer: number;
    multiplier: number;
    multiplierVice: number;
    captainPoints: number | null;
  };
}

export interface TeamData {
  [key: string]: any;
  leagueClimb?: number;
  leagueRank?: number;
  lastRoundLeagueRank?: number;
  managerName?: string;
  name?: string;
  currentOverallRank?: number;
  bestOverallRank?: number | null;
  currentSquadValue?: number;
  totalPointsOnBench?: number;
  totalHitsTaken?: number;
  totalTransfers?: number;
}


export interface LiveScore {
  totalPoints: number;
  benchPoints: number;
  captainPoints: number | null;
}

export interface EntryPick {
  entryId: number;
  picks: {
    element: number;
    multiplier: number;
    is_captain: boolean;
    is_vice_captain: boolean;
  }[];
}

export interface RoundStat {
  average_entry_score: number;
  finished: boolean;
}

export interface AllPlayersMap {
  [playerId: number]: { web_name: string; cost_change_event?: number };
}

export interface RoundStats {
  [round: number]: RoundStat;
  allPlayers?: AllPlayersMap;
}

export interface LeagueStandingResult {
  entry: number;
  entry_name: string;
  player_name: string;
  rank: number;
  last_rank: number;
  total: number;
}

export interface LeagueData {
  managers?: number[];
  leagueName?: string;
  league?: { name: string; id: number };
  standings?: {
    results: LeagueStandingResult[];
  };
}

export interface SquadPick {
  element: number;
  position: number;
  multiplier: number;
  isCaptain: boolean;
  isViceCaptain: boolean;
  isSubIn: boolean;
  isSubOut: boolean;
  webName: string;
  elementType: number;
  teamCode: number;
  teamShortName: string;
  points: number;
  minutes: number;
  bonus: number;
  inDreamteam: boolean;
  fixtureStarted: boolean;
  fixtureFinished: boolean;
  opponentShortName: string | null;
  isHome: boolean | null;
}

export interface SquadDetail {
  entryId: number;
  round: number;
  activeChip: string | null;
  entryHistory: {
    points: number;
    points_on_bench: number;
    event_transfers: number;
    event_transfers_cost: number;
    value: number;
    bank: number;
    rank: number;
    overall_rank: number;
  };
  picks: SquadPick[];
}

export interface DataState {
  dataz: Record<number, TeamData>;

  currentRound: number | null;
  transferlist: any[][];
  managerIds: number[];
  leagueData: LeagueData;
  roundStats: RoundStats;
  leagueIdChosenByUser: number | null;
  selectedEntryId: number | null;
  isLoadingData: boolean;
  players: Record<number, string>;
  showTeamStatsModal: number | null;
  showPitchViewModal: number | null;
  isCurrentRoundFinished: boolean;
  participantsTruncated: boolean;
}

export interface LiveDataState {
  playersLiveScore: any;
  fplManagersLiveScore: Record<number, LiveScore>;
  entryPicks: EntryPick[];
  roundHits: Record<number, number>;
  averageScore: number | null;
  lastUpdated: number | null;
}

export interface RootState {
  data: DataState;
  liveData: LiveDataState;
}
