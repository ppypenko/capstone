"use strict";
var mongoose = require('mongoose'),
    item = {};

item = mongoose.Schema({
    user: String,
    upc: String,
    ean: String,
    isbn: String,
    price: Number,
    title: String,
    bot: Boolean,
    addresses: [{
        addressid: String,
        amount: Number
    }],
    dategiven: Date,
    datechecked: Date
});
exports.Item = mongoose.model('Item', item);