"use strict";
var accountSid = 'account-sid-removed',
    authToken = 'token-removed',
    main = "main-phone-removed",
    Q = require('q');

var client = require('twilio')(accountSid, authToken);

exports.sendText = function (user) {
    var deferred = Q.defer();
    client.messages.create({
        to: "+1" + user.phone,
        from: main,
        body: user.msg
    }, function (err, message) {
        if (err) {
            deferred.reject(err);
        }
        if (message) {
            deferred.resolve(true);
        } else {
            deferred.resolve(false);
        }
    });
    return deferred.promise;
};