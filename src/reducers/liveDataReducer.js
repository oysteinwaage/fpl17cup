import initialState from './initialState';
import {
    ENTRY_PICKS_FETCHED,
    SET_LIVE_DATA,
} from '../actions/actions';

export default function liveDataReducer(state = initialState.liveData, action) {
    const calculateLiveRoundScore = (entryPicks, liveScore) => {
        return entryPicks.reduce((total, entry) => {
            total[entry.entryId] = entry.picks.reduce((tot, player) => {
                return tot + (player.multiplier * liveScore.elements[player.element - 1].stats.total_points);
            }, 0);
            return total;
        }, {})
    };

    switch (action.type) {
        case SET_LIVE_DATA:
            if (state.entryPicks.length > 0) {
                console.log('inni if SET_LIVE_DATA');
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
        default:
            return state;
    }
}
