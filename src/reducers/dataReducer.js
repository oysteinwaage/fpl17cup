import initialState from './initialState';
import {
  SET_CURRENT_ROUND,
  SET_MANAGER_IDS,
  SET_ROUND_STATS,
  UPDATE_CHOSEN_LEAGUE_ID,
  UPDATE_GROUP_DATA,
  UPDATE_IS_LOADING_DATA,
  UPDATE_PLAYERS_LIST,
  UPDATE_TRANSFERS
} from '../actions/actions';

export default function dataReducer(state = initialState, action) {
  const createDatazObject = (roundScore, managerIds, leagueIdChosenByUser) => {
    let datazObject = managerIds.reduce((acc, current) => {
      acc[current] = roundScore.map(a => a.current)[Object.keys(acc).length].reduce((a, b) => {
        const totalPointsOnBench = (a.totalPointsOnBench !== undefined ? a.totalPointsOnBench : 0) + b.points_on_bench;
        const totalHitsTaken = (a.totalHitsTaken !== undefined ? a.totalHitsTaken : 0) + b.event_transfers_cost;
        Object.assign(a, {
          ['round' + b.event]: {
            points: b.points - b.event_transfers_cost,
            pointsOnBench: b.points_on_bench,
            takenHit: b.event_transfers_cost,
          },
          totalPointsOnBench,
          totalHitsTaken,
        });
        return a;
      }, {});
      return acc;
    }, {});
    roundScore.forEach(player => {
      const myLeague = player.entry.leagues.classic.find(league => league.id === leagueIdChosenByUser);
      // TODO dette her blir litt feil. Det må inn pr runde sånn som for chips under (utenom managerName og name, det kan være her
      Object.assign(datazObject[player.entry.id], {
        leagueClimb: myLeague.entry_last_rank - myLeague.entry_rank,
        leagueRank: myLeague.entry_rank,
        lastRoundLeagueRank: myLeague.entry_last_rank,
        managerName: player.entry.player_first_name + ' ' + player.entry.player_last_name,
        name: player.entry.name
      });
      player.chips.forEach(chip => {
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
        case SET_CURRENT_ROUND:
          return {
                ...state,
                currentRound: action.roundScore[0].entry.current_event,
                dataz: createDatazObject(action.roundScore, state.managerIds, state.leagueIdChosenByUser)
            };
        case SET_ROUND_STATS:
            return {
                ...state,
                roundStats: action.roundStats
            };
        case SET_MANAGER_IDS:
            return {
                ...state,
                managerIds: action.managers
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
        case UPDATE_TRANSFERS:
            const newDataz = {...state.dataz};
            if (action.transferData && action.transferData.length > 0) {
                action.transferData.forEach(function (i) {
                    i.forEach(function (transfer) {
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
        default:
            return state;
    }
}
