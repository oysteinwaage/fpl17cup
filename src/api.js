import {getLeagueManagers, leaguesInDropdownList} from "./utils";

let leagueId = 120053;

export let loadedPlayerIds = [210166, 4984122, 2249091, 1159430, 126466, 404123, 130438, 1025143, 493380, 552453, 1260577, 1618273, 219691, 1259705, 3958980, 444051, 3034647, 531121, 2218701, 131342, 3524888, 3930276, 3126178, 737536, 18575, 1884253 ];

export function getManagerList(chosenLeagueId) {
    leagueId = chosenLeagueId;
    let leagueName = leaguesInDropdownList.find(l => l.id === chosenLeagueId).name;
    loadedPlayerIds = getLeagueManagers(chosenLeagueId);

    return Promise.resolve({
        managers: loadedPlayerIds,
        leagueName: leagueName,
    });

// TODO Funket litt, så virket det som jeg ble "blacklistet" av fpl elns.. får Auth-feil hele tiden nå. Prøv igjen seinere
    // return new Promise((resolve, reject) => {
    //     setTimeout(function () {
    //         fetch(`/api/getManagerList?leagueId=${leagueId}`)
    //             .then(r => r.json())
    //             .then(data => {
    //                 console.log('liga-data ', data);
    //                 loadedPlayerIds = data.standings.results.map(p => p.entry);
    //                 return resolve({
    //                     managers: loadedPlayerIds,
    //                     leagueName: data.league.name,
    //                 });
    //             })
    //             .catch(error => reject(error));
    //     });
    // });
}

export function getRoundScores() {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            fetch(`/api/scores?teams=${loadedPlayerIds}`)
                .then(r => r.json())
                .then(data => {
                    // loadedPlayerIds = data.standings.results.map(p => p.entry);
                    return resolve(data);
                })
                .catch(error => reject(error));
        });
    });
}

export function getStats() {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            fetch(`/api/stats`)
                .then(r => r.json())
                .then(data => {
                    return resolve(data);
                })
                .catch(error => reject(error));
        });
    });
}

export function getPlayerScoresFor(players) {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            fetch(`/api/playerscores?players=${players}`)
                .then(r => r.json())
                .then(data => {
                    return resolve(data);
                })
                .catch(error => reject(error));
        });
    });
}

export function getTransfers() {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            fetch(`/api/getTransfers`)
                .then(r => r.json())
                .then(data => {
                    return resolve(data);
                })
                .catch(error => reject(error));
        });
    });
}

export function getTestNoe() {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            fetch(`/api/test`)
                .then(r => r.json())
                .then(data => {
                    console.log('testNoe', data);
                    return resolve(data);
                })
                .catch(error => reject(error));
        });
    });
}

// export function getStats() {
//     const statsQuery = `{
//       static {
//         events {
//           average_entry_score
//         }
//       }
//     }`;
//     return fetch('/graphql', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json',
//         },
//         body: JSON.stringify({query: statsQuery})
//     }).then(r => r.json())
//         .then(data => data.data.static.events);
// }

// export function getScore() {
//     const scoreQuery = loadedPlayerIds.map(playerId => `
//        {
//        entry(id: ` + playerId + `) {
//         id
//         player_first_name
//         player_last_name
//         summary_overall_points
//         name
//         current_event
//         history(event: ` + playerId + `){
//           current {
//             event
//             points
//             total_points
//             event_transfers
//             event_transfers_cost
//             points_on_bench
//           }
//         }
//         leagues{
//             classic{
//                 id
//                 entry_rank
//                 entry_last_rank
//             }
//         }
//        }
//      }`);
//     return Promise.all(scoreQuery.map(playerQuery => fetch('/graphql', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Accept': 'application/json',
//                 'User-Agent':
//                     'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36',
//             },
//             body: JSON.stringify({query: playerQuery})
//         })
//             .then(r => r.json())
//     ));
// }

