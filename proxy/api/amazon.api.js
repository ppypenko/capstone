"use strict";
var amazon = require("amazon-product-api"),
    Q = require("q"),
    credentials = {
        awsId: "non-functional-id",
        awsSecret: "non-functional-secret",
        awsTag: "tag-removed"
    },
    map = {
        "Appliances": "Appliances",
        "Art'nCrafts": "ArtsAndCrafts",
        "Automotive": "Automotive",
        "Baby": "Baby",
        "Beauty": "Beauty",
        "Books": "Books",
        "Music": "Music",
        "Wireless": "Wireless",
        "Fashion": "Fashion",
        "Baby Fashion": "FashionBaby",
        "Boys Fashion": "FashionBoys",
        "Girls Fashion": "FashionGirls",
        "Mens Fashion": "FashionMen",
        "Womens Fashion": "FashionWomen",
        "Collectibles": "Collectibles",
        "PCHardware": "PCHardware",
        "Electronics": "Electronics",
        "Grocery": "Grocery",
        "Health": "HealthPersonalCare",
        "Home'nGarden": "HomeGarden",
        "Industrial": "Industrial",
        "Luggage": "Luggage",
        "Magazines": "Magazines",
        "Movies": "Movies",
        "Musical Instruments": "MusicalInstruments",
        "Office": "OfficeProducts",
        "Lawn'nGarden": "LawnAndGarden",
        "PetSupplies": "PetSupplies",
        "Pantry": "Pantry",
        "Software": "Software",
        "Sporting Goods": "SportingGoods",
        "Tools": "Tools",
        "Toys": "Toys",
        "Video Games": "VideoGames",
        "All": "Blended"
    };

exports.ItemSearch = function (search) {
    var deferred = Q.defer(),
        client = amazon.createClient(credentials);
    search.maxprice = Number(search.maxprice.toString() + "00");
    search.minprice = Number(search.minprice.toString() + "00");

    if (search.maxprice < search.minprice) {
        search.maxprice = 10000000;
    }
    client.itemSearch({
        searchIndex: map[search.index],
        itemPage: search.page,
        Availability: "Available",
        keywords: search.keyword,
        MaximumPrice: search.maxprice,
        MinimumPrice: search.minprice,
        responseGroup: "ItemAttributes,Offers"
    }).then(function (results) {
        var items = [],
            ids = [],
            i = 0,
            price = "";
        for (i = 0; i < 10; i += 1) {
            if (results[i].OfferSummary && results[i].OfferSummary[0]) {
                if (results[i].OfferSummary[0].LowestNewPrice) {
                    price = results[i].OfferSummary[0].LowestNewPrice[0].FormattedPrice[0];
                } else if (results[i].OfferSummary[0].LowestUsedPrice) {
                    price = results[i].OfferSummary[0].LowestUsedPrice[0].FormattedPrice[0];
                } else if (results[i].OfferSummary[0].LowestRefurbishedPrice) {
                    price = results[i].OfferSummary[0].LowestRefurbishedPrice[0].FormattedPrice[0];
                }
            }
            items.push({
                business: "Amazon",
                link: (results[i].DetailPageURL) ? results[i].DetailPageURL[0] : "",
                title: (results[i].ItemAttributes[0].Title) ? results[i].ItemAttributes[0].Title[0] : "",
                price: price
            });
            ids.push({
                upc: (results[i].ItemAttributes[0].UPC) ? results[i].ItemAttributes[0].UPC[0] : "",
                ean: (results[i].ItemAttributes[0].EAN) ? results[i].ItemAttributes[0].EAN[0] : "",
                isbn: (results[i].ItemAttributes[0].ISBN) ? results[i].ItemAttributes[0].ISBN[0] : ""
            });
        }
        deferred.resolve({
            items: items,
            ids: ids,
            max: search.maxprice,
            min: search.minprice
        });
    }).catch(function (err) {
        console.log(err);
    });
    return deferred.promise;
};

exports.ItemCheck = function (check) {
    var deferred = Q.defer(),
        client = amazon.createClient(credentials);
    client.itemLookup({
        idType: check.type.toLocaleUpperCase(),
        itemId: check.ids.toString(),
        responseGroup: "ItemAttributes,Offers"
    }).then(function (results) {
        var items = [],
            id = "",
            i = 0,
            price = "",
            length = results.length;
        for (i = 0; i < length; i += 1) {
            if (results[i].OfferSummary && results[i].OfferSummary[0]) {
                if (results[i].OfferSummary[0].LowestNewPrice) {
                    price = results[i].OfferSummary[0].LowestNewPrice[0].FormattedPrice[0];
                } else if (results[i].OfferSummary[0].LowestUsedPrice) {
                    price = results[i].OfferSummary[0].LowestUsedPrice[0].FormattedPrice[0];
                } else if (results[i].OfferSummary[0].LowestRefurbishedPrice) {
                    price = results[i].OfferSummary[0].LowestRefurbishedPrice[0].FormattedPrice[0];
                }
            }
            if (check.type === "upc" && results[i].ItemAttributes[0].UPC) {
                id = results[i].ItemAttributes[0].UPC[0];
            } else if (check.type === "ean" && results[i].ItemAttributes[0].EAN) {
                id = results[i].ItemAttributes[0].EAN[0];
            } else if (check.type === "isbn" && results[i].ItemAttributes[0].ISBN) {
                id = results[i].ItemAttributes[0].ISBN[0];
            }
            items.push({
                business: "Amazon",
                link: results[i].DetailPageURL[0],
                price: price,
                type: check.type,
                id: id
            });
        }
        deferred.resolve(items);
    }).catch(function (err) {
        console.log(err);
    });
    return deferred.promise;
};

exports.ItemBuy = function (item) {

};