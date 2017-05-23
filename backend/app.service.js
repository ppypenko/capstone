"use strict";
var FUNC = require('./services/func.service.js'),
    ADDRESS = require('./services/address.service.js'),
    ITEM = require('./services/item.service.js'),
    USER = require('./services/user.service.js'),
    JWT = require('jsonwebtoken'),
    CONFIG = require('./json/config.json'),
    Q = require("q"),
    TERMS = require('./json/terms.json'),
    FAQ = require('./json/faq.json'),
    SMS = require('./services/sms.service.js'),
    EMAIL = require('./services/email.service.js');

//------------------policies---------------------------

exports.getTerms = function () {
    return TERMS;
};

exports.getFaq = function () {
    return FAQ;
};

exports.getPrivacyPolicy = function () {
    return TERMS[0];
};

//---------------account info---------------------------

exports.getAccountInfo = function (user) {
    var deferred = Q.defer();
    USER.getUser(user).then(function (target) {
        ADDRESS.getAllAddresses(user).then(function (addresses) {
            if (target && addresses) {
                deferred.resolve({
                    err: false,
                    data: {
                        user: target,
                        addresses: addresses
                    }
                });
            } else {
                deferred.resolve({
                    err: true,
                    msg: "<li>Account details cannot be found</li>"
                });
            }
        });
    });
    return deferred.promise;
};

exports.getItemListInfo = function (user) {
    var deferred = Q.defer();
    ITEM.getAllItems(user).then(function (items) {
        ADDRESS.getAllAddresses(user).then(function (addresses) {
            if (items && addresses) {
                deferred.resolve({
                    err: false,
                    data: {
                        items: items,
                        addresses: addresses
                    }
                });
            } else {
                deferred.resolve({
                    err: true,
                    msg: "<li>Your list is currently empty</li>"
                });
            }
        });
    });
    return deferred.promise;
};

//--------------item functions------------------------

exports.addItem = function (user) {
    var deferred = Q.defer();
    ITEM.createItem(user).then(function (target) {
        if (target) {
            deferred.resolve({
                err: false,
                data: target
            });
        } else {
            deferred.resolve({
                err: true,
                msg: "<li>Error adding item</li>"
            });
        }
    });
    return deferred.promise;
};

exports.updateItem = function (user) {
    var deferred = Q.defer();
    ITEM.updateItem(user).then(function (target) {
        if (target) {
            deferred.resolve({
                err: false,
                data: target
            });
        } else {
            deferred.resolve({
                err: true,
                msg: "<p>Error updating item</p>"
            });
        }
    });
    return deferred.promise;
};

exports.deleteItem = function (user) {
    var deferred = Q.defer();
    ITEM.deleteItem(user).then(function (check) {
        if (!check) {
            deferred.resolve({
                err: false,
                data: true
            });
        } else {
            deferred.resolve({
                err: true,
                msg: "<p>Error deleting item</p>"
            });
        }
    });
    return deferred.promise;
};

//--------------address functions---------------------

exports.addAddress = function (user) {
    var deferred = Q.defer();
    if (FUNC.checkAddress(user.homeaddress + " " + user.streetaddress + ", " + user.city + ", " + user.state + " " + user.zip)) {
        ADDRESS.createAddress(user).then(function (target) {
            if (target) {
                deferred.resolve({
                    err: false,
                    data: target
                });
            } else {
                deferred.resolve({
                    err: true,
                    msg: "<li>Error creating address</li>"
                });
            }
        });
    } else {
        deferred.resolve({
            err: true,
            msg: "<li>Address not found!</li>"
        });
    }
    return deferred.promise;
};

exports.updateAddress = function (user) {
    var deferred = Q.defer();
    if (FUNC.checkAddress(user.homeaddress + " " + user.streetaddress + ", " + user.city + ", " + user.state + " " + user.zip)) {
        ADDRESS.updateAddress(user).then(function (target) {
            if (target) {
                deferred.resolve({
                    err: false,
                    data: target
                });
            } else {
                deferred.resolve({
                    err: true,
                    msg: "<li>Error updating address</li>"
                });
            }
        });
    } else {
        deferred.resolve({
            err: true,
            msg: "<li>Address not found!</li>"
        });
    }
    return deferred.promise;
};

exports.deleteAddress = function (user) {
    var deferred = Q.defer();
    ADDRESS.deleteAddress(user).then(function (check) {
        if (!check) {
            deferred.resolve({
                err: false,
                data: true
            });
        } else {
            deferred.resolve({
                err: true,
                msg: "<li>There appears to be trouble deleting the address</li>"
            });
        }
    });
    return deferred.promise;
};

//--------------delete account-------------------------------

exports.deleteAccount = function (user) {
    var deferred = Q.defer();
    USER.deleteUser(user._id).then(function (err1) {
        ITEM.deleteAllItems(user._id).then(function (err2) {
            ADDRESS.deleteAddresses(user._id).then(function (err3) {
                deferred.resolve((err1 && err2 && err3));
            });
        });
    });
    return deferred.promise;
};


//------------user functions-------------------------

