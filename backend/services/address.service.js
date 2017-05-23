"use strict";
var db = require("../schema/address.schema.js"),
    Q = require("q");

exports.createAddress = function (user) {
    var deferred = Q.defer(),
        newAddress = new db.Address({
            user: user._id.toString(),
            homeaddress: user.homeaddress,
            streetaddress: user.streetaddress,
            city: user.city,
            state: user.state,
            zip: user.zip,
            country: user.country
        });
    newAddress.save(function (err, target) {
        if (err) {
            deferred.reject(err);
        }
        if (target) {
            deferred.resolve(target);
        } else {
            deferred.resolve(false);
        }
    });
    return deferred.promise;
};

exports.updateAddress = function (user) {
    var deferred = Q.defer();
    db.Address.find({
        _id: user.addressid
    }, function (err, target) {
        if (err) {
            deferred.reject(err);
        }
        if (target && target.length === 1) {
            target[0] = {
                homeaddress: user.homeaddress,
                streetaddress: user.streetaddress,
                city: user.city,
                state: user.state,
                zip: user.zip,
                country: user.country
            };
            target[0].save();
            deferred.resolve(target[0]);
        } else {
            deferred.resolve(false);
        }
    });
    return deferred.promise;
};

//-----------------get address(es)-------------------

exports.getAddress = function (user) {
    var deferred = Q.defer();
    db.Address.find({
        _id: user.addressid
    }, function (err, targets) {
        if (err) {
            deferred.reject(err);
        }
        if (targets && targets.length === 1) {
            deferred.resolve(targets[0]);
        } else {
            deferred.resolve(false);
        }
    });
    return deferred.promise;
};

exports.getAllAddresses = function (user) {
    var deferred = Q.defer();
    db.Address.find({
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

exports.getAllUserAddresses = function (user) {
    var deferred = Q.defer();
    db.Address.find({}, function (err, targets) {
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

//--------------delete--------------------------

exports.deleteAddress = function (user) {
    var deferred = Q.defer();
    db.Address.find({
        _id: user.addressid
    }).remove(function (err) {
        deferred.resolve((!err));
    });
    return deferred.promise;
};

exports.deleteAddresses = function (_id) {
    var deferred = Q.defer();
    db.Address.find({
        user: _id.toString()
    }).remove(function (err) {
        deferred.resolve((!err));
    });
    return deferred.promise;
};