import initialState from './initialState';
import {
    ENTRY_PICKS_FETCHED,
    SET_LIVE_DATA, SET_SCORE_DATA,
} from '../actions/actions';

export default function liveDataReducer(state = initialState.liveData, action) {
    const calculateLiveRoundScore = (entryPicks, liveScore) => {
        return entryPicks.reduce((total, entry) => {
            total[entry.entryId] = entry.picks.reduce((tot, player) => {
                if (player.multiplier > 0) {
                    tot.totalPoints = tot.totalPoints + (player.multiplier * liveScore.elements[player.element - 1].stats.total_points);
                    if (player.multiplier > 1) {
                        tot.captainPoints = liveScore.elements[player.element - 1].stats.minutes !== 0 ?
                            player.multiplier * liveScore.elements[player.element - 1].stats.total_points
                            : null;
                    }
                } else {
                    tot.benchPoints = tot.benchPoints + liveScore.elements[player.element - 1].stats.total_points;
                }
                return tot;
            }, {totalPoints: -state.roundHits[entry.entryId], benchPoints: 0, captainPoints: null});
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
                    averageScore: action.averageScore || state.averageScore
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
                    const currentRoundScore = team.current.filter(round => round.event === team.entry.current_event);

                    tot[team.entry.id] = currentRoundScore[0].event_transfers_cost;
                    return tot;
                }, {})
            };
        default:
            return state;
    }
}
