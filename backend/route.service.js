"use strict";
var appData = require("./app.service.js");

exports.getItemList = function (req, res) {
    appData.getItemListInfo(req.body).then(function (data) {
        res.json(data);
    });
};
exports.updateItem = function (req, res) {
    appData.updataItem(req.body.item).then(function (data) {
        res.json(data);
    });
};
exports.addItem = function (req, res) {
    appData.addItem(req.body.item).then(function (data) {
        res.json(data);
    });
};
exports.deleteItem = function (req, res) {
    appData.deleteItem(req.body).then(function (data) {
        res.json(data);
    });
};

exports.addAddress = function (req, res) {
    appData.addAddress(req.body).then(function (data) {
        res.json(data);
    });
};
exports.updateAddress = function (req, res) {
    appData.updateAddress(req.body).then(function (data) {
        res.json(data);
    });
};
exports.deleteAddress = function (req, res) {
    appData.deleteAddress(req.body).then(function (data) {
        res.json(data);
    });
};

exports.getUserDetails = function (req, res) {
    appData.getAccountInfo(req.body).then(function (data) {
        res.json(data);
    });
};

exports.loginUser = function (req, res) {
    appData.loginUser(req.body).then(function (data) {
        if (data.data.token) {
            req.session.token = data.data.token;
        }
        res.json(data);
    });
};

exports.registerUser = function (req, res) {
    appData.registerUser(req.body).then(function (data) {
        if (data.data.token) {
            req.session.token = data.data.token;
        }
        res.json(data);
    });
};

exports.confirmEmail = function (req, res) {
    appData.confirmEmail(req.body).then(function (data) {
        res.json(data);
    });
};

exports.confirmPhone = function (req, res) {
    appData.confirmPhone(req.body).then(function (data) {
        res.json(data);
    });
};

exports.sendEmailToken = function (req, res) {
    appData.sendEmailToken(req.body).then(function (data) {
        res.json(data);
    });
};

exports.sendPhoneToken = function (req, res) {
    appData.sendPhoneToken(req.body).then(function (data) {
        res.json(data);
    });
};

exports.deleteAccount = function (req, res) {
    appData.deleteAccount(req.body).then(function (data) {
        res.json(data);
    });
};

exports.sendCredentialsByPhone = function (req, res) {
    appData.sendCredentialsByPhone(req.body).then(function (data) {
        res.json(data);
    });
};

exports.sendCredentialsByEmail = function (req, res) {
    appData.sendCredentialsByEmail(req.body).then(function (data) {
        res.json(data);
    });
};

exports.updateUser = function (req, res) {
    appData.updateUser(req.body.user).then(function (data) {
        res.json(data);
    });
};

exports.getTerms = function (req, res) {
    res.json(appData.getTerms());
};

exports.getPrivacyPolicy = function (req, res) {
    res.json(appData.getPrivacy());
};

exports.getFAQ = function (req, res) {
    res.json(appData.getFaq());
};

exports.logout = function (req, res) {
    delete req.session.token;
};