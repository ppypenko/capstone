"use strict";
angular.module('app').factory('AuthService', function ($http, $q, config) {
    var service = {};

    function checkEmail(email) {
        return config.emailRegex.test(email);
    }

    function checkPassword(pass) {
        return config.passwordRegex.test(pass);
    }

    function checkPasswords(pass1, pass2) {
        return pass1 === pass2;
    }

    function registerCheck(user, terms, cb) {
        var err = "";
        if (!checkEmail(user.email)) {
            err = "<li>Email is not valid.</li>";
        }
        if (!checkPassword(user.password)) {
            err += "<li>Password must have both an Upper and Lower case letter, a number, a symbol (!?@#$%^&*+-/) and must be at least 8 characters in length.</li>";
        }
        if (!checkPasswords(user.password, user.confirm)) {
            err += "<li>Password and confirmation do not match.</li>";
        }
        if (!terms) {
            err += "<li>Terms not accepted.</li>";
        }
        cb(err);
    }

    function checkAddress(address) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            address: address
        }, function (results, status) {
            console.log(status, results);
            if (status == google.maps.GeocoderStatus.OK) {
                return true;
            } else {
                return false;
            }
        });
    }
    service.checkEmail = checkEmail;
    service.checkPassword = checkPassword;
    service.checkPasswords = checkPasswords;
    service.registerCheck = registerCheck;
    service.checkAddress = checkAddress;
    return service;
});