export const UPDATE_SELECTED_ENTRY_ID = 'UPDATE_SELECTED_ENTRY_ID';
export function updateSelectedEntryId(entryId: number | null) {
    return {
        type: UPDATE_SELECTED_ENTRY_ID,
        entryId,
    };
}

export const UPDATE_CHOSEN_LEAGUE_ID = 'UPDATE_CHOSEN_LEAGUE_ID';
export function updateChosenLeagueId(leagueId: number | null) {
    return {
        type: UPDATE_CHOSEN_LEAGUE_ID,
        leagueId,
    };
}

export const SET_SCORE_DATA = 'SET_SCORE_DATA';
export function setScoreData(roundScore: any) {
    return {
        type: SET_SCORE_DATA,
        roundScore,
    };
}

export const SET_ROUND_STATS = 'SET_ROUND_STATS';
export function setRoundStats(roundStats: any) {
    return {
        type: SET_ROUND_STATS,
        roundStats,
    };
}

export const UPDATE_LEAGUE_DATA = 'UPDATE_LEAGUE_DATA';
export function updateLeagueData(leagueData: any) {
    return {
        type: UPDATE_LEAGUE_DATA,
        leagueData,
    };
}


export const UPDATE_PLAYERS_LIST = 'UPDATE_PLAYERS_LIST';
export function updatePlayersList(players: Record<number, string>) {
    return {
        type: UPDATE_PLAYERS_LIST,
        players,
    };
}

export const UPDATE_TRANSFERS = 'UPDATE_TRANSFERS';
export function updateTransfers(transferData: any) {
    return {
        type: UPDATE_TRANSFERS,
        transferData,
    };
}

export const UPDATE_IS_LOADING_DATA = 'UPDATE_IS_LOADING_DATA';
export function updateIsLoadingData(isLoading: boolean) {
    return {
        type: UPDATE_IS_LOADING_DATA,
        isLoading,
    };
}

export const TOGGLE_SHOW_TEAM_STATS = 'TOGGLE_SHOW_TEAM_STATS';
export function showTeamsStatsModalFor(teamId: number | null) {
    return {
        type: TOGGLE_SHOW_TEAM_STATS,
        teamId
    };
}

export const SET_LIVE_DATA = 'SET_LIVE_DATA';
export function setLiveData(liveData: any, averageScore?: number) {
    return {
        type: SET_LIVE_DATA,
        liveData,
        averageScore
    };
}

export const ENTRY_PICKS_FETCHED = 'ENTRY_PICKS_FETCHED';
export function entryPicksFetched(entryPicks: any) {
    return {
        type: ENTRY_PICKS_FETCHED,
        entryPicks
    };
}

export const SET_CAPTAIN_HISTORY = 'SET_CAPTAIN_HISTORY';
export function setCaptainHistory(captainHistory: any) {
    return {
        type: SET_CAPTAIN_HISTORY,
        captainHistory,
    };
}
