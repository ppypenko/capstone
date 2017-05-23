"use strict";
angular.module('app').factory('config', function () {
    var service = {};

    service.mainApiUrl = "http://localhost:80";
    service.proxyApiUrl = "http://localhost:8080";
    service.emailRegex = new RegExp("[^A-Z]+@[a-z0-9]+.[a-z]{2,}");
    service.passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@!#$^%&*+/=?-])(?=.{10,})");
    service.searchParams = ["All", "Appliances", "ArtsAndCrafts", "Automotive", "Baby", "Beauty", "Books", "Music", "Wireless", "Fashion", "Baby Fashion", "Boys Fashion", "Girls Fashion", "Mens Fashion", "Womens Fashion", "Collectibles", "PCHardware", "Electronics", "Grocery", "Heath", "Home'nGarden", "Industrial", "Luggage", "Magazines", "Movies", "Musical Instruments", "Office", "Lawn'nGarden", "PetSupplies", "Pantry", "Software", "Sporting Goods", "Tools", "Toys", "VideoGames"];
    return service;
});