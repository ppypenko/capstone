"use strict";
var config = require('../json/config.json'),
    crypto = require('crypto'),
    geocoder = require('geocoder'),
    emailRegex = new RegExp(config.emailRegex),
    passwordRegex = new RegExp(config.passwordRegex),
    randomPass = config.password,
    Q = require('q');

//-----------private functions---------------------------------

function checkEmail(email) {
    return emailRegex.test(email);
}

function checkPassword(pass) {
    return passwordRegex.test(pass);
}

//-----------public functions----------------------------------
exports.checkAddress = function (address) {
    var deferred = Q.defer();
    geocoder.geocode(address, function (err, location) {
        if (err) {
            deferred.reject(err);
        }
        if (location.status === "ok" && location.results.length === 1 && !location.results[0].partial_match) {
            deferred.resolve(true);
        } else {
            deferred.resolve(false);
        }
    });
    return deferred.promise;
};
exports.getRandomNumber = function () {
    var num = Math.floor(100000 + Math.random() * 900000);
    return num;
};

exports.hash = function (pass) {
    return crypto.createHash('sha256').update(pass).digest('hex');
};

exports.createPassword = function (length) {
    var pass = "",
        i = 0;
    do {
        for (i = 0; i < length; i += 1) {
            i = Math.floor(Math.random() * randomPass.length);
            pass += randomPass.charAt(i);
        }
    } while (checkPassword(pass));
    return pass;
};

exports.registerCheck = function (user) {
    var errMsg = "";
    if (!checkEmail(user.email)) {
        errMsg += "<li>Email is not valid.</li>";
    }
    if (!checkPassword(user.password)) {
        errMsg += "<li>Password must have an Upper and Lower case letter, a Number, a Symbol '@!#$^%&*()+=-[]\\\';,.\/{}|\":<>?' and must be at least 10 characters in length.</li>";
    }
    if (user.password !== user.confirm) {
        errMsg += "<li>Password and confirmation do not match.</li>";
    }
    return errMsg;
};