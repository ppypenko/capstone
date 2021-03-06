"use strict";
var mongoose = require('mongoose'),
    config = require('.././json/config.json'),
    db = {};
mongoose.connect(config.connection);
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connection is open');
});
exports.db = db;