// app.get('/api/players', function (req, res) {
//     Promise.all(
//         loadedPlayerIds.map(fplapi.findEntry)
//     ).then(values => {
//         res.type('application/json')
//             .send(values)
//             .end();
//     }).catch((error) => {
//         res.type('application/json')
//             .send(error)
//             .end();
//     });
// });
//
// app.get('/api/chips', function (req, res) {
//     Promise.all(
//         loadedPlayerIds.map(fplapi.findEntryChips)
//     ).then(values => {
//         res.type('application/json')
//             .send(values)
//             .end();
//     }).catch((error) => {
//         res.type('application/json')
//             .send(error)
//             .end();
//     });
// });
//
// app.get('/api/transfers', function (req, res) {
//     Promise.all(
//         loadedPlayerIds.map(fplapi.findEntryTransferHistory)
//     ).then(values => {
//         res.type('application/json')
//             .send(values)
//             .end();
//     }).catch((error) => {
//         res.type('application/json')
//             .send(error)
//             .end();
//     });
// });
//
// app.get('/api/captain', function (req, res) {
//     const query = url.parse(req.url, true).query;
//     Promise.all(
//         loadedPlayerIds.map(p => fplapi.findEntryPicksByEvent(p, query.round))
//     ).then(values => {
//         const data = values.map(vals => {
//             return vals.filter(val => val.is_captain);
//         });
//         const dataVice = values.map(vals => {
//             return vals.filter(val => val.is_vice_captain);
//         });
//         const formattedData = {};
//         loadedPlayerIds.forEach(pId => {
//             const index = loadedPlayerIds.indexOf(pId);
//             Object.assign(formattedData, {
//                 [pId]: {
//                     player: data[index][0].element,
//                     vicePlayer: dataVice[index][0].element,
//                     multiplier: data[index][0].multiplier,
//                     multiplierVice: dataVice[index][0].multiplier,
//                 }
//             })
//         });
//         res.type('application/json')
//             .send(formattedData)
//             .end();
//     }).catch((error) => {
//         res.type('application/json')
//             .send(error)
//             .end();
//     });
// });
//
// app.get('/api/captain2', function (req, res) {
//     const rounds = [1,2,3,4,5,6,7,8,9];
//     Promise.all(
//         loadedPlayerIds.map(p => rounds.map(r => fplapi.findEntryPicksByEvent(p, r)))
//     ).then(values => {
//         const data = values.map(vals => {
//             return vals.filter(val => val.is_captain);
//         });
//         const formattedData = {};
//         loadedPlayerIds.forEach(pId => {
//             const index = loadedPlayerIds.indexOf(pId);
//             Object.assign(formattedData, {
//                 [pId]: {
//                     player: data[index][0].element,
//                     multiplier: data[index][0].multiplier,
//                 }
//             })
//         });
//         res.type('application/json')
//             .send(formattedData)
//             .end();
//     }).catch((error) => {
//         res.type('application/json')
//             .send(error)
//             .end();
//     });
// });
//
// app.get('/api/fplplayers', function (req, res) {
//     fplapi.getElements().then(values => {
//         const playersSortedById = values.sort(function(a,b){ return a.id - b.id });
//         res.type('application/json')
//             .send(playersSortedById)
//             .end();
//     }).catch((error) => {
//         res.type('application/json')
//             .send(error)
//             .end();
//     });
// });
//

// app.get('/api/league', function (req, res) {
//     fplapi.findLeagueStandings(leagueId)
//         .then(values => {
//             res.type('application/json')
//                 .send(values)
//                 .end();
//         }).catch((error) => {
//         res.type('application/json')
//             .send(error)
//             .end();
//     });
// });
//
// app.get('/api/playerscores', function (req, res) {
//     const query = url.parse(req.url, true).query;
//     fplapi.findElementsByEvent(query.round)
//         .then(values => {
//             res.type('application/json')
//                 .send(values)
//                 .end();
//         }).catch((error) => {
//         res.type('application/json')
//             .send(error)
//             .end();
//     })
// });
