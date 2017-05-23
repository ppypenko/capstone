"use strict";
var mongoose = require('mongoose'),
    address = {};

address = mongoose.Schema({
    user: String,
    homeaddress: String,
    streetaddress: String,
    city: String,
    state: String,
    zip: String,
    country: String
});
exports.Address = mongoose.model('Address', address);