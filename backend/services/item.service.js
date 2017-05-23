"use strict";
var db = require("../schema/item.schema.js"),
    Q = require("q");

exports.getItem = function (user) {
    var deferred = Q.defer();
    db.Item.find({
        user: user.id.toString(),
        _id: user.itemid
    }, function (err, target) {
        if (err) {
            deferred.reject(err);
        }
        if (target && target.length === 1) {
            deferred.resolve(target[0]);
        } else {
            deferred.resolve(false);
        }
    });
    return deferred.promise;
};

exports.createItem = function (user) {
    var deferred = Q.defer(),
        date = new Date(),
        item = new db.Item({
            user: user.id.toString(),
            upc: user.upc,
            ean: user.ean,
            isbn: user.isbn,
            price: user.price,
            title: user.title,
            addresses: user.addresses,
            dategiven: date,
            datechecked: date
        });
    item.save(function (err, target) {
        if (err) {
            deferred.reject(err);
        }
        if (target) {
            deferred.resolve(true);
        } else {
            deferred.resolve(false);
        }
    });
    return deferred.promise;
};

exports.updateItem = function (user) {
    var deferred = Q.defer();
    db.Item.find({
        _id: user._id
    }, function (err, target) {
        if (err) {
            deferred.reject(err);
        }
        if (target && target.length === 1) {
            target[0].price = user.price;
            target[0].title = user.title;
            target[0].addresses = user.addresses;
            target[0].dategiven = new Date();
            target[0].save();
            deferred.resolve(target[0]);
        } else {
            deferred.resolve(false);
        }
    });
    return deferred.promise;
};

exports.deleteItem = function (itemid) {
    var deferred = Q.defer();
    db.Item.find({
        _id: itemid
    }).remove(function (err) {
        deferred.resolve((!err));
    });
    return deferred.promise;
};

exports.deleteAllItems = function (_id) {
    var deferred = Q.defer();
    db.Item.find({
        user: _id.toString()
    }).remove(function (err) {
        deferred.resolve((!err));
    });
    return deferred.promise;
};


exports.getAllItemsOfUser = function (user) {
    var deferred = Q.defer();
    db.Item.find({
        user: user._id.toString()
    }, function (err, targets) {
        if (err) {
            deferred.reject(err);
        }
        if (targets) {
            deferred.resolve(targets);
        } else {
            deferred.resolve(false);
        }
    });
    return deferred.promise;
};

exports.getAllItems = function () {
    var deferred = Q.defer();
    db.Item.find({}, function (err, targets) {
        if (err) {
            deferred.reject(err);
        }
        if (targets) {
            deferred.resolve(targets);
        } else {
            deferred.resolve(false);
        }
    });
    return deferred.promise;
};
exports.setItemAsDone = function (itemid) {
    db.Item.find({
        _id: itemid
    }, function (err, target) {
        if (target && target.length === 1) {
            target[0].datechecked = new Date();
            target[0].save();
        }
    });
};