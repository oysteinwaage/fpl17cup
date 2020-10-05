const http = require('http');
const fetch = require('node-fetch');

const express = require('express');
const graphqlHTTP = require('express-graphql');
const {makeExecutableSchema} = require('graphql-tools');
const {typeDefs, resolvers} = require('fpl-api-graphql');
const {fetchBootstrap, fetchEntry, fetchEntryHistory, fetchClassicLeague} = require('fpl-api');

// build executable schema from typedefs and resolvers
const schema = makeExecutableSchema({typeDefs, resolvers});

let leagueId = null;
let loadedPlayerIds = [210166, 4984122, 2249091, 1159430, 126466, 404123, 130438, 1025143, 493380, 552453, 1260577, 1618273, 219691, 1259705, 3958980, 444051, 3034647, 531121, 2218701, 131342, 3524888, 3930276, 3126178, 737536, 18575, 1884253];

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
            console.log('ligaData: ', values);
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
    fetchBootstrap()
        .then(values => {
            let stats = {};
            const averagePoints = {};
            values.events.forEach(round => {
                stats = {...stats, [round.id]: round};
                Object.assign(averagePoints, {
                    [round.id]: {
                        average_entry_score: round.average_entry_score
                    }
                })
            });
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

const server = http.createServer(app);

const port = process.env.PORT || 9999;
app.listen(port);

console.log("Server running on: localhost:", port);

// app.get('/api/getTestDirekte', function (req, res) {
//     let teamId = req.query.teamId;
//     fetch(`https://fantasy.premierleague.com/api/entry/${teamId}/`, {
//         method: 'GET',
//         headers: {
//             'User-Agent':
//                 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36',
//             'Content-Type': 'application/json',
//             'Accept': 'application/json',
//         },
//     })
//         .then(r => r.json())
//         .then(data => {
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
