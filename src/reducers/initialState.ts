import type { DataState, LiveDataState } from '@/types';

export interface AppState {
    data: DataState;
    liveData: LiveDataState;
}

const initialState: AppState = {
    data: {
        dataz: {},

        currentRound: null,
        transferlist: [],
        managerIds: [],
        leagueData: {},
        roundStats: {},
        leagueIdChosenByUser: null,
        selectedEntryId: null,
        isLoadingData: false,
        players: {},
        showTeamStatsModal: null,
        isCurrentRoundFinished: true,
        participantsTruncated: false
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
