var http = require('http');
var express = require('express');
var util = require('util');
var request = require('request');


var app = express();
app.use(express.static('dist'));
app.use(express.static('public'));

app.use(function (err, req, res, next) {
    console.error(err.stack);
    next(err);
});

app.use(function (err, req, res, next) {
    util.inspect(err);
    res.status(500).send({ error: err.message });
});


var URL = "https://fantasy.premierleague.com/drf/entry/1727710/event/5/picks";

app.get('/api/score', function (req, res) {
console.log('yolooo');

        request(URL, function (error, response, body) {
            if (!error && response.statusCode == 200) {
            } else {
                res.status(response.statusCode)
                    .send(error)
                    .end();
            }
        });
});

var server = http.createServer(app);

var port = process.env.PORT || 9999;
app.listen(port);

console.log("Server running on: localhost:", port);