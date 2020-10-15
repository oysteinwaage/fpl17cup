export const UPDATE_CHOSEN_LEAGUE_ID = 'UPDATE_CHOSEN_LEAGUE_ID';
export function updateChosenLeagueId(leagueId) {
    return {
        type: UPDATE_CHOSEN_LEAGUE_ID,
        leagueId,
    };
}

export const SET_CURRENT_ROUND = 'SET_CURRENT_ROUND';
export function setCurrentRound(roundScore) {
    return {
        type: SET_CURRENT_ROUND,
        roundScore,
    };
}

export const SET_ROUND_STATS = 'SET_ROUND_STATS';
export function setRoundStats(roundStats) {
    return {
        type: SET_ROUND_STATS,
        roundStats,
    };
}

export const UPDATE_LEAGUE_DATA = 'UPDATE_LEAGUE_DATA';
export function updateLeagueData(leagueData) {
    return {
        type: UPDATE_LEAGUE_DATA,
        leagueData,
    };
}

export const UPDATE_GROUP_DATA = 'UPDATE_GROUP_DATA';
export function updateGroupData(groupData) {
    return {
        type: UPDATE_GROUP_DATA,
        groupData,
    };
}

export const UPDATE_PLAYERS_LIST = 'UPDATE_PLAYERS_LIST';
export function updatePlayersList(players) {
    return {
        type: UPDATE_PLAYERS_LIST,
        players,
    };
}

export const UPDATE_TRANSFERS = 'UPDATE_TRANSFERS';
export function updateTransfers(transferData) {
    return {
        type: UPDATE_TRANSFERS,
        transferData,
    };
}

export const UPDATE_IS_LOADING_DATA = 'UPDATE_IS_LOADING_DATA';
export function updateIsLoadingData(isLoading) {
    return {
        type: UPDATE_IS_LOADING_DATA,
        isLoading,
    };
}

export const TOGGLE_SHOW_TEAM_STATS = 'TOGGLE_SHOW_TEAM_STATS';
export function showTeamsStatsModalFor(teamId) {
    return {
        type: TOGGLE_SHOW_TEAM_STATS,
        teamId
    };
}

export const SET_LIVE_DATA = 'SET_LIVE_DATA';
export function setLiveData(liveData) {
    return {
        type: SET_LIVE_DATA,
        liveData
    };
}

export const ENTRY_PICKS_FETCHED = 'ENTRY_PICKS_FETCHED';
export function entryPicksFetched(entryPicks) {
    return {
        type: ENTRY_PICKS_FETCHED,
        entryPicks
    };
}
