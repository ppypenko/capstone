"use strict";
var db = require("../schema/user.schema.js"),
    func = require("./func.service.js"),
    Q = require("q");

//------------create/update---------------------------

exports.createUser = function (user) {
    var deferred = Q.defer(),
        newUser = new db.User({
            name: user.name,
            firstname: "",
            lastname: "",
            password: func.hash(user.password),
            lastlogin: new Date(),
            phone: {
                address: "",
                token: "",
                auth: false
            },
            email: {
                address: user.email,
                token: func.getRandomNumber(),
                auth: false
            },
            paypal: {
                email: "",
                token: ""
            }
        });

    newUser.save(function (err, target) {
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

exports.updateUser = function (user) {
    var deferred = Q.defer();
    db.User.find({
        _id: user._id
    }, function (err, target) {
        if (err) {
            deferred.reject(err);
        }
        if (target && target.length === 1) {
            target[0].firstname = user.firstname;
            target[0].lastname = user.lastname;
            target[0].password = func.hash(user.password);
            if (target[0].phone.address !== user.phone.address) {
                target[0].phone.address = user.phone.address;
                target[0].phone.token = func.getRandomNumber();
                target[0].phone.auth = false;
            }
            if (target[0].email.address !== user.email.address) {
                target[0].email.address = user.email.address;
                target[0].email.token = func.getRandomNumber();
                target[0].email.auth = false;
            }
            if (target[0].paypal.email !== user.paypal.email) {
                target[0].paypal.email = user.paypal.email;
                target[0].paypal.token = user.paypal.token;
            }
            target[0].save();
            deferred.resolve(target[0]);
        } else {
            deferred.resolve(false);
        }
    });
    return deferred.promise;
};

//------------------for register/login---------------

exports.getUser = function (user) {
    var deferred = Q.defer();
    db.User.find({
        _id: user._id
    }, function (err, target) {
        if (err) {
            deferred.reject(err);
        }
        if (target && target.length === 1) {
            target[0].lastlogin = new Date();
            deferred.resolve(target[0]);
        } else {
            deferred.resolve(false);
        }
    });
    return deferred.promise;
};

exports.checkIfUserExists = function (user) {
    var deferred = Q.defer();
    db.User.find({
        $or: [{
            name: user.name
        }, {
            "email.address": user.email
        }]
    }, function (err, target) {
        if (err) {
            deferred.reject(err);
        }
        if (target && target.length >= 1) {
            deferred.resolve(true);
        } else {
            deferred.resolve(false);
        }
    });
    return deferred.promise;
};

exports.checkUserAuth = function (user) {
    var deferred = Q.defer();
    db.User.find({
        name: user.name,
        password: func.hash(user.password)
    }, function (err, target) {
        if (err) {
            deferred.reject(err);
        }
        if (target && target.length === 1) {
            target[0].lastlogin = new Date();
            deferred.resolve(target[0]);
        } else {
            deferred.resolve(false);
        }
    });
    return deferred.promise;
};

//-------------------forgot----------------------

exports.getCredentials = function (user) {
    var deferred = Q.defer();
    db.User.find({
        $or: [{
            name: user.forgot
        }, {
            "email.address": user.forgot
        }, {
            "phone.address": user.forgot
        }]
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

//-------------------send token------------------

exports.sendPhoneToken = function (user) {
    var deferred = Q.defer();
    db.User.find({
        _id: user._id
    }, function (err, target) {
        if (err) {
            deferred.reject(err);
        }
        if (target && target.length === 1 && target[0].phone.address !== "") {
            var token = func.getRandomNumber();
            target[0].phone.token = token;
            target[0].save();
            deferred.resolve(target[0].phone);
        } else {
            deferred.resolve(false);
        }

    });
    return deferred.promise;
};

exports.sendEmailToken = function (user) {
    var deferred = Q.defer();
    db.User.find({
        _id: user._id
    }, function (err, target) {
        if (err) {
            deferred.reject(err);
        }
        if (target && target.length === 1 && target[0].email.address !== "") {
            var token = func.getRandomNumber();
            target[0].email.token = token;
            target[0].save();
            deferred.resolve(target[0].email);
        } else {
            deferred.resolve(false);
        }
    });
    return deferred.promise;
};

//--------------------confirm---------------------

exports.confirmPhone = function (user) {
    var deferred = Q.defer();
    db.User.find({
        _id: user._id
    }, function (err, target) {
        if (err) {
            deferred.reject(err);
        }
        if (target && target.length === 1 && target[0].phone.token.toString() === user.phonetoken.toString()) {
            target[0].phone.auth = true;
            target[0].save();
            deferred.resolve(target[0].phone.address);
        } else {
            deferred.resolve(false);
        }
    });
    return deferred.promise;
};

exports.confirmEmail = function (user) {
    var deferred = Q.defer();
    db.User.find({
        _id: user._id
    }, function (err, target) {
        if (err) {
            deferred.reject(err);
        }
        if (target && target.length === 1 && target[0].email.token.toString() === user.emailtoken.toString()) {
            target[0].email.auth = true;
            target[0].save();
            deferred.resolve(target[0].email.address);
        } else {
            deferred.resolve(false);
        }
    });
    return deferred.promise;
};

//------------delete------------------------------

exports.deleteUser = function (_id) {
    var deferred = Q.defer();
    db.User.find({
        _id: _id
    }).remove(function (err) {
        deferred.resolve((!err));
    });
    return deferred.promise;
};
exports.getAllUsers = function (user) {
    var deferred = Q.defer();
    db.User.find({}, function (err, targets) {
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