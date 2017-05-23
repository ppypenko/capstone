"use strict";
var express = require("express"),
    app = express(),
    jwt = require('jsonwebtoken'),
    bodyparser = require("body-parser"),
    session = require("express-session"),
    router = require('./backend/route.service.js'),
    config = require('./backend/json/config.json'),
    helmet = require('helmet'),
    cors = require("cors"),
    allowCrossDomain = function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Credentials', false);
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        next();
    };
app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: true
}));
app.use(helmet({
    noCache: false
}));
app.use(allowCrossDomain);
app.use(cors());
app.use(bodyparser.urlencoded({
    extended: false
}));
app.use(bodyparser.json());
app.use('/api', function (req, res, next) {
    jwt.verify(req.body.token, config.secret, function (err, decoded) {
        if (decoded && decoded.sub.toString() === req.body._id.toString()) {
            next();
        } else {
            res.json({
                err: true,
                msg: "You are not Authenticated"
            });
        }
    });
});

app.post('/api/item/list', router.getItemList);
app.post('/api/item/update', router.updateItem);
app.post('/api/item/add', router.addItem);
app.post('/api/item/delete', router.deleteItem);

app.post('/api/address/add', router.addAddress);
app.post('/api/address/update', router.updateAddress);
app.post('/api/address/delete', router.deleteAddress);

app.post('/api/user/details', router.getUserDetails);
app.post('/api/user/delete', router.deleteAccount);
app.post('/api/user/update', router.updateUser);

app.post('/api/email/confirm', router.confirmEmail);
app.post('/api/email/send', router.sendEmailToken);

app.post('/api/phone/confirm', router.confirmPhone);
app.post('/api/phone/send', router.sendPhoneToken);

app.post('/forgot/email', router.sendCredentialsByEmail);
app.post('/forgot/phone', router.sendCredentialsByPhone);
app.post('/login', router.loginUser);
app.post('/register', router.registerUser);
app.get('/terms', router.getTerms);
app.get('/privacy', router.getPrivacyPolicy);
app.get('/faq', router.getFAQ);
app.get('/logout', router.logout);

app.listen(80);