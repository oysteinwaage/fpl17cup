const http = require('http');
const express = require('express');
const util = require('util');
const fplapi = require('fpl-api-node');
// const leagueId = 44713;
const playerIds = [
    1727710, 1773168, 446195, 92124, 407749, 1261708, 1898765,
    2690627, 2547467, 144360, 1305123, 1331886, 3041546,
    26900, 1969508, 454412, 2003531, 1083723, 546878, 188947,
    1136421, 159488, 1499253, 86070, 94232, 1413504, 552058,
    276910, 71962, 2287279
];

let app = express();
app.use(express.static('build'));

app.use(function (err, req, res, next) {
    console.error(err.stack);
    next(err);
});

app.use(function (err, req, res, next) {
    util.inspect(err);
    res.status(500).send({error: err.message});
});


app.get('/api/score', function (req, res) {
    Promise.all(
        playerIds.map(fplapi.findEntryEvents)
    ).then(values => {
        res.type('application/json')
            .send(values)
            .end();
    }).catch((error) =>{
        res.type('application/json')
            .send(error)
            .end();
    });
});

app.get('/api/players', function (req, res) {
    Promise.all(
        playerIds.map(fplapi.findEntry)
    ).then(values => {
        res.type('application/json')
            .send(values)
            .end();
    }).catch((error) =>{
        res.type('application/json')
            .send(error)
            .end();
    });
});

app.get('/api/chips', function (req, res) {
    Promise.all(
        playerIds.map(fplapi.findEntryChips)
    ).then(values => {
        res.type('application/json')
            .send(values)
            .end();
    }).catch((error) =>{
        res.type('application/json')
            .send(error)
            .end();
    });
});

app.get('/api/ping', function (req, res) {
        res.type('application/json')
            .send("pong")
            .end();
});

const server = http.createServer(app);

const port = process.env.PORT || 9999;
app.listen(port);

console.log("Server running on: localhost:", port);
