import initialState from './initialState';
import {
    ENTRY_PICKS_FETCHED,
    SET_LIVE_DATA, SET_SCORE_DATA,
} from '../actions/actions';

export default function liveDataReducer(state = initialState.liveData, action) {
    const calculateLiveRoundScore = (entryPicks, liveScore) => {
        return entryPicks.reduce((total, entry) => {
            total[entry.entryId] = entry.picks.reduce((tot, player) => {
                return tot + (player.multiplier * liveScore.elements[player.element - 1].stats.total_points);
            }, - state.roundHits[entry.entryId]);
            return total;
        }, {})
    };

    switch (action.type) {
        case SET_LIVE_DATA:
            if (state.entryPicks.length > 0) {
                return {
                    ...state,
                    playersLiveScore: action.liveData,
                    fplManagersLiveScore: calculateLiveRoundScore(state.entryPicks, action.liveData),
                    averageScore: action.averageScore
                };
            }
            return {
                ...state,
                playersLiveScore: action.liveData
            };
        case ENTRY_PICKS_FETCHED:
            return {
                ...state,
                entryPicks: action.entryPicks
            };
        case SET_SCORE_DATA:
            return {
                ...state,
                roundHits: action.roundScore.reduce((tot, team) => {
                    tot[team.entry.id] = team.current[team.entry.current_event - 1].event_transfers_cost;
                    return tot;
                }, {})
            };
        default:
            return state;
    }
}
