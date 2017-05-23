"use strict";
angular.module('app').controller('MainController', function ($scope, $rootScope, $window, $location, UserService, AppService, config) {
    $rootScope.page = $location.path();
    $rootScope.logd = UserService.getLogd();
    $rootScope.webtitle = "Product Search";
    $scope.confirm = false;
    $scope.msg = "";
    $scope.searchpage = 1;
    $scope.maxprice = 0;
    $scope.minprice = 0;
    $scope.keyword = "";
    $scope.index = "";
    $scope.results = [];
    $scope.date = {};
    $scope.prices = [];
    $scope.titles = [];
    $scope.bots = [];
    $scope.amounts = [];
    $scope.category = config.searchParams[0];
    $scope.options = config.searchParams;
    $scope.err = "";
    $scope.add = function (index) {
        var item = {
            _id: UserService.getUserID()._id,
            token: UserService.getUserID().token,
            item: {
                id: UserService.getUserID()._id,
                upc: $scope.results.ids[index].upc,
                ean: $scope.results.ids[index].ean,
                isbn: $scope.results.ids[index].isbn,
                title: $scope.titles[index],
                price: $scope.prices[index],
                bot: false, //$scope.bots[index],
                amount: 0 //$scope.amounts[index]
            }
        };
        if (!UserService.getLogd()) {
            UserService.setItem(item);
            $window.location.href = "#/login";
        } else {
            AppService.AddItem(item).then(function (msg) {
                if (msg.err) {
                    $scope.err = msg.msg;
                } else {
                    $scope.confirm = true;
                    $scope.msg = "Item Added";
                    setTimeout(function () {
                        $scope.confirm = false;
                        $scope.msg = "";
                    }, 2000);
                }
            });
        }
    };
    $scope.search = function () {
        document.body.style.cursor = "progress";
        var item = JSON.stringify({
            index: $scope.category,
            page: $scope.searchpage,
            keyword: $scope.keyword,
            maxprice: $scope.maxprice,
            minprice: $scope.minprice
        });
        AppService.ItemSearch(item).then(function (target) {
            if (target) {
                var date = new Date();
                $scope.prices = new Array(target.ids.length);
                $scope.titles = new Array(target.ids.length);
                $scope.bots = new Array(target.ids.length);
                $scope.amounts = new Array(target.ids.length);
                $scope.prices.fill(0);
                $scope.titles.fill("");
                $scope.bots.fill(false);
                $scope.amounts.fill(0);
                $scope.results = target;
                $scope.date = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
                document.body.style.cursor = "default";
            }
        });
    };
    if (UserService.getItem()) {
        var item = UserService.getItem();
        AppService.AddItem(item).then(function (msg) {
            if (msg.err) {
                $scope.err = msg.msg;
            } else {
                UserService.clearItem();
            }
        });
    }
});