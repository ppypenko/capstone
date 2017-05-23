"use strict";
var request = require("request"),
    cheerio = require("cheerio"),
    Q = require("q");

function search(id, min, max, type) {
    var deferred = Q.defer();
    if (max <= min) {
        max = 10000000;
    }
    request("http://www.newegg.com/Product/ProductList.aspx?Submit=ENE&DEPA=0&Order=BESTMATCH&Description=" + id + "&LeftPriceRange=" + min + "%20" + max, function (error, response, html) {
        var $,
            item,
            link,
            title,
            price;
        if (!error) {
            $ = cheerio.load(html);
            item = $('div.items-view.is-grid').find("div.item-container").find("div.item-info").get(0);
            if (item && item.children && item.children[17] && item.children[7] && item.children[17].children && item.children[7].attribs && item.children[17].children[3] && item.children[17].children[3].children && item.children[17].children[3].children[5].children && item.children[17].children[3].children[5].children[3] && item.children[17].children[3].children[5].children[3].children && item.children[17].children[3].children[5].children[4].children && item.children[17].children[3].children[5].children[3].children[0].data && item.children[17].children[3].children[5].children[4].children[0].data && item.children[7].children && item.children[7].children[0].data && item.children[7] && item.children[7].attribs.href) {
                deferred.resolve({
                    business: "NewEgg",
                    link: item.children[7].attribs.href,
                    title: item.children[7].children[0].data,
                    price: "$" + item.children[17].children[3].children[5].children[3].children[0].data + item.children[17].children[3].children[5].children[4].children[0].data,
                    id: id,
                    type: type
                });
            } else {
                deferred.resolve(false);
            }
        }
    });
    return deferred.promise;
}

function getItemCheck(items) {
    var item = {
        business: items.business,
        link: items.link,
        price: items.price
    };
    return item;
}
exports.ItemSearch = function (list) {
    var deferred = Q.defer(),
        i = 0,
        length = list.ids.length,
        funcs = [];
    for (i = 0; i < length; i += 1) {
        funcs.push(search(list.ids[i].upc, list.min, list.max, ""));
    }
    Q.all(funcs).done(function (values) {
        deferred.resolve(values);
    });
    return deferred.promise;
};
exports.ItemCheck = function (items) {
    var deferred = Q.defer(),
        i = 0,
        length = items.ids.length,
        funcs = [];
    for (i = 0; i < length; i += 1) {
        funcs.push(search(items.ids[i], 0, 0, items.type));
    }
    Q.all(funcs).done(function (values) {
        deferred.resolve(values);
    });
    return deferred.promise;
};
exports.ItemBuy = function (item) {};