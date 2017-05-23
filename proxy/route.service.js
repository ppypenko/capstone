"use strict";
var appService = require("./app.service.js");

exports.itemSearch = function (req, res) {
    appService.itemSearch(req.body).then(function (data) {
        res.json(data);
    });
};
exports.itemCheck = function (req, res) {
    appService.itemCheck(req.body).then(function (data) {
        res.json(data);
    });
};
exports.itemBuy = function (req, res) {
    appService.itemBuy(req.body).then(function (data) {
        res.json(data);
    });
};