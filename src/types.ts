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
  [playerId: number]: { web_name: string };
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

export interface DataState {
  dataz: Record<number, TeamData>;

  currentRound: number | null;
  transferlist: any[][];
  managerIds: number[];
  leagueData: LeagueData;
  roundStats: RoundStats;
  leagueIdChosenByUser: number | null;
  loadingData: boolean;
  isLoadingData?: boolean;
  players: Record<number, string>;
  showTeamStatsModal: number | null;
  isCurrentRoundFinished: boolean;
}

export interface LiveDataState {
  playersLiveScore: any;
  fplManagersLiveScore: Record<number, LiveScore>;
  entryPicks: EntryPick[];
  roundHits: Record<number, number>;
  averageScore: number | null;
}

export interface RootState {
  data: DataState;
  liveData: LiveDataState;
}
