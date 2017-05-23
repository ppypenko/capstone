"use strict";
angular.module('app').controller('LoginController', function ($scope, $rootScope, $location, $window, UserService, AppService) {
    $rootScope.page = $location.path();
    $rootScope.webtitle = "Login";
    $scope.name = UserService.getCookie();
    $scope.password = "";
    $scope.err;
    $scope.login = function () {
        var data = JSON.stringify({
            name: $scope.name,
            password: $scope.password
        });
        AppService.Login(data).then(function (target) {
            if (target.err) {
                $scope.err = "<p>Please fix the following issues:</p><ul>" + target.msg + "</ul>";
            } else {
                UserService.setUser(target.data);
                $window.location.href = "#/";
            }
        });
    };
});