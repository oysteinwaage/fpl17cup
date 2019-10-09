const http = require('http');
const fetch = require('node-fetch');

const express = require('express');
const graphqlHTTP = require('express-graphql');
const {makeExecutableSchema} = require('graphql-tools');
const {typeDefs, resolvers} = require('fpl-api-graphql');

// build executable schema from typedefs and resolvers
const schema = makeExecutableSchema({typeDefs, resolvers});

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
    let leagueId = req.query.leagueId;
    fetch(`https://fantasy.premierleague.com/api/leagues-classic/${leagueId}/standings/?page_new_entries=1&page_standings=1&phase=1`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    })
        .then(r => r.json())
        .then(data => {
// TODO legg inn nytt kall på side 2 av valgt liga hvis data.standings.has_next = true
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
