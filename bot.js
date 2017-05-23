"use strict";
var ITEMS = require('./backend/services/item.service.js'),
    ADDRESSES = require('./backend/services/address.service.js'),
    USERS = require('./backend/services/user.service.js'),
    EMAIL = require('./backend/services/email.service.js'),
    SMS = require('./backend/services/sms.service.js'),
    Q = require('q'),
    CONFIG = require('./backend/json/config.json'),
    request = require('request');

function sendNotification(user, id, type, price, link, item) {
    var msg = "";
    if (user.email.auth || user.phone.auth) {
        if (user.email.auth) {
            EMAIL.sendMail({
                email: user.email.address,
                subject: "Product Price Drop",
                msg: "<h4>Product: " + item.title + " is currently for sale at: " + price + "</h4><p><a href='" + link + "'>" + item.title + "</a></p>"
            }).then(function (response) {
                if (response) {
                    ITEMS.setItemAsDone(item._id);
                }
            });
        }
        if (user.phone.auth) {
            SMS.sendText({
                phone: user.phone.address,
                msg: "Product: " + item.title + "is currently for sale at: " + price + ". " + link
            }).then(function (response) {
                if (response) {
                    ITEMS.setItemAsDone(item._id);
                }
            });
        }
    }
}

function getItems(element) {
    return element[this.type] === this.id && element.price >= this.price && element.dategiven >= element.datechecked;
}

function getUser(element) {
    return element._id.toString() === this;
}

function checkPrice(items, users) {
    var options = {
            method: 'POST',
            uri: CONFIG.proxy + '/check',
            body: items,
            json: true
        },
        results = {
            users: users,
            items: items.items,
            ids: [],
            prices: [],
            links: [],
            types: []
        },
        i,
        x,
        index1,
        index2,
        deferred = Q.defer();
    request(options, function (err, response, body) {
        for (i = 0; i < body.length; i += 1) {
            for (x = 0; x < body[i].length; x += 1) {
                if (body[i][x] !== false) {
                    index1 = results.ids.indexOf(body[i][x].id);
                    index2 = results.types.indexOf(body[i][x].type);
                    body[i][x].price = Number(body[i][x].price.substr(1));
                    if (index1 === -1 || index2 === -1) {
                        results.ids.push(body[i][x].id);
                        results.prices.push(body[i][x].price);
                        results.links.push(body[i][x].link);
                        results.types.push(body[i][x].type);
                    } else {
                        if (results.prices[index1] > body[i][x].price) {
                            results.prices[index1] = body[i][x].price;
                            results.links[index1] = body[i][x].link;
                        }
                    }
                }
            }
        }
        deferred.resolve(results);
    });
    return deferred.promise;
}

function doCheck(items, users) {
    checkPrice(items, users).then(function (results) {
        var index1 = 0,
            index2 = 0,
            user,
            notifyItems = [],
            filteredItems = [],
            filteredItemsLength,
            idlength = results.ids.length;
        for (index1 = 0; index1 < idlength; index1 += 1) {
            filteredItems = results.items.filter(getItems, {
                id: results.ids[index1],
                type: results.types[index1],
                price: results.prices[index1]
            });

            if (filteredItems.length > 0) {
                filteredItemsLength = filteredItems.length;
                for (index2 = 0; index2 < filteredItemsLength; index2 += 1) {
                    user = results.users.filter(getUser, filteredItems[index2].user);
                    if (user.length === 1) {
                        sendNotification(user[0], results.ids[index1], results.types[index1], results.prices[index1], results.links[index1], filteredItems[index2]);
                    }
                }
            }
        }
    });
}



function getIds(items, users) {
    var check = {
            ids: [],
            items: [],
            type: ""
        },
        item,
        size = 10,
        index = 0,
        length = items.length;
    for (index = 0; index < length; index += 1) {
        check.type = items[index].type;
        do {
            if (items[index].ids.length > 10) {
                check.ids = items[index].ids.splice(0, size);
                check.items = items[index].items.splice(0, size);
            } else {
                check.ids = items[index].ids;
                items[index].ids = [];
                check.items = items[index].items;
                items[index].items = [];
            }
            if (check.ids.length > 0) {
                doCheck(check, users);
            }
        } while (items[index].ids.length > 0);
    }
}

function splitBy(items, users) {
    var returnArray = [];
    if (items.length > 0) {
        returnArray.push({
            type: "upc",
            items: [],
            ids: []
        });
        returnArray.push({
            type: "ean",
            items: [],
            ids: []
        });
        returnArray.push({
            type: "isbn",
            items: [],
            ids: []
        });
        items.forEach(function (obj, index) {
            if (obj.upc !== "") {
                returnArray[0].items.push(obj);
                if (returnArray[0].ids.indexOf(obj.upc) === -1) {
                    returnArray[0].ids.push(obj.upc);
                }
            }
            if (obj.upc === "" && obj.ean !== "") {
                returnArray[1].items.push(obj);
                if (returnArray[1].ids.indexOf(obj.ean) === -1) {
                    returnArray[1].ids.push(obj.ean);
                }
            }
            if (obj.upc === "" && obj.ean === "" && obj.isbn !== "") {
                returnArray[2].items.push(obj);
                if (returnArray[2].ids.indexOf(obj.isbn) === -1) {
                    returnArray[2].ids.push(obj.isbn);
                }
            }
        });
        getIds(returnArray, users);
    }
}

function pullData() {
    ITEMS.getAllItems().then(function (items) {
        USERS.getAllUsers().then(function (users) {
            splitBy(items, users);
        });
    });
}
setInterval(pullData, 5000);