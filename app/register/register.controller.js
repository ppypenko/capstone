"use strict";
angular.module('app').controller('RegisterController', function ($scope, $rootScope, $window, $location, UserService, AppService, AuthService) {
    $rootScope.page = $location.path();
    $rootScope.webtitle = "Register";
    $scope.user = {
        name: "",
        email: "",
        password: "",
        confirm: ""
    };
    $scope.err = "";
    $scope.terms = false;
    $scope.register = function () {
        var data = {};
        AuthService.registerCheck($scope.user, $scope.terms, function (err) {
            if (err === "") {
                var data = JSON.stringify($scope.user);
                AppService.Register(data).then(function (target) {
                    console.log(target);
                    if (target.err) {
                        $scope.err = "<p>Please fix the following issue(s):</p><ul>" + target.msg + "</ul>";
                    } else {
                        UserService.setUser(target.data);
                        $window.location.href = "#/";
                    }
                }, function (fail) {
                    console.log(fail);
                });
            } else {
                $scope.err = "<p>Please fix the following issue(s):</p><ul>" + err + "</ul>";
            }
        });
    };
});