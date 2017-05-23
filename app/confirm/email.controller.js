"use strict";
angular.module('app').controller('EmailController', function ($scope, $rootScope, $window, $location, UserService, AppService) {
    var sendMail;
    $rootScope.page = $location.path();
    $rootScope.webtitle = "Confirm Email";
    $scope.emailtoken = "";
    $scope.err = "";
    $scope.email = UserService.getEmail();
    $scope.confirmEmail = function () {
        var data = JSON.stringify({
            _id: UserService.getUserID()._id,
            token: UserService.getUserID().token,
            emailtoken: $scope.emailtoken
        });
        AppService.EmailConfirm(data).then(function (check) {
            if (check.err) {
                $scope.err = "<p>Please correct the following</p><ul>" + check.msg + "</ul>";
            } else {
                $window.location.href = "#account";
            }
        });
    };
    $scope.sendEmail = function () {
        sendMail();
    };
    sendMail = function () {
        AppService.EmailSend(UserService.getUserID()).then(function (err) {
            if (err.err) {
                console.log(err.msg);
                $scope.err = "<p>Please correct the following</p><ul>" + err.msg + "</ul>";
            }
        });
    };
    sendMail();
});