exports.updateUser = function (user) {
    var deferred = Q.defer();
    USER.updateUser(user).then(function (target) {
        if (target) {
            deferred.resolve({
                err: false,
                data: target
            });
        } else {
            deferred.resolve({
                err: true,
                msg: '<li>Update failed</li>'
            });
        }
    });
    return deferred.promise;
};
exports.registerUser = function (user) {
    var deferred = Q.defer();
    USER.checkIfUserExists(user).then(function (check) {
        if (check) {
            deferred.resolve({
                err: true,
                msg: '<li>Email or Name already taken</li>'
            });
        } else {
            USER.createUser(user).then(function (target) {
                if (target) {
                    var token = JWT.sign({
                        sub: target._id
                    }, CONFIG.secret);
                    deferred.resolve({
                        err: false,
                        data: {
                            _id: target._id,
                            name: target.name,
                            token: token
                        }
                    });
                    USER.sendEmailToken(user).then(function (email) {
                        if (email) {
                            EMAIL.sendMail({
                                email: email.address,
                                subject: "Email Confirmation",
                                msg: "<p>Confirmation Token: " + email.token + "</p>"
                            });
                        }
                    });
                } else {
                    deferred.resolve({
                        err: true,
                        msg: '<li>Error creating user</li>'
                    });
                }
            });
        }
    });
    return deferred.promise;
};

exports.loginUser = function (user) {
    var deferred = Q.defer();
    USER.checkUserAuth(user).then(function (target) {
        if (target) {
            var token = JWT.sign({
                sub: target._id
            }, CONFIG.secret);
            deferred.resolve({
                err: false,
                data: {
                    _id: target._id,
                    name: target.name,
                    token: token
                }
            });
        } else {
            deferred.resolve({
                err: true,
                msg: '<li>Username or Password incorrect</li>'
            });
        }
    });
    return deferred.promise;
};

//-----------forgot credentials-------------------------------

exports.sendCredentialsByPhone = function (user) {
    var deferred = Q.defer();
    USER.getCredentials(user).then(function (target) {
        if (target) {
            SMS.sendText({
                msg: "Name: " + target.name + "\n" + "Password: " + target.password,
                phone: target.phone.address
            }).then(function (msg) {
                if (msg) {
                    deferred.resolve({
                        err: false,
                        data: true
                    });
                } else {
                    deferred.resolve({
                        err: true,
                        msg: "<li>There was an error sending the SMS.</li>"
                    });
                }
            });
        } else {
            deferred.resolve({
                err: true,
                msg: "<li>User not found. Please check that the information is correct.</li>"
            });
        }
    });
    return deferred.promise;
};
exports.sendCredentialsByEmail = function (user) {
    var deferred = Q.defer();
    USER.getCredentials(user).then(function (target) {
        if (target) {
            EMAIL.sendMail({
                email: target.email.address,
                subject: "Your Credentials",
                msg: "<p>Name: " + target.name + "</p><p>Password: " + target.password + "</p>"
            }).then(function (good) {
                if (good) {
                    deferred.resolve({
                        err: false,
                        data: good
                    });
                } else {
                    deferred.resolve({
                        err: true,
                        msg: "<li>Email not found. Please check that the email is correct.</li>"
                    });
                }
            });
        } else {
            deferred.resolve({
                err: true,
                msg: "<li>User not found. Please check that the information is correct.</li>"
            });
        }
    });
    return deferred.promise;
};

//-----------confirm Email & Phone-----------------------------

exports.confirmEmail = function (user) {
    var deferred = Q.defer();
    USER.confirmEmail(user).then(function (target) {
        var response = (target) ? {
            err: false,
            data: target
        } : {
            err: true,
            msg: "<li>Token is incorrect</li>"
        };
        deferred.resolve(response);
    });
    return deferred.promise;
};

exports.confirmPhone = function (user) {
    var deferred = Q.defer();
    USER.confirmPhone(user).then(function (target) {
        var response = (target) ? {
            err: false,
            data: target
        } : {
            err: true,
            msg: "<li>Token is incorrect</li>"
        };
        deferred.resolve(response);
    });
    return deferred.promise;
};

//---------------send tokens--------------------------

exports.sendPhoneToken = function (user) {
    var deferred = Q.defer();
    USER.sendPhoneToken(user).then(function (phone) {
        if (phone) {
            SMS.sendText({
                phone: phone.address,
                msg: "Confirmation Token: " + phone.token
            }).then(function (msg) {
                if (msg) {
                    deferred.resolve({
                        err: false,
                        data: msg
                    });
                } else {
                    deferred.resolve({
                        err: true,
                        msg: "<li>Error texting token</li>"
                    });
                }
            });
        } else {
            deferred.resolve({
                err: true,
                msg: "<li>Phone Number not found</li>"
            });
        }
    });
    return deferred.promise;
};

exports.sendEmailToken = function (user) {
    var deferred = Q.defer();
    USER.sendEmailToken(user).then(function (email) {
        if (email) {
            EMAIL.sendMail({
                email: email.address,
                subject: "Email COnfirmation",
                msg: "<p>Confirmation Token: " + email.token + "</p>"
            }).then(function (msg) {
                if (msg) {
                    deferred.resolve({
                        err: false,
                        data: msg
                    });
                } else {
                    deferred.resolve({
                        err: true,
                        msg: "<li>Email not found. Please check that the email is correct.</li>"
                    });
                }
            });
        } else {
            deferred.resolve({
                err: true,
                msg: "<li>Email Address not found</li>"
            });
        }
    });
    return deferred.promise;
};