"use strict";
angular.module('app').controller('ListController', function ($scope, $rootScope, $location, UserService, AppService) {
    var getItems,
        itemindex = 0;
    $scope.showEdit = false;
    $rootScope.webtitle = "My Items List";
    $scope.err = "";
    $scope.confirm = false;
    $scope.msg = "";
    $rootScope.page = $location.path();
    $scope.items = [];
    $scope.itemform = {};
    $scope.addresses = [];
    $scope.editItem = function (index) {
        itemindex = index;
        $scope.itemform = $scope.items[index];
        $scope.showEdit = true;
    };
    $scope.cancel = function () {
        $scope.showEdit = false;
    };
    $scope.saveItem = function () {
        AppService.UpdateItem({
            _id: UserService.getUserID()._id,
            token: UserService.getUserID().token,
            item: $scope.itemform
        }).then(function (data) {
            if (data.err) {
                $scope.err = data.msg;
            } else {
                $scope.items[itemindex] = data.data
                $scope.confirm = true;
                $scope.msg = "Item Updated";
                setTimeout(function () {
                    $scope.confirm = false;
                    $scope.msg = "";
                }, 2000);
            }
        });
    };
    $scope.deleteItem = function (index) {
        AppService.DeleteItem({
            _id: UserService.getUserID()._id,
            token: UserService.getUserID().token,
            item: $scope.items[index]._id
        }).then(function (data) {
            if (data.err) {
                $scope.err = data.msg;
            } else {
                $scope.items.splice(index, 1);
                $scope.confirm = true;
                $scope.msg = "Item Deleted";
                setTimeout(function () {
                    $scope.confirm = false;
                    $scope.msg = "";
                }, 2000);
            }
        });
    };
    getItems = function () {
        AppService.GetItemList(UserService.getUserID()).then(function (data) {
            console.log(data.data.items);
            $scope.items = data.data.items;
            $scope.addresses = data.data.addresses;
        });
    };
    getItems();
});