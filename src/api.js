
let leagueId = 61858;

let loadedPlayerIds = [110138, 1822874, 280];

export function getManagerList(chosenLeagueId) {
    leagueId = chosenLeagueId;
    let leagueName = "For Fame And Glory";

    // fetch('https://fantasy.premierleague.com/api/leagues-classic/'+leagueId+'/standings/', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json',
    //     },
    //     // body: JSON.stringify({query: "{ entry(id: 1822874){player_first_name} }"})
    // })
    //     .then(r => r.json())
    //     .then(data => console.log('data returned:', data));
    const data = {
                        managers: loadedPlayerIds,
                        leagueName
                    };
    return data;
}
//
// app.get('/api/getManagerList', function (req, res) {
//     const query = url.parse(req.url, true).query;
//     leagueId = query.leagueId;
//     let leagueName = "leagueName";
//
//     fplapi.findLeague(leagueId)
//         .then(values => {
//             leagueName = values.name;
//             fplapi.findLeagueStandings(leagueId)
//                 .then(values => {
//                     loadedPlayerIds = values.map(p => p.entry);
//                     const data = {
//                         managers: loadedPlayerIds,
//                         leagueName
//                     };
//                     res.type('application/json')
//                         .send(data)
//                         .end();
//                 }).catch((error) => {
//                 res.type('application/json')
//                     .send(error)
//                     .end();
//             });
//         });
// });
//
//

export function getScore(){

}

// app.get('/api/score', function (req, res) {
//     Promise.all(
//         loadedPlayerIds.map(fplapi.findEntryEvents)
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
// app.get('/api/stats', function (req, res) {
//     fplapi.getEvents().then(values => {
//         const averagePoints = {};
//         values.forEach(round => {
//             Object.assign(averagePoints, {
//                 [round.id]: round.average_entry_score
//             })
//         });
//         res.type('application/json')
//             .send(averagePoints)
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