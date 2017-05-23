"use strict";
var mongoose = require('mongoose'),
    user = {};

user = mongoose.Schema({
    name: String,
    firstname: String,
    lastname: String,
    password: String,
    lastlogin: Date,
    phone: {
        address: String,
        token: Number,
        auth: Boolean
    },
    email: {
        address: String,
        token: Number,
        auth: Boolean
    },
    paypal: {
        email: String,
        token: String
    }
});
exports.User = mongoose.model('User', user);