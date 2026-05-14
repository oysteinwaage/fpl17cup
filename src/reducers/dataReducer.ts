import initialState from './initialState';
import {
    SET_SCORE_DATA,
    SET_ROUND_STATS, TOGGLE_SHOW_TEAM_STATS,
    UPDATE_CHOSEN_LEAGUE_ID,
    UPDATE_GROUP_DATA,
    UPDATE_IS_LOADING_DATA, UPDATE_LEAGUE_DATA,
    UPDATE_PLAYERS_LIST,
    UPDATE_TRANSFERS,
    SET_CAPTAIN_HISTORY
} from '../actions/actions';
import { DataState } from '../types';

export default function dataReducer(state: DataState = initialState.data, action: any): DataState {
    const createDatazObject = (roundScore: any[], managerIds: number[], leagueIdChosenByUser: number | null) => {
        let datazObject: Record<number, any> = managerIds.reduce((acc: Record<number, any>, current: number) => {
            acc[current] = roundScore.map((a: any) => a.current)[Object.keys(acc).length].reduce((a: any, b: any) => {
                const totalPointsOnBench = (a.totalPointsOnBench !== undefined ? a.totalPointsOnBench : 0) + b.points_on_bench;
                const totalHitsTaken = (a.totalHitsTaken !== undefined ? a.totalHitsTaken : 0) + b.event_transfers_cost;
                Object.assign(a, {
                    ['round' + b.event]: {
                        points: b.points - b.event_transfers_cost,
                        pointsOnBench: b.points_on_bench,
                        takenHit: b.event_transfers_cost,
                        totalPoints: b.total_points,
                        overallRank: b.overall_rank,
                        gwRank: b.rank,
                        squadValue: b.value,
                    },
                    totalPointsOnBench,
                    totalHitsTaken,
                });
                return a;
            }, {});
            return acc;
        }, {});
        roundScore.forEach((player: any) => {
            const myLeague = player.entry.leagues.classic.find((league: any) => league.id === leagueIdChosenByUser);
            const allRanks = player.current.map((r: any) => r.overall_rank).filter((r: number) => r > 0);
            Object.assign(datazObject[player.entry.id], {
                leagueClimb: myLeague.entry_last_rank - myLeague.entry_rank,
                leagueRank: myLeague.entry_rank,
                lastRoundLeagueRank: myLeague.entry_last_rank,
                managerName: player.entry.player_first_name + ' ' + player.entry.player_last_name,
                name: player.entry.name,
                currentOverallRank: player.entry.summary_overall_rank,
                bestOverallRank: allRanks.length > 0 ? Math.min(...allRanks) : null,
                currentSquadValue: player.entry.last_deadline_value,
            });
            player.chips.forEach((chip: any) => {
                Object.assign(datazObject[player.entry.id]['round' + chip.event], {
                    chipsPlayed: {
                        chipName: chip.name === '3xc' ? 'Triple Captain' : chip.name,
                        playedTime: chip.time,
                    }
                })
            });
        });

        return datazObject;
    };

    switch (action.type) {
        case UPDATE_CHOSEN_LEAGUE_ID:
            return {
                ...state,
                leagueIdChosenByUser: action.leagueId
            };
        case SET_SCORE_DATA: {
            const currentRound = action.roundScore[0].entry.current_event;
            return {
                ...state,
                currentRound,
                isCurrentRoundFinished: !!(state.roundStats[currentRound] && state.roundStats[currentRound].finished),
                dataz: createDatazObject(action.roundScore, state.managerIds, state.leagueIdChosenByUser)
            };
        }
        case SET_ROUND_STATS:
            return {
                ...state,
                roundStats: action.roundStats,
            };
        case UPDATE_LEAGUE_DATA:
            return {
                ...state,
                leagueData: action.leagueData,
                managerIds: action.leagueData.managers
            };
        case UPDATE_GROUP_DATA:
            return {
                ...state,
                groupData: action.groupData
            };
        case UPDATE_PLAYERS_LIST:
            return {
                ...state,
                players: action.players
            };
        case UPDATE_IS_LOADING_DATA:
            return {
                ...state,
                isLoadingData: action.isLoading
            };
        case UPDATE_TRANSFERS: {
            const newDataz = {...state.dataz};
            if (action.transferData && action.transferData.length > 0) {
                action.transferData.forEach(function (i: any[]) {
                    i.forEach(function (transfer: any) {
                        const tidspunkt = new Date(transfer.time).toLocaleDateString() + ' ' + new Date(transfer.time).toLocaleTimeString();
                        if (newDataz[transfer.entry]['round' + transfer.event].transfers) {
                            newDataz[transfer.entry]['round' + transfer.event].transfers.push([transfer.element_in, transfer.element_out, tidspunkt]);
                        } else {
                            Object.assign(newDataz[transfer.entry]['round' + transfer.event], {
                                transfers: [[transfer.element_in, transfer.element_out, tidspunkt]]
                            })
                        }
                    })
                })
            }
            return {
                ...state,
                transferlist: action.transferData,
                dataz: newDataz
            };
        }
        case TOGGLE_SHOW_TEAM_STATS:
            return {
                ...state,
                showTeamStatsModal: action.teamId
            };
        case SET_CAPTAIN_HISTORY: {
            const newDataz = {...state.dataz};
            action.captainHistory.forEach(({ teamId, round, captain, vice, multiplier, multiplierVice, captainPoints }: any) => {
                if (captain !== null && newDataz[teamId] && newDataz[teamId]['round' + round]) {
                    Object.assign(newDataz[teamId]['round' + round], {
                        captain: { player: captain, vicePlayer: vice, multiplier, multiplierVice, captainPoints }
                    });
                }
            });
            return { ...state, dataz: newDataz };
        }
        default:
            return state;
    }
}
