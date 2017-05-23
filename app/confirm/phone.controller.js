"use strict";
angular.module('app').controller('PhoneController', function ($scope, $rootScope, $window, $location, UserService, AppService) {
    var sendPhone;
    $rootScope.page = $location.path();
    $rootScope.webtitle = "Confirm Phone";
    $scope.phonetoken = "";
    $scope.err = "";
    $scope.phone = UserService.getPhone();
    $scope.confirmPhone = function () {
        var data = JSON.stringify({
            _id: UserService.getUserID()._id,
            token: UserService.getUserID().token,
            phonetoken: $scope.phonetoken
        });
        AppService.PhoneConfirm(data).then(function (check) {
            if (check.err) {
                $scope.err = "<p>Please correct the following</p><ul>" + check.msg + "</ul>";
            } else {
                $window.location.href = "#account";
            }
        });
    };
    sendPhone = function () {
        AppService.PhoneSend(UserService.getUserID()).then(function (err) {
            if (err.err) {
                $scope.err = "<p>Please correct the following</p><ul>" + err.msg + "</ul>";
            }
        });
    };
    $scope.sendPhone = function () {
        sendPhone();
    };
    sendPhone();
});