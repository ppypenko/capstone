"use strict";
var express = require("express"),
    routes = require("./proxy/route.service.js"),
    app = express(),
    helmet = require('helmet'),
    cors = require("cors"),
    bodyparser = require("body-parser"),
    allowCrossDomain = function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Credentials', false);
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        next();
    };
app.use(helmet({
    noCache: false
}));

app.use(allowCrossDomain);
app.use(bodyparser.urlencoded({
    extended: false
}));
app.use(bodyparser.json());
app.use(cors());
app.post('/search', routes.itemSearch);
app.post('/check', routes.itemCheck);
app.post('/buy', routes.itemBuy);

app.listen(8080);