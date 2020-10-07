const http = require('http');
const fetch = require('node-fetch');

const express = require('express');
const graphqlHTTP = require('express-graphql');
const {makeExecutableSchema} = require('graphql-tools');
const {typeDefs, resolvers} = require('fpl-api-graphql');
const {fetchBootstrap, fetchEntry, fetchEntryHistory, fetchClassicLeague, fetchElementSummary, fetchEntryEvent} = require('fpl-api');

// build executable schema from typedefs and resolvers
const schema = makeExecutableSchema({typeDefs, resolvers});

let leagueId = null;
let loadedPlayerIds = [210166, 4984122, 2249091, 1159430, 126466, 404123, 130438, 1025143, 493380, 552453, 1260577, 1618273, 219691, 1259705, 3958980, 444051, 3034647, 531121, 2218701, 131342, 3524888, 3930276, 3126178, 737536, 18575, 1884253];
let currentRound = 0;
let allPlayersList = [];

// express app
const app = express();

// graphql
app.use(
    '/graphql',
    graphqlHTTP({
        schema,
        graphiql: true,
    }),
);


//let app = express();
app.use(express.static('build'));

app.get('/api/getManagerList', function (req, res) {
    leagueId = req.query.leagueId;
    console.log('ligaId: ', leagueId);
    fetchClassicLeague(leagueId)
        .then(values => {
            loadedPlayerIds = values.map(p => p.entry);
            res.type('application/json')
                .send(loadedPlayerIds)
                .end();
        }).catch((error) => {
        res.type('application/json')
            .send(error)
            .end();
    });
});

// app.get('/api/getManagerList', function (req, res) {
//     let leagueId = req.query.leagueId;
//     fetch(`https://fantasy.premierleague.com/api/leagues-classic/${leagueId}/standings/?page_new_entries=1&page_standings=1&phase=1`, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json',
//         },
//     })
//         .then(r => r.json())
//         .then(data => {
// // TODO legg inn nytt kall på side 2 av valgt liga hvis data.standings.has_next = true
//             res.type('application/json')
//                 .send(data)
//                 .end();
//         })
//         .catch(error => {
//             res.type('application/json')
//                 .send(error)
//                 .end();
//         });
// });

app.get('/api/stats', function (req, res) {
    allPlayersList = [];
    fetchBootstrap()
        .then(values => {
            let stats = {};
            values.events.forEach(round => {
                if (round.is_current) currentRound = round.id;

                Object.assign(stats, {
                    [round.id]: {
                        average_entry_score: round.average_entry_score,
                        chip_plays: round.chip_plays,
                        highest_score: round.highest_score,
                        top_element_info: round.top_element_info,
                        most_captained: round.most_captained,
                        most_vice_captained: round.most_vice_captained,
                        most_transferred_in: round.most_transferred_in,
                        is_current: round.is_current,
                        finished: round.finished
                    }
                })
            });

            let allPlayers = {};
            values.elements.forEach(player => {
                allPlayersList.push(player.id);
                allPlayers = {
                    ...allPlayers,
                    [player.id]: {
                        first_name: player.first_name,
                        second_name: player.second_name,
                        web_name: player.web_name,
                        selected_by_percent: player.selected_by_percent,
                        form: player.form,
                        transfers_in_event: player.transfers_in_event,
                        transfers_out_event: player.transfers_out_event,
                        total_points: player.total_points,
                        in_dreamteam: player.in_dreamteam
                    }
                }
            });
            stats = {...stats, allPlayers};

            res.type('application/json')
                .send(stats)
                .end();
        }).catch((error) => {
        res.type('application/json')
            .send(error)
            .end();
    });
});

app.get('/api/scores', function (req, res) {
    // let teams = req.query.teams;
    Promise.all(loadedPlayerIds.map(teamId => {
        return fetchEntry(teamId)
            .then(entry => {
                return fetchEntryHistory(teamId)
                    .then(data => {
                        return Promise.resolve({...data, entry});
                    })
            })
    }))
        .then(data => {
            res.type('application/json')
                .send(data)
                .end();
        })
        .catch(error => {
            res.type('application/json')
                .send(error)
                .end();
        });
});

app.get('/api/playerscores', function (req, res) {
    const playersTransferred = req.query.players.split(',');
    Promise.all(playersTransferred.map(fetchElementSummary))
        .then(values => {
            const playerScores = values.reduce(function (prev, curr) {
                prev[curr.id] = curr.history;
                return prev;
            }, {});
            res.type('application/json')
                .send(playerScores)
                .end();
        }).catch((error) => {
        console.log('error ', error);
        res.type('application/json')
            .send(error)
            .end();
    });
});

app.get('/api/test', function (req, res) {
    fetchEntryEvent(531121, 4)
        .then(values => {
            res.type('application/json')
                .send(values)
                .end();
        }).catch((error) => {
        res.type('application/json')
            .send(error)
            .end();
    });
});

app.get('/api/getTransfers', function (req, res) {
    Promise.all(loadedPlayerIds.map(teamId =>
        new Promise((resolve, reject) => {
            setTimeout(function () {
                fetch(`https://fantasy.premierleague.com/api/entry/${teamId}/transfers/`, {
                    method: 'GET',
                    headers: {
                        'User-Agent':
                            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36',
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                }).then(r => {
                    return resolve(r.json());
                })
                    .catch(error => reject(error))
            })
        })
    ))
        .then(data => {
            // let resultJson = {};
            // data.forEach(p => {
            //     resultJson = {
            //         ...resultJson,
            //         [p[0].entry]: p
            //     }
            // });

            res.type('application/json')
                .send(data)
                .end();
        })
        .catch(error => {
            console.log('getTransfers error: ', error);
            res.type('application/json')
                .send(error)
                .end();
        })
});

const server = http.createServer(app);

const port = process.env.PORT || 9999;
app.listen(port);

console.log("Server running on: localhost:", port);

