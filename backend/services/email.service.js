"use strict";
var nodemailer = require('nodemailer'),
    email = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'user-removed',
            pass: 'password-removed'
        }
    }),
    Q = require('q');

exports.sendMail = function (user) {
    var deferred = Q.defer();
    email.sendMail({
        from: "email-removed",
        to: user.email,
        subject: user.subject,
        html: user.msg
    }, function (err, info) {
        if (err) {
            deferred.reject(err);
        }
        if (info) {
            deferred.resolve(true);
        } else {
            deferred.resolve(false);
        }
    });
    return deferred.promise;
};