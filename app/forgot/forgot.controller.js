"use strict";
angular.module('app').controller('ForgotController', function ($scope, $rootScope, $window, $location, UserService, AuthService, AppService) {
    $scope.input = "";
    $scope.err = "";
    $rootScope.page = $location.path();
    $rootScope.webtitle = "Get Login";
    $scope.options = ["Phone", "Email"];
    $scope.notifyby = $scope.options[1];
    $scope.sendForgot = function () {
        if ($scope.notifyby === $scope.options[0]) {
            AppService.ForgotPhone({
                forgot: $scope.input
            }).then(function (target) {
                if (target.err) {
                    $scope.err = "<p>Please review the following:</p><ul>" + target.msg + "</ul>";
                } else {
                    $window.location.href = "#login";
                }
            });
        } else if ($scope.notifyby === $scope.options[1]) {
            AppService.ForgotEmail({
                forgot: $scope.input
            }).then(function (target) {
                if (target.err) {
                    $scope.err = "<p>Please review the following:</p><ul>" + target.msg + "</ul>";
                } else {
                    $window.location.href = "#login";
                }
            });
        }
    };
});