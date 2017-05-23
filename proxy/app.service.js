"use strict";
var amazon = require("./api/amazon.api.js"),
    newegg = require("./api/newegg.api.js"),
    Q = require("q");

exports.itemSearch = function (search) {
    var deferred = Q.defer(),
        list = {
            items: [],
            ids: []
        };
    amazon.ItemSearch(search).then(function (data) {
        list.items.push(data.items);
        list.ids = data.ids;
        var checklist = {
            ids: data.ids,
            min: data.min,
            max: data.max
        };
        newegg.ItemSearch(checklist).then(function (data) {
            list.items.push(data);
            deferred.resolve(list);
        });
    }).catch(function (err) {
        console.log.bind(console);
    });
    return deferred.promise;
};
exports.itemCheck = function (check) {
    var deferred = Q.defer(),
        funcs = [];
    funcs.push(amazon.ItemCheck(check));
    funcs.push(newegg.ItemCheck(check));
    Q.all(funcs).done(function (values) {
        deferred.resolve(values);
    });
    return deferred.promise;
};
exports.itemBuy = function (buy) {
    var deferred = Q.defer();
    amazon.itemBuy(buy).then(function (data) {
        deferred.resolve(data);
    });
    return deferred.promise;
};