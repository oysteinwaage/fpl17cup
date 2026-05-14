import { DataState, LiveDataState } from '../types';

export interface AppState {
    data: DataState;
    liveData: LiveDataState;
}

const initialState: AppState = {
    data: {
        dataz: {},
        groupData: {},
        currentRound: null,
        transferlist: [],
        managerIds: [],
        leagueData: {},
        roundStats: {},
        leagueIdChosenByUser: null,
        loadingData: false,
        players: {},
        showTeamStatsModal: null,
        isCurrentRoundFinished: true
    },
    liveData: {
        playersLiveScore: {},
        fplManagersLiveScore: {},
        entryPicks: [],
        roundHits: {},
        averageScore: null
    }
};

export default initialState;
