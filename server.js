var http = require('http');
var express = require('express');
var util = require('util');
var request = require('request');
var fplapi = require('fpl-api-node');
const leagueId = 44713;
const playerIds = [
    1727710, 1773168, 446195, 92124, 407749, 1261708, 1898765,
    2690627, 2547467, 144360, 1305123, 1331886, 3041546,
    26900, 1969508, 454412, 2003531, 1083723, 546878, 188947,
    1136421, 159488, 1499253, 86070, 94232, 1413504, 552058,
    276910, 71962, 2287279
];

var app = express();
app.use(express.static('dist'));
app.use(express.static('public'));

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
    });
});

var server = http.createServer(app);

// var port = process.env.PORT || 9999;
var port = 9999;
app.listen(port);

console.log("Server running on: localhost:", port);